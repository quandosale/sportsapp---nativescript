import * as platform from 'platform';
import * as Toast from "nativescript-toast";
import HTTP = require("http");
import { Observable } from 'data/observable';
import { EventData } from "data/observable";
// Social Login Module
import SocialLogin = require("nativescript-social-login");
import * as fs from "file-system";
import { File, Folder, path } from "file-system";
import pages = require("ui/page");
import { CONFIG } from '../../../common/config';
import navigator = require("../../../common/navigator");
import phoneMac = require("../../../common/phone");
import { AppSetting } from '../../../common/app-setting';
import { User } from './user';
export class SignInPageModule extends Observable {
    public user: User = new User("khs0618@yandex.com", "12345");
    // public user: User = new User("", "");
    page: pages.Page;
    constructor(_page: pages.Page) {
        super();
        this.page = _page;
        SocialLogin.addLogger(function (msg, tag) {            // console.log('[nativescript-social-login]: (' + tag + '): ' + msg);
        });
    }

    onGoogleLoginTap(args: EventData) {
        this.set('isLoading', true);
        var _self = this;
        try {
            // Social Login Init(google)
            SocialLogin.init({
                google: { serverClientId: "369911498027-hm2orsu1neb2npr58icv3p965edcag2q.apps.googleusercontent.com" },
            });
            SocialLogin.loginWithGoogle(function (result) {
                _self.set('isLoading', false);
                if (result.id)
                    _self._googlelogin(result);
                else {

                }
            });
        } catch (e) {
            console.log("error: " + e);
            this.set('isLoading', false);
        }
    }

    _googlelogin(result) {
        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/auth/sns-signin/';
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                snsId: result.id,
                username: result.userToken,
                firstname: result.displayName,
                secondname: result.displayName,
                photo: "/assets/gravatar/default.jpg",
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            _self.set('isLoading', false);
            if (res.success) {
                global.userId = res.data.user._id;
                global.user = res.data.user;
                if (res.data.user.alarmSound) {
                    global.alarmSound = res.data.user.alarmSound;
                }
                _self.gotoMainPage();
            }
            else {
                _self._toast(res.message);
            }
        }, function (error) {
            _self.set('isLoading', false);
            console.error(JSON.stringify(error));
            _self._toast('Network error');
        });
    }
    onFacebookLoginTap(args: EventData) {
        this.set('isLoading', true);
        SocialLogin.init({
            facebook: {}
        });
        var _self = this;
        try {
            SocialLogin.loginWithFacebook(function (result) {
                console.log('-------------------------------------');
                console.log(JSON.stringify(result, null, 2));
                if (result.id)
                    _self._facebooklogin(result);
                else {
                    _self.set('isLoading', false);
                }
            });
        } catch (e) {
            this.set('isLoading', false);
            console.log("ERROR: " + e);
        }
    }

    _facebooklogin(result) {
        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/auth/sns-signin/';
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                snsId: result.id,
                username: result.userToken,
                firstname: result.displayName,
                secondname: result.displayName,
                photo: result.photo,
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            _self.set('isLoading', false);

            if (res.success) {
                global.userId = res.data.user._id;
                global.user = res.data.user;
                _self.gotoMainPage();
            }
            else {
                _self._toast(res.message);
            }
        }, function (error) {
            _self.set('isLoading', false);
            console.error(JSON.stringify(error));
            _self._toast('Network error');
        });
    }

    onLoginTap() {
        this.set('isLoading', true);
        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/auth/login';
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                username: this.user.email,
                password: this.user.password
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            _self.set('isLoading', false);
            console.log(JSON.stringify(res));
            if (res.success) {
                global.userId = res.data._id;
                global.user = res.data;
                AppSetting.setUserData(res.data);
                _self.gotoMainPage();
            }
            else {
                _self._toast('Your email or password is invalid.');
            }
        }, function (error) {
            _self.set('isLoading', false);
            console.error('login error:', JSON.stringify(error), error);
            _self._toast('Network error');
        });
    }// login
    openGateWayNameDialog(userId) {
        var modalPageModule = "views/main-page/sign-in-page/gateway-name-dialog/name-dialog";
        var context = "some custom context";
        let _self = this;
        this.page.showModal(modalPageModule, context, function (_gatewayName: string) {
            if (!_gatewayName) return;
            _self.register(userId, _gatewayName);
        }, false);
    }
    register(userId, _gatewayName) {
        var _self = this;
        let request_url = CONFIG.SERVER_URL + "/gateways/register/";
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                name: _gatewayName,
                type: "android " + _gatewayName + ", " + phoneMac.getMacAddress(),
                mac: phoneMac.getMacAddress(),
                upload_freq: 10,
                polling_freq: 10,
                login_everytime: true,
                owner: userId
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            _self.set('isLoading', false);
            if (res.success) {
                _self.gotoMainPage();
            }
            else {
                _self._toast('Cannot register Your Gateway');
            }
        }, function (error) {
            _self.set('isLoading', false);
            console.error('login error:', JSON.stringify(error), error);
            _self._toast('Network error');
        });
        //*/
    }

    gotoMainPage() {
        // save current state to the file(id , pawword)
        this.writeCookie();
        navigator.navigateToMainPage();
        // this.getDeviceFromServer();
    }
    writeCookie() {
        if (!global.userId) {
            Toast.makeText('User Data not set').show();
            return;
        }
        let user = {
            username: this.user.email,
            password: this.user.password,
            userId: global.userId
        };


        let strUserinfo = JSON.stringify(user);
        var documents = fs.knownFolders.documents();
        var file = documents.getFile(CONFIG.COOKIE_FILE);

        // Writing text to the file.
        file.writeText(strUserinfo)
            .then(function () {
                // Succeeded writing to the file.
                console.log('Success for save cookie');
            }, function (error) {
                // Failed to write to the file.
                console.log('Fail for save cookie');
            });
    }
    readCookie() {
        var documents = fs.knownFolders.documents();
        var file = documents.getFile(CONFIG.COOKIE_FILE);
        file.readText()
            .then(function (result) {
                // Succeeded writing to the file.
                let res = JSON.parse(result);
                console.log('Success for READ cookie ' + JSON.stringify(res, null, 2));
            }, function (error) {
                // Failed to write to the file.
                console.log('Fail for READ cookie');
            });
    }
    _toast(_msg) {
        Toast.makeText(_msg).show();
    }
}
