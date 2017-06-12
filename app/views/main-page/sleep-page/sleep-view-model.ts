import dialogs = require("ui/dialogs");
import bluetooth = require("nativescript-bluetooth");
import * as platform from 'platform';
import * as Toast from "nativescript-toast";
import * as TimeDatePicker from 'nativescript-timedatepicker';
import { Observable } from 'data/observable';
import pages = require("ui/page");
import { YourPlugin } from 'a-nativescript-ecg-sleep-analysis';
import * as  orientationModule from "nativescript-screen-orientation";
import { AppSetting } from '../../../common/app-setting';
import { CONFIG } from '../../../common/config';
import navigator = require("../../../common/navigator");
export class SleepViewModule extends Observable {
    page: pages.Page;
    time: Date;

    constructor(page) {
        super();
        orientationModule.setCurrentOrientation("portrait", function () {
            console.log("landscape orientation set");
        });
        this.page = page;
        this.setTimeForDisplay();
        this.getDevice();
        this.set("remain", "--:--:--");
    }
    onSongConfigTap() {

        var options = {
            title: "",
            message: "Ringtone",
            cancelButtonText: "Default",
            actions: ["Beep", "ClockBird", "Daydream", "Dolphn", "GetUp", "GOODLuck", "GoodNewDay", "From SD Card"]
        };
        var _self = this;
        dialogs.action(options).then((result: string) => {
            console.log(result);
            switch (result) {
                case "Beep":
                    _self.setSound(result);
                    break;
                case "ClockBird":
                    _self.setSound(result);
                    break;
                case "Daydream":
                    _self.setSound(result);
                    break;
                case "Dolphn":
                    _self.setSound(result);
                    break;
                case "GetUp":
                    _self.setSound(result);
                    break;
                case "GOODLuck":
                    _self.setSound(result);
                    break;
                case "GoodNewDay":
                    _self.setSound(result);
                    break;
                case "From SD Card":
                    _self.selectSongFromSDCard();
                    break;
            }
        });
    }
    selectSongFromSDCard() {
        try {
            let _self = this;
            let callback = function (v: string) {
                console.log(v);
            }
            var filepicker: YourPlugin = new YourPlugin();
            filepicker.show(callback)
                .then((success) => {
                    console.log('r:', success);
                    let v: string = success.toString();
                    let ext = v.substr(v.length - 3, 3);
                    console.log(ext)
                    if ("mp3 wav mid".indexOf(ext.toLocaleLowerCase()) != -1) {
                        // var soundPath = "file:///sdcard/noti.wav";
                        let fPos = v.indexOf("external_files/");
                        let soundPath = "file:///sdcard/" + v.substr(fPos + 15, v.length - fPos - 15);
                        console.log('realPath', soundPath);
                        _self.setSound(soundPath);
                    }
                    else {
                        Toast.makeText("No supported file").show();
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        } catch (e) { }
    }
    setSound(soundPath: string) {
        global.alarmSound = soundPath;
        AppSetting.setSound(soundPath);
    }

    onSleepTap() {
        console.log('wakeup time', this.time);
        if (!this.isFound) {
            Toast.makeText("Device not Found").show();
            return;
        }
        if (this.time) {
            global.wakeuptime = this.time;
            navigator.navigateToWakeUp();
        } else {
            Toast.makeText("Select wake up time").show();
        }
    }
    getDevice() {
        let device = AppSetting.getDevice();
        if (device == null) {
            this.set("tip", "Device not registered");
            return;
        }
        this.doStartScanning(device.UUID);
    }

    public getMacAddress(): string {
        return platform.device.uuid;
    }

    public doStartScanning(mac) {
        if (!mac) return;
        var _self = this;
        _self.set("isLoadding", true);
        _self.set("tip", "scanning ble devices: " + mac);
        // On Android 6 we need this permission to be able to scan for peripherals in the background.
        bluetooth.hasCoarseLocationPermission().then(
            function (granted) {
                console.log('ble permission enable:', granted);
                if (!granted) {
                    bluetooth.requestCoarseLocationPermission().then(e => {
                        console.log('req permision', e);
                        setTimeout(() => _self.doStartScanning(mac), 1000);
                    });
                } else {
                    bluetooth.startScanning({
                        serviceUUIDs: [], // pass an empty array to scan for all services
                        seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
                        onDiscovered: function (peripheral: bluetooth.Peripheral) {
                            if (peripheral.UUID == mac) {
                                _self.isFound = true;
                            }
                        }
                    }).then(function () {
                        _self.set('isLoading', false);
                        if (_self.isFound) {
                            _self.set("tip", "Found device");
                        } else {
                            // if device is not found then again
                            _self.set("tip", "Cannot found device");
                            setTimeout(() => _self.doStartScanning(mac), 1000);
                        }
                    },
                        function (err) {
                            _self.set('isLoading', false);
                            _self.set("tip", "Error while scaning devices");
                            setTimeout(() => _self.doStartScanning(mac), 1000);
                        });
                }
            });
    }
    isFound = false; // flag for device found
    isColon = true;  // display for second tick.

    setTimeForDisplay() {
        var _self = this;
        setInterval(() => {
            var date = new Date();
            var dateStr = this.timeFormat(date, _self.isColon);
            _self.isColon = !_self.isColon;
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
        }
    }

    setWakeUpTime() {
        var _self = this;
        let mCallback = ((resultTime: string) => {
            if (resultTime) {
                if (resultTime == undefined) return;
                let posSemicolon = resultTime.indexOf(':');
                let hhStr = resultTime.substr(posSemicolon - 2, 2);
                let mmStr = resultTime.substr(posSemicolon + 1, 2);
                let alarmTime = new Date();

                let hh = parseInt(hhStr);
                let mm = parseInt(mmStr);

                let alarmHH = alarmTime.getHours();
                if (alarmHH > hh) alarmTime.setDate(alarmTime.getDate() + 1);
                alarmTime.setHours(hh);
                alarmTime.setMinutes(mm);
                alarmTime.setSeconds(0);
                console.log('1', resultTime, alarmTime);
                _self.time = new Date(alarmTime);
                _self.setRemainTime();
            }
        });
        //Initialize the PickerManager (.init(yourCallback, title, initialDate))
        TimeDatePicker.init(mCallback, null);

        //Show the dialog
        TimeDatePicker.showTimePickerDialog();
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