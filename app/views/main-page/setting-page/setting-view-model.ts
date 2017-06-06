import * as Toast from "nativescript-toast";
import * as platform from 'platform';
import dialogs = require("ui/dialogs");
import HTTP = require("http");
import { Observable } from 'data/observable';
import { EventData } from "data/observable";
import pages = require("ui/page");
import * as  orientationModule from "nativescript-screen-orientation";
import { CONFIG } from '../../../common/config';
import navigator = require("../../../common/navigator");
import phoneMac = require("../../../common/phone");
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
        this.loginEveryTime = global.login_everytime
    }

    onFirmwareUpdate() {
        // first get mac address from server
        let userId = global.userId;
        // if (global.user) {
        let gatewayMac = phoneMac.getMacAddress();
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
                Toast.makeText("" + res.message + ":" + res.data.length).show();
                let length = res.data.length;
                let mac = [];
                for (let i = 0; i < length; i++) {
                    mac.push(res.data[i].mac);
                }
                console.log('sign in page ------   success  from server     -------------- mac address', mac.length, mac);
                // use device of First
                if (mac.length > 0) {
                    _self.getDeviceFromServer(mac[0]);
                }
                else {
                    Toast.makeText("No registered Devices").show();
                    _self.set("tip", "No registered Devices");
                }
            }
            else {
                console.log('fail ');
                // Toast.makeText("" + res.message).show();
                _self.set("tip", "" + res.message);
            }

        }, function (error) {
            console.error(JSON.stringify(error));
            _self.set('isLoading', false);
            _self.set("tip", "Network error");
        });
    }

    getDeviceFromServer(strMac) {
        console.log('Firmware Update');
        let dfu = new Sportsotadfu();

        Toast.makeText("mac address: " + strMac).show();
        dfu.start(strMac);
    }

    onLoginEveryTimeTap() {
        this.loginEveryTime = !this.loginEveryTime;
        let _self = this;
        let request_url = CONFIG.SERVER_URL + "/gateways/update/" + phoneMac.getMacAddress() + "/" + global.userId;
        console.log(request_url);
        HTTP.request({
            method: "PUT",
            content: JSON.stringify({
                upload_freq: 20,
                polling_freq: 10,
                login_everytime: _self.loginEveryTime
            }),
            url: request_url,
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            _self.set('isLoading', false);
            console.log(JSON.stringify(res, null, 2));
            if (res.success) {
                global.login_everytime = res.gateway.login_everytime;
                Toast.makeText("success changed");
            }
            else {
                Toast.makeText(res.message).show();
            }
        }, function (error) {
            _self.set('isLoading', false);
            console.error('Nework error');
            Toast.makeText('Network error').show();
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
    onLoginTap(args: EventData) {
        this.set('isLoading', true);
    }

    onFacebookLoginTap(args: EventData) {
        alert('This phone is invalid');
    }

    onGoogleLoginTap(args: EventData) {
        alert('This phone is invalid');
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
        if (!global.userId) {
            alert('user not');
            return;
        }
        this.set('isLoading', true);
        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/accounts/close/' + global.userId;
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
    login() {
        this.set('isLoading', true);
        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/auth/login/';
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                username: "",
                password: ""
            }),
            headers: { "Content-Type": "application/json" },
            timeout: 3000
        }).then(function (result) {
            var res = result.content.toJSON();

            _self.set('isLoading', false);
            if (res.success) {
                navigator.navigateToDataPage();
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
    get loginEveryTime(): boolean {
        return this.get("_loginEveryTime");
    }

    set loginEveryTime(value: boolean) {
        this.set("_loginEveryTime", value);
    }

}
