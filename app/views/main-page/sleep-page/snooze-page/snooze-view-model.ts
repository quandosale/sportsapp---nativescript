var tnsfx = require('nativescript-effects');
import { TNSPlayer } from 'nativescript-audio';
import dialogs = require("ui/dialogs");
import bluetooth = require("nativescript-bluetooth");
import observableArray = require("data/observable-array");
import * as Toast from "nativescript-toast";
import HTTP = require("http");
import { Observable } from 'data/observable';
import pages = require("ui/page");
import * as LocalNotifications from "nativescript-local-notifications";
import * as vibrator from "nativescript-vibrate";
import * as ButtonModel from 'ui/button';
import * as  orientationModule from "nativescript-screen-orientation";
import { AppSetting } from '../../../../common/app-setting';
import { SendSleep } from '../../send-sleep'
import { SendEcg } from '../../send-ecg';
import { CONFIG, BLEConfig } from '../../../../common/config';
import navigator = require("../../../../common/navigator");
import { DataItem } from './data-item';
import * as NotificationMudule from '../notification';
export class SnoozeViewModule extends Observable {
    page: pages.Page;
    private _player: TNSPlayer;
    time;
    sendsleep: SendSleep = new SendSleep();
    private _arrDevice = new observableArray.ObservableArray<DataItem>();
    constructor(page) {
        super();
        orientationModule.setCurrentOrientation("portrait", function () {
            console.log("landscape orientation set");
        });
        this.setTimeForDisplay();
        this.page = page;
        this.getDevice();
        if (global.wakeuptime) {
            let time = new Date(global.wakeuptime);
            this.time = new Date(global.wakeuptime)
        }

        this._player = new TNSPlayer();
        var soundPath = "file:///sdcard/noti.wav";
        soundPath = "android.resource://calm.sportsapp.com/raw/noti";
        this._player.initFromFile({
            audioFile: '~/audio/angel.mp3', // ~ = app directory '~/song.mp3'
            loop: false,
            completeCallback: this._trackComplete.bind(this),
            errorCallback: this._trackError.bind(this)
        }).then(() => {

            this._player.getAudioTrackDuration().then((duration) => {
                // iOS: duration is in seconds
                // Android: duration is in milliseconds
                console.log(`song duration:`, duration);
            });
        });
    }
    public togglePlay() {

        if (this._player.isAudioPlaying()) {
            this._player.pause();
            console.log('pause ');
        } else {
            this._player.play();
            console.log('play');
        }
    }

    private _trackComplete(info: any) {
        console.log('reference back to player:', info.player);
        // iOS only: flag indicating if completed succesfully
        console.log('whether song play completed successfully:', info.flag);
    }

    private _trackError(info: any) {
        console.log('reference back to player:', info.player);
        console.log('the error:', info.error);

        // Android only:
        console.log('extra info on the error:', info.extra);
    }
    onWakeUpTap() {
        vibrator.vibration(2000);
        NotificationMudule.clear();
        setTimeout(() => this.sendsleep.stop(), 3 * 60 * 1000);
    }
    onSnoozeTap() {
        let after5Minutes: Date = new Date();
        this.time = after5Minutes;
        after5Minutes.setMinutes(after5Minutes.getMinutes() + 5);
        NotificationMudule.setNotification(after5Minutes);

        global.wakeuptime = after5Minutes;
        navigator.navigateToWakeUp();
    }

    getDevice() {
        let device = AppSetting.getDevice();
        if (device == null) {
            Toast.makeText("Device is not registered").show();
            return;
        }
        this.doStartScanning(device.UUID);
    }

    public doStartScanning(mac) {
        if (!mac) return;
        var _self = this;
        // On Android 6 we need this permission to be able to scan for peripherals in the background.
        bluetooth.hasCoarseLocationPermission().then(
            function (granted) {
                console.log(granted);
                if (!granted) {
                    bluetooth.requestCoarseLocationPermission();
                }
                _self.set('isLoading', true);
                // reset the array
                _self._arrDevice.splice(0, _self._arrDevice.length);
                bluetooth.startScanning({
                    serviceUUIDs: [], // pass an empty array to scan for all services
                    seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
                    onDiscovered: function (peripheral: bluetooth.Peripheral) {
                        var obsp = new DataItem(peripheral.UUID, peripheral.name, false);
                        _self._arrDevice.push(obsp);
                    }
                }).then(function () {
                    _self.set('isLoading', false);
                    console.log('arrDevice.length', _self._arrDevice.length);
                    if (_self._arrDevice.length > 0) {
                        for (let i = 0; i < _self._arrDevice.length; i++) {
                            if (_self._arrDevice.getItem(i).UUID == mac) {
                                console.log('mac address', mac);
                                _self.ConnectDevice(i);
                                break;
                            }
                        }
                    }
                },
                    function (err) {
                        _self.set('isLoading', false);
                        dialogs.alert({
                            title: "Whoops!",
                            message: err,
                            okButtonText: "OK, got it"
                        });
                    });
            });
    }
    public ConnectDevice(index) {
        var str = JSON.stringify(this._arrDevice.getItem(index));
        var device: any = this._arrDevice.getItem(index);
        var _self = this;

        bluetooth.connect({
            UUID: device.UUID,
            // NOTE: we could just use the promise as this cb is only invoked once
            onConnected: function (peripheral) {
                _self.set("isConnected", true);
            },
            onDisconnected: function (peripheral) {
                _self.set("isConnected", false);
                dialogs.alert({
                    title: "Disconnected",
                    message: "Disconnected from peripheral: " + JSON.stringify(peripheral),
                    okButtonText: "OK, thanks"
                });
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