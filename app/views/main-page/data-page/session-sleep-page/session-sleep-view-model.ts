var screenshotModule = require("nativescript-screenshot");
import * as Toast from 'nativescript-toast';
var image = require("ui/image");
var imageSourceModule = require("image-source");
import * as StackLayout from "ui/layouts/stack-layout";
import * as socialShareModule from "nativescript-social-share";
var http = require("http");
import { Observable, EventData } from 'data/observable';
var frameModule = require("ui/frame");
import { ObservableArray } from "data/observable-array";
import listViewModule = require("nativescript-telerik-ui-pro/listview");
import { ListViewEventData } from "nativescript-telerik-ui-pro/listview";
import { DrawingPad } from 'nativescript-drawingpad';
import { Page } from 'ui/page';
import * as  orientationModule from "nativescript-screen-orientation";
import { CONFIG } from '../../../../common/config';
import navigator = require("../../../../common/navigator");
import { DataItem } from './data-item'
export class SessionViewModel extends Observable {
    sleepPoints = [];
    private _items: ObservableArray<DataItem>;
    private _spiderGraph: DrawingPad;
    private _sleepmapGraph: DrawingPad;

    chart;
    testValue = [];
    index = 0;
    queue = [];
    datasetId = "";
    mainPage;
    constructor(mainPage: Page) {
        super();
        orientationModule.setCurrentOrientation("portrait", function () {
            console.log("landscape orientation set");
        });
        this.mainPage = mainPage;
        this._spiderGraph = <DrawingPad>mainPage.getViewById('spiderGraph');
        this._sleepmapGraph = <DrawingPad>mainPage.getViewById('sleepmapGraph');

        this.initDataItems();
        for (var i = 0; i < 5; i++)
            this.sleepPoints.push(0);
        this.set('_sleepPoints', this.sleepPoints);
        var _self = this;
        if (global.datasetId) {
            this.datasetId = global.datasetId;
            this.getData();
        }

    }

    getData() {
        let request_url = CONFIG.SERVER_URL + '/phr/datasets/get/' + this.datasetId;
        var _self = this;
        http.request({
            url: request_url,
            method: "GET",
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            console.log('------------------ get success---------------------');
            _self.processData(res);
            // console.log(JSON.stringify(res, null, 2));
        }, function (error) {
            Toast.makeText('getdataerror' + JSON.stringify(error)).show();
        });
    }
    processData(res) {
        let max_heart_rate = res.data.max_heart_rate;
        let datetime = res.data.datetime;
        let timeStr = this.dateFormat(new Date(datetime));
        let timeAMPM = this.dateFormatAmPm(new Date(datetime));
        this.set("_max_heart_rate", max_heart_rate);
        this.set("_datetime", timeStr);
        this.set("_datetimeampm", timeAMPM);
        let duration = res.data.data.duration;
        let durationStr = this.msToHourMinutes(duration);
        this.set("_duration", durationStr);

        let resting_heart_rate = res.data.data.resting_heart_rate;
        this.set("_resting_heart_rate", resting_heart_rate);



        let shallow_sleep = res.data.data.shallow_sleep;
        let rem = res.data.data.rem;
        let awake = res.data.data.awake;
        let deep_sleep = res.data.data.deep_sleep;
        let MAXVALUE = 300;
        let MAXWIDTH = 200
        this.set("_shallow_sleep", shallow_sleep + " minutes");
        this.set("_rem", rem + " minutes");
        this.set("_awake", awake + " minutes");
        this.set("_deep_sleep", deep_sleep + " minutes");
        this.set("_shallow_sleep_w", Math.floor(shallow_sleep * MAXWIDTH / MAXVALUE));
        this.set("_rem_w", Math.floor(rem * MAXWIDTH / MAXVALUE));
        this.set("_awake_w", Math.floor(awake * MAXWIDTH / MAXVALUE));
        this.set("_deep_sleep_w", Math.floor(deep_sleep * MAXWIDTH / MAXVALUE));
        var sleepmap = res.data.data.sleep_map;
        let sleepQuality = res.data.data.sleep_quality;
        this.set("_sleepMapPoints", sleepmap);
        this._spiderGraph.setPts(sleepQuality);
        this._sleepmapGraph.setPts(sleepmap);
    }

    msToHourMinutes(x: number) {
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
        return hoursStr + ':' + minsStr;
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

        let result: String = `${hh}:${min}`;
        return result;
    }

    dateFormatAmPm(dateTime: Date): String {
        let hour = dateTime.getHours();
        if (hour > 12) return "PM";
        else return "AM";
    }

    onSnapShotTap(args: EventData) {
        try {
            Toast.makeText('Screen').show();
            var img = new image.Image();
            var content = <StackLayout.StackLayout>this.mainPage.getViewById('content');

            socialShareModule.shareImage(screenshotModule.getImage(content));
        } catch (e) {
            console.log("error: " + e);
        }
    }


    enQueue(value) {
        this.queue.push(value);
    }
    deQueue() {
        var preValue = Math.sin(this.index) * 100;
        if (this.queue.length > 0) {
            preValue = this.queue.shift();
        }
        return preValue;
    }


    get hrtData() {
        return [
            { Category: "Mar", Amount: 65.0 },
            { Category: "Apr", Amount: 62.0 },
            { Category: "May", Amount: 55.0 },
            { Category: "Jun", Amount: 71.0 }
        ];
    }
    get hrtGraph() {
        var hrtData = [];
        for (var i = 0; i < 80; i++) {
            var value = Math.floor(Math.random() * 100);
            var barHeight = value == 0 ? '0' : value + '%';
            var barMarginBottom = (100 - value) == 0 ? '0' : (100 - value) + '%';
            hrtData.push({ value: barHeight, remain: barMarginBottom });
        }
        return hrtData;
    }
    get dataItems() {
        return this._items;
    }

    public onAddItemClick(args: listViewModule.ListViewEventData) {
        var id = Math.round(Math.random() * 100);
        this._items.push(new DataItem(id, "Excercise session " + id + " at 10:00 AM", "Duration 8:12:34 | Resting HR 64", false, 0));
    }

    public onResetClick(args: listViewModule.ListViewEventData) {
        while (this._items.length) {
            this._items.pop();
        }
    }

    public onUpdateItemClick(args: listViewModule.ListViewEventData) {
        for (var index = 0; index < this._items.length; index++) {
            this._items.getItem(index).id = Math.random() * 100;
            this._items.getItem(index).itemName = "This is an updated item";
            this._items.getItem(index).itemDescription = "This is the updated item's description.";
        }
    }

    public onRemoveItemClick(args: listViewModule.ListViewEventData) {
        this._items.splice(this._items.length - 1, 1);
    }

    private initDataItems() {
        this._items = new ObservableArray<DataItem>();
        var id = Math.round(Math.random() * 100);
        this._items.push(new DataItem(id, "Excercise session " + id + " at 10:00 AM", "Duration 8:12:34 | Resting HR 64", true, 0));
        var id = Math.round(Math.random() * 100);
        this._items.push(new DataItem(id, "Excercise session " + id + " at 10:00 AM", "Duration 8:12:34 | Resting HR 64", false, 1));
    }

}