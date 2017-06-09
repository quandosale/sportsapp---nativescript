import bluetooth = require("nativescript-bluetooth");
import * as Toast from "nativescript-toast";
import dialogs = require("ui/dialogs");
import HTTP = require("http");
import { Observable } from 'data/observable';
import { EventData } from "data/observable";
import pages = require("ui/page");
import * as  orientationModule from "nativescript-screen-orientation";
import { CONFIG } from '../../../common/config';
import phoneMac = require("../../../common/phone");
import { AppSetting } from '../../../common/app-setting';
import { Sportsotadfu } from 'nativescript-sportsotadfu';

export class SettingPageModule extends Observable {
    page: pages.Page;

    constructor(page) {
        super();

        orientationModule.setCurrentOrientation("portrait", function () {
            console.log("landscape orientation set");
        });
        this.unit = "metric";
        this.page = page;
        this.set("backgroundTransfer", true);
    }

    onFirmwareUpdate() {
        console.log('Firmware Up');
        let device = AppSetting.getDevice();
        if (device == null) {
            Toast.makeText("Device is not registered").show();
            return;
        }

        let dfuModule = new Sportsotadfu();
        bluetooth.disconnect({
            UUID: device.UUID
        }).then(function () {
            console.log("disconnected successfully");
            dfuModule.start(device.UUID);
        }).then(function (err) {
            // in this case you're probably best off treating this as a disconnected peripheral though
            console.log("disconnection error: " + err);
            dfuModule.start(device.UUID);
        }).catch(e => {
            console.log("catch");
            dfuModule.start(device.UUID);
        });
    }

    onUnitSettingTap() {
        var options = {
            title: "",
            message: "Unit Setting",
            cancelButtonText: "Cancel",
            actions: ["metric", "imperial"]
        };
        var _self = this;
        dialogs.action(options).then((result) => {
            _self.unit = result;

        });
    }

    ChangePasswordDialog() {

        var modalPageModule = "views/main-page/setting-page/change-password-dialog/pwd-dialog";
        var context = "some custom context";
        var fullscreen = false;
        var that = this;
        this.page.showModal(modalPageModule, context, function (msg: string) {
            console.log(msg);
        }, fullscreen);
    }

    CloseAccountDialog(args: EventData) {
        let options = {
            title: "Close Account",
            message: "Are you sure?",
            okButtonText: "Yes",
            cancelButtonText: "No",
            // neutralButtonText: "Cancel"
        };
        var _self = this;
        dialogs.confirm(options).then((result: boolean) => {
            if (result) {
                _self.closeAccount();
            }
        });
    }
    closeAccount() {
        let user = AppSetting.getUserData();
        if (user == null) {
            Toast.makeText("User Data No set.").show();
            return;
        } else {
            console.log('User Id', user._id);
        }
        this.set('isLoading', true);
        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/accounts/close/' + user._id;
        HTTP.request({
            method: "DELETE",
            url: request_url,
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            _self.set('isLoading', false);
            if (res.success) {
                alert('Success');
            }
            else {
                alert('Your email or password is invalid.');
            }

        }, function (error) {
            _self.set('isLoading', false);
            console.error(JSON.stringify(error));
            alert('Network error');
        });
    }

    get unit(): string {
        return this.get("_unit");
    }

    set unit(value: string) {
        this.set("_unit", value);
    }
    get backgroundTransfer(): boolean {
        return this.get("_backgroundTransfer");
    }

    set backgroundTransfer(value: boolean) {
        this.set("_backgroundTransfer", value);
    }
}
