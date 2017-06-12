import bluetooth = require("nativescript-bluetooth");
import observableArray = require("data/observable-array");
import * as Toast from "nativescript-toast";
import { Observable } from 'data/observable';
import { EventData } from "data/observable";
import pages = require("ui/page");
import { AppSetting } from '../../../../common/app-setting';
import { SendSleep } from '../../send-sleep';

import { CONFIG, BLEConfig } from '../../../../common/config';
import navigator = require("../../../../common/navigator");

import * as NotificationMudule from '../notification';
export class WakeViewModule extends Observable {
    page: pages.Page;
    time;
    _sendSleep: SendSleep = new SendSleep();
    constructor(page) {
        super();
        this.setTimeForDisplay();
        this.page = page;

        if (global.wakeuptime) {
            let time = new Date(global.wakeuptime);
            this.time = new Date(global.wakeuptime);
            this.setRemainTime();

            NotificationMudule.setNotification(this.time);
        }
        this.getDevice();
    }

    getDevice() {
        let device = AppSetting.getDevice();
        if (device != null) {
            this.doStartScanning(device.UUID);
            this._sendSleep.start();
        } else {
            this.set("tip", "global mac not set");
            console.log('mac address not set');
        }
    }

    goBack() {
        this._sendSleep.stop();
        navigator.navigateBack();
    }
    onWakeUpTap() {
        NotificationMudule.clear();
        setTimeout(() => this._sendSleep.stop(), 3 * 60 * 1000);
    }
    onCancelTap() {
        NotificationMudule.clearAll();
        this._sendSleep.stop();
    }

    public doStartScanning(mac) {
        if (!mac) {
            this.set("tip", "mac not set");
            return;
        }
        this.set("tip", "device scanning: " + mac);
        var _self = this;
        // On Android 6 we need this permission to be able to scan for peripherals in the background.
        bluetooth.hasCoarseLocationPermission().then(
            function (granted) {
                console.log(granted);
                if (!granted) {
                    bluetooth.requestCoarseLocationPermission().then(e => {
                        setTimeout(() => _self.doStartScanning(mac), 1000);
                    });
                } else {
                    _self.set('isLoading', true);

                    bluetooth.startScanning({
                        serviceUUIDs: [], // pass an empty array to scan for all services
                        seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
                        onDiscovered: function (peripheral: bluetooth.Peripheral) {
                            if (peripheral.UUID == mac) {
                                _self.isFound = true;
                                _self.set('isLoading', false);
                                bluetooth.stopScanning()
                                    .then(e => {
                                        _self.ConnectDevice(mac);
                                    })
                                    .catch(e => {
                                        _self.set("tip", "disconnecting error");
                                    })
                            }
                        }
                    }).then(function () {
                        _self.set('isLoading', false);
                        if (_self.isFound) {

                        } else {
                            // if device is not found then again
                            _self.set("tip", "Cannot found device");
                            setTimeout(() => _self.doStartScanning(mac), 1000);
                        }
                    },
                        function (err) {
                            _self.set('isLoading', false);
                            _self.set("tip", "Device Scanning error");
                            setTimeout(() => _self.doStartScanning(mac), 1000);
                        });
                }
            });
    }
    isFound = false;
    public ConnectDevice(_UUID) {
        var _self = this;
        _self.set("tip", "Device Connecting");
        bluetooth.connect({
            UUID: _UUID,
            // NOTE: we could just use the promise as this cb is only invoked once
            onConnected: function (peripheral) {
                _self.set("isConnected", true);
                bluetooth.startNotifying({
                    peripheralUUID: _UUID,
                    serviceUUID: BLEConfig.serviceUUID,
                    characteristicUUID: BLEConfig.characteristicUUID,
                    onNotify: function (result) {
                        // result.value is an ArrayBuffer. Every service has a different encoding.
                        // fi. a heartrate monitor value can be retrieved by:
                        var data = new Uint8Array(result.value);

                        if (data[0] == 1) {
                            _self.set('isConnected', true);
                        } else {
                            _self.set('isConnected', false);
                        }
                        let ecgSize = data[1];

                        for (let i = 0; i < ecgSize; i++) {
                            let ecgValue = data[2 + 2 * i] + data[2 + 2 * i + 1] * 255;
                            if (ecgValue > 2500) continue;

                            if (data[0] == 1) { // hand connected
                                _self._sendSleep.enQueue(ecgSize);
                            } else {
                                _self._sendSleep.enQueue(ecgSize);
                            }
                        }
                        _self.set('tip', "packetNumber: " + _self._sendSleep.nPacketIndex + "  ,queue size: " + _self._sendSleep.queue.length);
                    }
                }).then(function (result) {
                    console.log('end', result);
                });
            },
            onDisconnected: function (peripheral) {
                _self.set("isConnected", false);
                _self.set("tip", "Device disconnected");
                _self.getDevice();
            }
        });
    }
    isSemicolon = true;
    setTimeForDisplay() {
        var _self = this;
        setInterval(() => {
            var date = new Date();
            var dateStr = this.timeFormat(date, _self.isSemicolon);
            _self.isSemicolon = !_self.isSemicolon;
            this.set('displayTime', dateStr)
        }, 500);
    }

    setRemainTime() {
        let nowdate = new Date();
        let alarmTime = this.time;
        let distance = alarmTime.getTime() - nowdate.getTime();
        let remainStr = this.msToTime(distance);

        if (distance >= 0) {
            this.set("remain", remainStr);
            setTimeout(() => this.setRemainTime(), 1000);
        } else {
            navigator.navigateToSnooze();
        }
    }

    timeFormat(date: Date, isSemicolon) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hour < 12 ? "AM" : "PM"
        hour = hour % 12;
        let hourStr = ('00' + hour).substr(-2);
        let minStr = ('00' + minutes).substr(-2);
        if (isSemicolon)
            return `${hourStr}:${minStr} ${ampm}`;
        else return `${hourStr} ${minStr} ${ampm}`;
    }

    msToTime(x: number) {
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
}
