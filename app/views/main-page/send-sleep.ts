import { YourPlugin } from 'a-nativescript-ecg-sleep-analysis';
import * as Toast from "nativescript-toast";
import HTTP = require("http");
import { CONFIG } from '../../common/config';
export class SendSleep {

    queue = []; // sleep Analysis Result Queue
    nPacketIndex = 1;
    nnDateTime: Date;
    isSend: boolean = false;

    constructor() {
        this.nnDateTime = new Date();
    }
    public init() {
        this.nPacketIndex = 1;
        this.queue = [];
        this.nnDateTime = new Date();
    }
    public start() {
        this.init();
        this.isSend = true;
        this.startAnalysis();
    }
    public stop() {
        this.isSend = false;
    }
    public addEcg(ecg: number) {
        if (this.isSend)
            this.queue.push(ecg);
    }

    startAnalysis() {
        var _self = this;
        this.startSleepResultUpload(10000, 1000);
    }

    startSleepResultUpload(_uploadSize: number, _deleay: number) {
        var length = this.queue.length;

        if (length > _uploadSize) {
            let arrUpload = this.queue.splice(0, _uploadSize);

            console.log('if', arrUpload.length);
            this.send(arrUpload);
            this.nPacketIndex++;// next packet
        } else {
            console.log('else', length);
        }
        if (this.isSend)
            setTimeout(() => { this.startSleepResultUpload(_uploadSize, _deleay) }, _deleay);
    }

    send(_arrResult) {
        if (!global.user._id) {
            return;
        }
        let ownerId = global.user._id;
        console.log('owner', ownerId);

        let request_url = CONFIG.SERVER_URL + '/phr/datasets/add';
        var _self = this;
        let heartRate = [0, _arrResult.length];
        let acc = [0, 0, 0, _arrResult.length]
        let value = {
            id: this.nPacketIndex,
            ecg: _arrResult,
            heartRate: heartRate,
            accelX: acc,
            accelY: acc,
            accelZ: acc,
            duration: 10
        };
        let ownerName = "k Test";
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                datetime: this.nnDateTime,
                type: "ECG",
                ownerId: ownerId,
                ownerName: ownerName,
                value: value
            }),
            headers: { "Content-Type": "application/json" },
            timeout: 3000
        }).then(function (result) {
            var res = result.content.toJSON();
            if (res.success) {
                Toast.makeText('Upload success').show();
                console.log('Upload success');
                _self.nPacketIndex++;
            } else {
                // Toast.makeText('Upload fail').show();
            }

        }, function (error) {

            console.error(JSON.stringify(error));
            Toast.makeText('Network error').show();
        });
        this.queue = [];
    }
}