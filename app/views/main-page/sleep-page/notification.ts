import * as LocalNotifications from "nativescript-local-notifications";
import * as Toast from "nativescript-toast";
import { AppSetting } from '../../../common/app-setting';

export function setNotification(_time: Date) {
    checkNotificationEnable(_time);
}
export function clear() {
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
}
export function clearAll() {
    LocalNotifications.cancelAll();
    Toast.makeText("All of Notifciation Canceled").show();
}
function checkNotificationEnable(_time: Date) {
    LocalNotifications.hasPermission().then(
        function (granted) {
            console.log("Permission granted? " + granted);
            if (!granted) {
                LocalNotifications.requestPermission().then(
                    function (granted) {
                        console.log("request Permission granted? " + granted);
                        if (granted) {
                            setTimeout(() => checkNotificationEnable(_time), 1000);
                        } else {
                            Toast.makeText('permission denied').show();
                        }
                    });
            } else {
                setTimeout(() => _setNotification(_time), 10);
            }
        });
}

function _setNotification(_time: Date) {

    //var let ="android.resource://" + getPackageName() + "/" + R.raw.notifysnd
    var soundPath = "file:///sdcard/noti.wav";
    soundPath = "android.resource://calm.sportsapp.com/raw/noti";
    let savedAlarmSound = AppSetting.getSound();

    if (savedAlarmSound && savedAlarmSound.length > 0) {
        soundPath = savedAlarmSound;
    }
    console.log('alarm sound -----------------', savedAlarmSound, soundPath);
    Toast.makeText(soundPath).show();

    LocalNotifications.schedule([{
        id: 1,
        title: 'Wake Up Time',
        body: 'created' + _time,
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
