import { YourPlugin } from 'a-nativescript-ecg-sleep-analysis';
import * as Toast from "nativescript-toast";
import HTTP = require("http");
import { CONFIG } from '../../common/config';
export class CalmAnalysis {
    queueResult = []; // sleep Analysis Result Queue(calmness)
    queueHr = []; // heart rate
    queue = [];
    calmLib: YourPlugin;
    constructor() {
        this.calmLib = new YourPlugin();
    }
    public init() {
        this.queue = [];
        this.queueResult = [];
        this.queueHr = [];
    }

    public addEcg(data) {
        if (data == undefined || data == null) return;
        var _self = this;
        this.queue.push(data);
        // console.log('calm queue length', this.queue.length);

        if (this.queue.length >= 10000) {
            // let preTime = new Date().getTime();
            var arrTmp = this.queue;
            setTimeout(() => this._sendEcgData(arrTmp), 0);
            this.queue = [];
            // console.log('delta', new Date().getTime() - preTime);
        }
    }

    _sendEcgData(arrTmp) {
        this.calmLib.addEcgData(arrTmp);
    }

    public start() {
        this.init();
        this.sendEcgToAndroid();
    }

    public stop() {

    }

    sendEcgToAndroid() {
        this.calmLib.startCalmness();
        // setTimeout(() => this._sendAgain(), 3000);
        var _self = this;
        let callback = function (v) {
            if (v.type == "calm") {
                if (v.value != 0) {
                    _self.queueResult.push(v.value);
                }
            }
            if (v.type == "hr") {
                // console.log('heartrate', v.value);
                _self.queueHr.push(v.value);
            }
            else {
                // console.log('nothing', JSON.stringify(v, null, 2));
            }
        }
        this.calmLib.setCalmnessNotyfy(callback).then(
            function (success) {
                // alert('plugin callback' + success);
            });
    }

    preValue = 0;
    getCalmValue() {
        if (this.queueResult.length == 0) return this.preValue;
        this.preValue = this.queueResult.pop();
        return this.preValue;
    }
    getHrValue() {
        if (this.queueHr.length == 0) return -1;
        return this.queueHr.pop();
    }
}