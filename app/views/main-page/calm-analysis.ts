import { YourPlugin } from 'a-nativescript-ecg-sleep-analysis';
import * as Toast from "nativescript-toast";
import HTTP = require("http");
import { CONFIG } from '../../common/config';
export class CalmAnalysis {
    queueResult = []; // sleep Analysis Result Queue
    queue = [];
    ecgLib: YourPlugin = new YourPlugin();
    constructor() { }
    public init() {
        this.queue = [];
        this.queueResult = [];
    }

    public addEcg(data) {
        if (data == undefined || data == null) return;
        var _self = this;
        this.queue.push(data);
        // console.log('calm queue length', this.queue.length);
        if (this.queue.length >= 10000) {
            this._sendEcgData();
        }
    }

    _sendEcgData() {
        this.ecgLib.addEcgData(this.queue);
        this.queue = [];
    }

    public start() {
        this.init();
        this.sendEcgToAndroid();
    }

    public stop() {

    }

    sendEcgToAndroid() {
        this.ecgLib.startCalmness();
        // setTimeout(() => this._sendAgain(), 3000);
        var _self = this;
        let callback = function (v) {
            if (v.value != 0)
            { _self.queueResult.push(v.value); }

        }
        this.ecgLib.setCalmnessNotyfy(callback).then(
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
}