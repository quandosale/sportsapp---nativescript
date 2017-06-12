import observableModule = require("data/observable");
import { ObservableArray } from "data/observable-array";
import listViewModule = require("nativescript-telerik-ui-pro/listview");
import { ListViewEventData } from "nativescript-telerik-ui-pro/listview";
import timer = require("timer");
import * as  orientationModule from "nativescript-screen-orientation";
import * as dialogs from "ui/dialogs";
var http = require("http");
import * as Toast from "nativescript-toast";
import navigator = require("../../../common/navigator");
import { CONFIG, LEVEL } from '../../../common/config';
import { DataItem } from './data-item';
import { AppSetting } from '../../../common/app-setting';
export class ViewModel extends observableModule.Observable {
    _dataItems: ObservableArray<DataItem>;
    datatypeFilter: string = "all";
    isDeleteMode = false;

    constructor() {
        super();
        orientationModule.setCurrentOrientation("portrait", function () {
            console.log("landscape orientation set");
        });
        this._dataItems = new ObservableArray<DataItem>();
        this.set('menuEditText', 'Edit    ')
        // this.initDataItemsForTest();
        this.getDatas();
    }

    initDataItemsForTest() {
        var id = "" + Math.round(Math.random() * 100);
        this._dataItems.push(new DataItem(id, "Excercise session at 10:00 AM", "Feb 27, 2015", "MON", "Duration 8:12:34 | Resting HR 64", true, 'ecg'));
        id = "" + Math.round(Math.random() * 100);
        this._dataItems.push(new DataItem(id, "Excercise session from 10:00 AM", "Feb 27, 2015", "MON", "Duration 8:12:34 | Resting HR 64", false, 'sleep'));
    }

    onEditTap() {
        this.isDeleteMode = !this.isDeleteMode;
        this.set('_isDeleteMode', this.isDeleteMode);
    }

    onPullToRefreshInitiated(args: listViewModule.ListViewEventData) {
        var that = new WeakRef(this);
        var _self = this;
        timer.setTimeout(function () {
            // var initialNumberOfItems = that.get()._numberOfAddedItems;
            // for (var i = that.get()._numberOfAddedItems; i < initialNumberOfItems + 2; i++) {
            //     if (i > posts.names.length - 1) {
            //         break;
            //     }
            //     var imageUri = application.android ? posts.images[i].toLowerCase() : posts.images[i];

            //     that.get()._items.splice(0, 0, new DataItem(posts.names[i], posts.titles[i], posts.text[i], "res://" + imageUri));
            //     that.get()._numberOfAddedItems++;
            // }
            _self.getDatas();
            var listView = args.object;
            listView.notifyPullToRefreshFinished();
        }, 1000);
    }

    getDatas() {
        let user = AppSetting.getUserData();
        if (user == null) {
            Toast.makeText("User Data No set.").show();
            return;
        } else {
            console.log('User Id', user._id);
        }
        while (this._dataItems.length) {
            this._dataItems.pop();
        }
        let level = user.level;

        let totalStorage = LEVEL[level].sizeOfStorage;
        let totalStorageFormat = this.storageInfoFormat(totalStorage);

        let used: string = this.storageInfoFormat(user.size_of_storage);
        // 1.2GB of 5.0GB used
        let storageInfor: string = `${used} of ${totalStorageFormat} used`;
        this.set('_storageInfor', storageInfor);

        var ownerIDs = [user._id];
        let request_url = CONFIG.SERVER_URL + '/phr/datasets/get';
        var datefrom: Date = new Date();
        datefrom.setFullYear(0);
        var dateto: Date = new Date();
        dateto.setFullYear(3000);

        var _self = this;
        http.request({
            url: request_url,
            method: "POST",
            content: JSON.stringify({
                datefrom: datefrom,
                dateto: dateto,
                ownerIds: ownerIDs,
                datatype: this.datatypeFilter.toUpperCase()
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            _self.processData(res);
            // console.log(JSON.stringify(res, null, 2));
        }, function (error) {
            Toast.makeText('getdataerror' + JSON.stringify(error)).show();
        });
    }

    processData(res) {
        if (res.success) {
            var arrDataset = res.data;

            while (this._dataItems.length) {
                this._dataItems.pop();
            }

            for (let element of arrDataset) {
                let isFirstDataOfDate = this.isFirstDataOfDate(element.datetime);
                var time: string = this.datetimeToTime(element.datetime);
                var date = this.datetimeToDate(element.datetime);
                var day = this.datetimeToDay(element.datetime);

                element.datetime = this.dateFormat(element.datetime);
                let type: string = element.type.toLocaleLowerCase();

                switch (type) {
                    case 'ecg':
                        element.value = 'Show Details';
                        type = 'ECG';
                        element.duration = this.durationFormat(element.data.duration);
                        break;
                    case 'sleep':
                        element.value = 'Show Details';
                        element.duration = this.durationFormat(element.data.duration);
                        type = 'Sleep';
                        break;
                    case 'activity':
                        // element.value = 'Show Details';
                        element.value = element.data.activity.CALORY + 'kcal';
                        type = 'Activity';
                        break;
                    default: {
                        element.value = 'other';
                    }
                }
                element.type = type;

                if (type == "Sleep") {
                    this._dataItems.push(new DataItem(element._id, "Excercise session from " + time, date, day, "Duration " + element.duration + " | Resting HR " + element.data.resting_heart_rate, isFirstDataOfDate, type));
                } else if (type == "ECG") {
                    this._dataItems.push(new DataItem(element._id, "Excercise session at " + time, date, day, "Duration " + element.duration + " | Resting HR " + element.data.max_heart_rate, isFirstDataOfDate, type));
                } else
                    this._dataItems.push(new DataItem(element._id, "Excercise session " + " at " + time, date, day, "Duration " + "0:0:0" + " | Resting HR -1", isFirstDataOfDate, type));
            }
        }
        else {
            Toast.makeText('get data not succes').show();
        }
    }


    get dataItems() {
        return this._dataItems;
    }

    onFilterTap(args) {
        let options = {
            title: "Filter By",
            cancelButtonText: "Cancel",
            actions: ["All", "Activity", "Sleep"]
        };
        dialogs.action(options).then((result) => {
            console.log(result);
            if (result == "All") {
                result = 'all';
            }
            else if (result == "Activity") result = "ecg";
            else {
                result = "BP";
            }
            this.datatypeFilter = result;
            this.getDatas();
        });
    }

    onItemTap(args: ListViewEventData) {
        if (this.isDeleteMode) return;
        var CurrentItemIndex = args.itemIndex;
        var datasetId = this._dataItems.getItem(CurrentItemIndex).id;
        var CurrentItem = this._dataItems.getItem(CurrentItemIndex).dataType.toLocaleLowerCase();
        global.datasetId = datasetId;
        switch (CurrentItem) {
            case 'ecg': navigator.navigateToSessionEcg(); break;
            case 'sleep': navigator.navigateToSessionSleep(); break;
        }
    }

    preDateMilli = 0;
    isFirstDataOfDate(date: Date): boolean {
        let dateTime: Date = new Date(date);
        let ms = dateTime.setHours(0, 0, 0, 0);
        if (ms != this.preDateMilli) {
            this.preDateMilli = ms;
            return true;
        }
        return false;
    }

    dateFormat(date: Date): String {
        let dateTime = new Date(date);
        let yyyy = dateTime.getFullYear();
        let month = dateTime.getMonth() + 1;
        let mm = (month / 10 >= 1) ? month : ('0' + month);
        let day = dateTime.getDate();
        let dd = (day / 10 >= 1) ? day : ('0' + day);

        let hour = dateTime.getHours();
        let hh = (hour / 10 >= 1) ? hour : ('0' + hour);
        let minute = dateTime.getMinutes();
        let min = (minute / 10 >= 1) ? minute : ('0' + minute);
        let second = dateTime.getSeconds();
        let ss = (second / 10 >= 1) ? second : ('0' + second);

        let result: String = `${mm}/${dd}/${yyyy} ${hh}:${min}:${ss}`;
        return result;
    }

    datetimeToDate(date: Date): string {
        let dateTime = new Date(date);
        let yyyy = dateTime.getFullYear();
        let month = dateTime.getMonth();
        let MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let monthStr = MONTH[month];
        let mm = (month / 10 >= 1) ? month : ('0' + month);
        let day = dateTime.getDate();
        let dd = (day / 10 >= 1) ? day : ('0' + day);

        let result: string = `${monthStr} ${dd}, ${yyyy}`;
        return result;
    }

    datetimeToDay(date: Date): string {
        let dateTime = new Date(date);
        let day = dateTime.getDay();
        let DAYNAMES = ["MON", "TUE", "WES", "THS", "FRI", "SAT", "SUN"];
        return DAYNAMES[day];
    }

    // convert date to Formatted String
    datetimeToTime(date: Date): string {
        let dateTime = new Date(date);
        let hour = dateTime.getHours();
        let ampm = hour < 12 ? "AM" : "PM";
        hour = hour % 12;
        let hh = (hour / 10 >= 1) ? hour : ('0' + hour);
        let minute = dateTime.getMinutes();
        let min = (minute / 10 >= 1) ? minute : ('0' + minute);
        let second = dateTime.getSeconds();
        let ss = (second / 10 >= 1) ? second : ('0' + second);

        let result: string = `${hh}:${min} ${ampm}`;
        return result;
    }

    durationFormat(x: number): string {
        if (x == undefined) x = 0;
        // let ms = x % 1000;
        x = x / 1000;
        x = Math.floor(x);
        let secs = x % 60;
        let secsStr = ('00' + secs).substr(-2);
        x = x / 60;
        x = Math.floor(x);
        let mins = x % 60;
        let minsStr = ('00' + mins).substr(-2);
        x = x / 60;
        x = Math.floor(x);
        let hours = x;
        let hoursStr = ('00' + hours).substr(-2);
        return hoursStr + ':' + minsStr + ':' + secsStr;
    }

    storageInfoFormat(n: number): string {
        if (n == 0) {
            return "0";
        }
        else if (n < 1024) {
            return n + " bytes"
        }
        if (1024 <= n && n < 1024 * 1024) {
            n = n / 1024;
            let r = n.toFixed(0) + " KB";
            return r;
        }
        if (1024 * 1024 <= n && n < 1024 * 1024 * 1024) {
            n = n / 1024 / 1024;
            let r = n.toFixed(0) + " MB";
            return r;
        }
        if (1024 * 1024 * 1024 <= n && n < 1024 * 1024 * 1024 * 1024) {
            n = n / 1024 / 1024 / 1024;
            let r = n.toFixed(0) + " GB";
            return r;
        }
        return "";
    }
}