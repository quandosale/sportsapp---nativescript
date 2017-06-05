var tnsfx = require('nativescript-effects');
import { TNSPlayer } from 'nativescript-audio';
import dialogs = require("ui/dialogs");
import bluetooth = require("nativescript-bluetooth");
import observableArray = require("data/observable-array");
import * as platform from 'platform';
import * as Toast from "nativescript-toast";
import HTTP = require("http");
import { Observable } from 'data/observable';
import pages = require("ui/page");
import * as LocalNotifications from "nativescript-local-notifications";
import * as vibrator from "nativescript-vibrate";
import * as ButtonModel from 'ui/button';
import * as  orientationModule from "nativescript-screen-orientation";
import { SendSleep } from '../../send-sleep'
import { SendEcg } from '../../send-ecg';
import { CONFIG, BLEConfig } from '../../../../common/config';
import navigator = require("../../../../common/navigator");
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

        // this.togglePlay();
        console.log();
        LocalNotifications.getScheduledIds().then(
            function (ids) {
                console.log("ID's: " + ids);
            });
        LocalNotifications.cancel(1).then(
            function (foundAndCanceled) {
                if (foundAndCanceled) {
                    Toast.makeText("Notifciation Canceled").show();
                } else {
                    Toast.makeText("Notifciation cannot Canceled").show();
                }
            });
        setTimeout(() => this.sendsleep.start(), 3 * 60 * 1000);

    }
    onSnoozeTap() {
        let after5Minutes: Date = new Date();
        this.time = after5Minutes;
        after5Minutes.setMinutes(after5Minutes.getMinutes() + 10);
        // this.checkNotification(after5Minutes);

        global.wakeuptime = after5Minutes;
        navigator.navigateToWakeUp();

    }
    getDevice() {
        let userId = "5901f65483755e3701856c4e";
        // if (global.user) {
        let gatewayMac = this.getMacAddress();
        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/devices/get-by-doctor-gateway/' + userId + "/" + gatewayMac;
        HTTP.request({
            method: "GET",
            url: request_url,
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            console.log(JSON.stringify(res));
            _self.set('isLoading', false);
            if (res.success) {
                console.log('success ');
                Toast.makeText("" + res.message).show();
                if (res.data.length == 0) return;
                let mac = res.data[0].mac;
                _self.set("_mac", mac);
                _self.doStartScanning(mac);
            }
            else {
                console.log('fail ');
                Toast.makeText("" + res.message).show();
                _self.set("tip", "" + res.message);
            }

        }, function (error) {
            console.error(JSON.stringify(error));
            _self.set('isLoading', false);
            _self.set("tip", "Network error");
        });
        // }
    }
    public getMacAddress(): string {
        return platform.device.uuid;
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
                            // _self.ConnectDevice(i);
                            // break;
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

    checkNotification(_time) {
        var _self = this;
        LocalNotifications.hasPermission().then(
            function (granted) {
                console.log("Permission granted? " + granted);
                if (!granted) {
                    LocalNotifications.requestPermission().then(
                        function (granted) {
                            console.log("request Permission granted? " + granted);
                            if (granted) {
                                _self.setNotification(_time);
                            } else {
                                Toast.makeText('permission denied').show();
                            }
                        });
                } else {
                    _self.setNotification(_time);
                }
            });
    }

    setNotification(_time: Date) {
        let _self = this;
        //var let ="android.resource://" + getPackageName() + "/" + R.raw.notifysnd
        var soundPath = "file:///sdcard/noti.wav";
        soundPath = "android.resource://org.nativescript.examples/raw/noti";
        LocalNotifications.schedule([{
            id: 1,
            title: 'Wake Up Time',
            body: 'created' + this.time,
            ticker: 'The ticker',
            badge: 1,
            groupedMessages: ["Wake up time"], //android only
            groupSummary: "Wake up " + _time.toString(), //android only
            ongoing: true, // makes the notification ongoing (Android only)
            smallIcon: 'res://ic_menu_main',
            interval: 'second',
            sound: soundPath,
            at: new Date(_time)
        }]).then(
            function () {
                Toast.makeText('Notification scheduled').show();
                console.log("Notification scheduled");
                _self.setRemainTime();
                LocalNotifications.addOnMessageReceivedCallback(
                    function (notification) {
                        Toast.makeText("Title: " + notification.title).show();
                        console.log("ID: " + notification.id);
                        console.log("Title: " + notification.title);
                        console.log("Body: " + notification.body);
                    }
                ).then(
                    function () {
                        console.log("Listener added");
                    });
            },
            function (error) {
                console.log("scheduling error: " + error);
            });
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
export class DataItem extends Observable {
    constructor(uuid: string, name: string, isSelect: boolean) {
        super();
        this.UUID = uuid;
        this.name = name;
        this.isSelect = isSelect;
    }

    get UUID(): string {
        return this.get("_UUID");
    }

    set UUID(value: string) {
        this.set("_UUID", value);
    }

    get name(): string {
        return this.get("_name");
    }

    set name(value: string) {
        this.set("_name", value);
    }

    get isSelect(): boolean {
        return this.get("_isSelect");
    }

    set isSelect(value: boolean) {
        this.set("_isSelect", value);
    }
}
