import observableModule = require("data/observable");
import { ObservableArray } from "data/observable-array";
import listViewModule = require("nativescript-telerik-ui-pro/listview");
import { ListViewEventData } from "nativescript-telerik-ui-pro/listview";
import timer = require("timer");
import * as  orientationModule from "nativescript-screen-orientation";
import * as dialogs from "ui/dialogs";
var http = require("http");
import * as utils from "utils/utils";
import * as Toast from "nativescript-toast";
import navigator = require("../../../common/navigator");
import { CONFIG, LEVEL } from '../../../common/config';
import { DataItem } from './data-item';
import { AppSetting } from '../../../common/app-setting';
import { DataService } from '../../../service/data-service';
var DELTA = 0.1;
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
        this.initDataItemsForTest();
        this.getDatas();
        // let _data = DataService.getData();
        // if (_data) {
        //     _data.forEach(item => {
        //         this._dataItems.push(item);
        //     });
        // } else {
        //     Toast.makeText('Data Loading').show();
        // }
    }

    initDataItemsForTest() {
        var id = "" + Math.round(Math.random() * 100);
        this._dataItems.push(new DataItem(id, "Excercise session at 10:00 AM", "Feb 27, 2015", "MON", "Duration 8:12:34 | Resting HR 64", true, 'exercise'));
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

        var _self = this;
        http.request({
            url: request_url,
            method: "POST",
            content: JSON.stringify({
                datefrom: "",
                dateto: "",
                ownerIds: ownerIDs,
                datatype: this.datatypeFilter.toLowerCase()
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

    onTap_DeletePost() {
        var _self = this;
        dialogs.confirm("Are you sure delete data ?").then(function (result) {
            console.log("Dialog result: " + result);
            if (result) _self.deleteDataRequest();
        });
    }
    private deleteDataRequest() {

        if (this._currentItemIndex >= 0) {
            let id_delete_dataset = this.dataItems.getItem(this._currentItemIndex).id;
            console.log(id_delete_dataset);
            let request_url = CONFIG.SERVER_URL + '/phr/datasets/delete/' + id_delete_dataset;
            var _self = this;
            http.request({
                url: request_url,
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                timeout: CONFIG.timeout
            }).then(function (result) {
                var res = result.content.toJSON();
                console.log(JSON.stringify(res, null, 2));
                if (res.success) {
                    _self.getDatas();
                } else {
                    Toast.makeText(res.message).show();
                }
            }, function (error) {
                Toast.makeText('delete data error' + JSON.stringify(error)).show();
            });
        }
    }
    processData(res) {
        if (res.success) {
            var arrDataset = res.data;
            while (this._dataItems.length) {
                this._dataItems.pop();
            }

            for (let element of arrDataset) {
                console.log(JSON.stringify(element));
                let isFirstDataOfDate = this.isFirstDataOfDate(element.datetime);
                var time: string = this.datetimeToTime(element.datetime);
                var date = this.datetimeToDate(element.datetime);
                var day = this.datetimeToDay(element.datetime);

                element.datetime = this.dateFormat(element.datetime);
                let type: string = element.type.toLocaleLowerCase();

                switch (type) {
                    case 'exercise':
                        element.duration = this.durationFormat(element.duration);
                        break;
                    case 'sleep':
                        element.duration = this.durationFormat(element.duration);
                        break;
                    default: {
                    }
                }

                if (type == "sleep") {
                    let resting_heart_rate = element.data.resting_heart_rate ? element.data.resting_heart_rate : 0;
                    this._dataItems.push(new DataItem(element._id, "Sleep Data from " + time, date, day, "Duration " + element.duration + " | Resting HR " + resting_heart_rate, isFirstDataOfDate, type));
                } else if (type == "exercise") {
                    let max_heart_rate = element.data.max_heart_rate ? element.data.max_heart_rate : 0;
                    this._dataItems.push(new DataItem(element._id, "Excercise session at " + time, date, day, "Duration " + element.duration + " | Resting HR " + max_heart_rate, isFirstDataOfDate, type));
                }
            }
        }
        else {
            Toast.makeText('get data not succes').show();
        }
    }


    get dataItems() {
        return this._dataItems;
    }

    onFilterTap() {
        let options = {
            title: "Filter By",
            cancelButtonText: "Cancel",
            actions: ["All", "Exercise", "Sleep"]
        };
        dialogs.action(options).then((result) => {
            console.log(result);
            if (result == "Cancel" || result == null || result == undefined) return;
            if (result == "All") { this.datatypeFilter = 'all'; }
            else if (result == "Exercise") { this.datatypeFilter = "exercise"; }
            else if (result == "Sleep") { this.datatypeFilter = "sleep"; }

            this.getDatas();
        });
    }
    onStartSwipeCell(args: ListViewEventData) {
        var density = utils.layout.getDisplayDensity();
        var delta = Math.floor(density) !== density ? 1.1 : DELTA;

        args.data.swipeLimits.top = 0;
        args.data.swipeLimits.left = Math.round(density * 100);
        args.data.swipeLimits.bottom = 0;
        args.data.swipeLimits.right = Math.round(density * 100);
        args.data.swipeLimits.threshold = Math.round(density * 50);
    }
    _currentItemIndex = -1;
    onCellSwiped(args: ListViewEventData) {
        this._currentItemIndex = args.index;
        console.log(this._currentItemIndex);
    }
    onItemTap(args: ListViewEventData) {
        if (this.isDeleteMode) return;
        var CurrentItemIndex = args.index;
        var datasetId = this._dataItems.getItem(CurrentItemIndex).id;
        var CurrentItem = this._dataItems.getItem(CurrentItemIndex).dataType.toLocaleLowerCase();
        switch (CurrentItem) {
            case 'exercise': navigator.navigateToSessionEcg(datasetId); break;
            case 'sleep': navigator.navigateToSessionSleep(datasetId); break;
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