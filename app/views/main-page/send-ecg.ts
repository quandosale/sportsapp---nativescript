import * as Toast from "nativescript-toast";
import HTTP = require("http");
import { AppSetting } from '../../common/app-setting';
import { CONFIG } from '../../common/config';

export class SendEcg {
    queue = [];
    nnDateTime = new Date();
    nPacketIndex = 1;
    isSend: boolean = false;
    SizeUpload = 10000;
    constructor() {
        this.queue = [];
        this.nnDateTime = new Date();
        this.nPacketIndex = 1;
        this.user = AppSetting.getUserData();
    }
    user;

    public init() {
        this.nPacketIndex = 1;
        this.queue = [];
        this.nnDateTime = new Date();

    }
    public start() {
        this.isSend = true;
        this.send();
    }
    public stop() {
        this.isSend = false;
        this.init();
    }

    public enQueue(value) {
        if (!this.isSend) return;
        if (value >= 0 && value < 0x7FFF && this.isSend)
            this.queue.push(value);
        else {
            // console.log('Data bound over: ' + value);
        }
    }
    public deQueue() {
        let preValue = -1;
        if (this.queue.length > 0) {
            preValue = this.queue.shift();
        }
        return preValue;
    }

    send() {
        if (this.user == null) {
            return;
        }

        if (this.queue.length > this.SizeUpload) {
            let request_url = CONFIG.SERVER_URL + '/phr/datasets/add';

            var _self = this;
            let ecg = this.queue.splice(0, this.SizeUpload);
            let heartRate = [0, ecg.length];
            let acc = [0, 0, 0, ecg.length]
            let value = {
                id: this.nPacketIndex,
                ecg: ecg,
                heartRate: heartRate,
                accelX: acc,
                accelY: acc,
                accelZ: acc,
                duration: 10
            };
            HTTP.request({
                method: "POST",
                url: request_url,
                content: JSON.stringify({
                    datetime: this.nnDateTime,
                    type: "exercise",
                    ownerId: this.user._id,
                    ownerName: this.user.firstname,
                    value: value
                }),
                headers: { "Content-Type": "application/json" },
                timeout: 3000
            }).then(function (result) {
                var res = result.content.toJSON();

                if (res.success) {
                    // Toast.makeText('Upload success').show();
                    console.log('Upload success');
                    Toast.makeText('Upload success').show();
                    _self.nPacketIndex++;
                    if (_self.isSend)
                        setTimeout(() => _self.send(), 1000);
                }
                else {
                    // Toast.makeText('Upload fail').show();
                }

            }, function (error) {
                Toast.makeText('Network error').show();
            });
        } else {
            setTimeout(() => this.send(), 1000);
        }
    }
}