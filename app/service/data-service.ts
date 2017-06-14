import * as Toast from "nativescript-toast";
var http = require("http");
import { ObservableArray } from "data/observable-array";
import { AppSetting } from '../common/app-setting';
import { CONFIG, LEVEL } from '../common/config';
import { DataItem } from './data-item';
export class DataService {

    static data: ObservableArray<DataItem>;
    public constructor() {
        // uncalled constructor
        console.log('data service', '------------------------  constructor');
        // this.getDatasFromServer();
    }
    public static getData(dataType?: string) {
        console.log('data service', '------------------------  getdata', dataType);
        if (dataType == undefined)
            return DataService.data;
        else {
            return DataService.data.filter((data: DataItem, index: number) => {
                return data.dataType == dataType;
            });
        }
    }
    public static addData(data: DataItem) {
        DataService.data.push(data);
    }
    public static getDatasFromServer() {
        console.log('data service', '------------------------  getDatasFromServer 1');
        let user = AppSetting.getUserData();
        if (user == null) {
            Toast.makeText("User Data No set.").show();
            return;
        }
        console.log('data service', '------------------------  getDatasFromServer 2');
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
                datatype: 'all'
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            DataService.processData(res);
            console.log('data service', '------------------------  getDatasFromServer 3');
            console.log(JSON.stringify(res, null, 2));
        }, function (error) {
            console.log('data service', '------------------------  getDatasFromServer 4 error');
            console.log('getdata error', 'data service');
            Toast.makeText('getdataerror' + JSON.stringify(error)).show();
        });
    }
    private static processData(res) {
        console.log('data service', '------------------------  getDatasFromServer process', res.succes);
        if (res.success) {
            var arrDataset = res.data;

            while (DataService.data.length) {
                DataService.data.pop();
            }

            for (let element of arrDataset) {
                let isFirstDataOfDate = DataService.isFirstDataOfDate(element.datetime);
                var time: string = DataService.datetimeToTime(element.datetime);
                var date = DataService.datetimeToDate(element.datetime);
                var day = DataService.datetimeToDay(element.datetime);

                element.datetime = DataService.dateFormat(element.datetime);
                let type: string = element.type.toLocaleLowerCase();

                switch (type) {
                    case 'exercise':
                        element.duration = DataService.durationFormat(element.data.duration);
                        break;
                    case 'sleep':
                        element.duration = DataService.durationFormat(element.data.duration);
                        break;
                    default: {
                    }
                }

                if (type == "sleep") {
                    let resting_heart_rate = element.data.resting_heart_rate ? element.data.resting_heart_rate : 0;
                    DataService.data.push(new DataItem(element._id, "Sleep Data from " + time, date, day, "Duration " + element.duration + " | Resting HR " + resting_heart_rate, isFirstDataOfDate, type));
                } else if (type == "exercise") {
                    let max_heart_rate = element.data.max_heart_rate ? element.data.max_heart_rate : 0;
                    DataService.data.push(new DataItem(element._id, "Excercise session at " + time, date, day, "Duration " + element.duration + " | Resting HR " + max_heart_rate, isFirstDataOfDate, type));
                }
            }
        }
        else {
            Toast.makeText('get data not succes').show();
        }
    }
    static preDateMilli = 0;
    static isFirstDataOfDate(date: Date): boolean {
        let dateTime: Date = new Date(date);
        let ms = dateTime.setHours(0, 0, 0, 0);
        if (ms != this.preDateMilli) {
            this.preDateMilli = ms;
            return true;
        }
        return false;
    }
    // convert date to Formatted String
    static datetimeToTime(date: Date): string {
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
    static datetimeToDay(date: Date): string {
        let dateTime = new Date(date);
        let day = dateTime.getDay();
        let DAYNAMES = ["MON", "TUE", "WES", "THS", "FRI", "SAT", "SUN"];
        return DAYNAMES[day];
    }
    static dateFormat(date: Date): String {
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
    static durationFormat(x: number): string {
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
    static datetimeToDate(date: Date): string {
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

}