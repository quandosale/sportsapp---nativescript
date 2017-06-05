import * as StackLayout from "ui/layouts/stack-layout";
import * as socialShareModule from "nativescript-social-share";
import { EventData } from "data/observable";
var image = require("ui/image");
var screenshot = require("nativescript-screenshot");
import * as Toast from 'nativescript-toast';
import observableModule = require("data/observable");
import { Page } from 'ui/page';
import { DrawingPad } from 'nativescript-drawingpad';
var http = require("http");
import { CONFIG } from '../../../../common/config';
import * as  orientationModule from "nativescript-screen-orientation";
export class SessionViewModel extends observableModule.Observable {
    private _hrtGraph: DrawingPad;
    private _calmGraph: DrawingPad;
    private _motionGraph: DrawingPad;

    points = [];
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
        this._hrtGraph = <DrawingPad>mainPage.getViewById('hrtGraph');
        this._calmGraph = <DrawingPad>mainPage.getViewById('calmGraph');
        this._motionGraph = <DrawingPad>mainPage.getViewById('motionGraph');
        if (global.datasetId) {
            this.datasetId = global.datasetId;
            this.getData();
        }
        for (var i = 0; i < 50; i++)
            this.points.push(0);

        var _self = this;
        setTimeout(() => {
            var tt = [1, 1, 1, 50, 120, 160, 130, 140, 160, 130, 140, 160, 130, 140, 160, 130, 140, 160, 130, 140, 160, 170, 200];
            console.log('---------' + tt.length);
            _self._hrtGraph.setPts(tt);
            _self._calmGraph.setPts(tt);
            _self._motionGraph.setPts(tt);

            // _self._hrtGraph.setHrtMark(20, "159");
        }, 1000);
    }
    onSnapShotTap(args: EventData) {
        try {
            Toast.makeText('Screen').show();
            var img = new image.Image();
            var content = <StackLayout.StackLayout>this.mainPage.getViewById('content');

            socialShareModule.shareImage(screenshot.getImage(content));
        } catch (e) {
            console.log("error: " + e);
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
            console.log(JSON.stringify(res, null, 2));
        }, function (error) {
            alert('getdataerror' + JSON.stringify(error));
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


    public setECGPoint(newVal) {

        var temp = this.points.slice(0);
        temp.shift();
        temp.push(newVal);

        this.points = temp;
        this.set('plotPoint', this.points);
    }

    timeInterValID = 0;
    sinXX = 0;
    public onDrawECGtap() {
        console.log('test')
        var self = this;
        this.timeInterValID = setInterval(() => {
            var v = Math.sin(this.sinXX) * 150;
            this.sinXX += 0.1;
            self.setECGPoint(v);
        }, 20);
    }

    public setPtTest() {
        clearInterval(this.timeInterValID);
        var tt = [1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200,];
        console.log('call setPtTest array length: ' + tt.length)
        this._hrtGraph.setPts(tt);
    }

    public addPtTest() {
        clearInterval(this.timeInterValID);
        var tt = Math.random() * 100;
        console.log('call addPoint, value: ' + tt)
        this._hrtGraph.addPoint(tt);
    }

    public getMyDrawing() {
        this._hrtGraph.getDrawing().then((res) => {
            console.log(res);
        });
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
    sinX = 0;

    get hrtGraph() {
        var hrtData = [];
        for (var i = 0; i < 228; i++) {
            var value = (100 + 100 * Math.sin(this.sinX)) / 2;
            this.sinX = this.sinX + 0.03;

            var barHeight = value == 0 ? '0' : value + '%';
            var barMarginBottom = (100 - value) == 0 ? '0' : (100 - value) + '%';
            var barMarginTop = (100 - value) == 0 ? '0' : (100 - value) + '%';
            value = value * 2.5;
            var cValue = Math.floor(value);
            var color = 'rgba(' + 0 + ',' + (255 - cValue) + ',' + cValue + ',1)';

            hrtData.push({ value: barHeight, remain: barMarginBottom, color: color });
        }
        return hrtData;
    }
    get calmGraph() {
        var hrtData = [];
        for (var i = 0; i < 80; i++) {
            var value = Math.floor(Math.random() * 100);

            var barHeight = value == 0 ? '0' : value + '%';
            var barMarginBottom = (100 - value) == 0 ? '0' : (100 - value) + '%';
            hrtData.push({ value: barHeight, remain: barMarginBottom });
        }
        return hrtData;
    }
}