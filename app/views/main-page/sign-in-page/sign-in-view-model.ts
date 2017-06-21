import * as platform from 'platform';
import * as Toast from "nativescript-toast";
import HTTP = require("http");
import { Observable } from 'data/observable';
import { EventData } from "data/observable";
// Social Login Module
import SocialLogin = require("nativescript-social-login");
import { Page } from "ui/page";
import { CONFIG, SNS_GOOGLE_serverClientId } from '../../../common/config';
import navigator = require("../../../common/navigator");
import phoneMac = require("../../../common/phone");
import { AppSetting } from '../../../common/app-setting';
import { User } from './user';
// import { DataService } from '../../../service/data-service';
export class SignInPageModule extends Observable {
    public user: User = new User("chen1222@yandex.com", "11111");
    // public user: User = new User("", "");
    page: Page;
    constructor(_page: Page) {
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
                google: { serverClientId: SNS_GOOGLE_serverClientId },
            });
            SocialLogin.loginWithGoogle(function (result) {
                _self.set('isLoading', false);
                // console.log(JSON.stringify(result, null, 2));
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
        let photo: string = result.photo == {} ? "res://default_man" : result.photo.toString();
        console.log('photo', photo, photo.length);
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                snsId: result.id,
                username: result.userToken,
                firstname: result.displayName,
                secondname: result.displayName,
                photo: photo
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            _self.set('isLoading', false);
            if (res.success) {
                AppSetting.setUserData(res.data.user);
                _self.gotoMainPage();
            }
            else {
                _self._toast(res.message);
            }
        }, function (error) {
            _self.set('isLoading', false);
            console.error(JSON.stringify(error), error);
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
                AppSetting.setUserData(res.data.user);
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
    isValidEmail(email: string) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    // isStart = true;
    // onEmailTextChange() {
    //     console.log('email textChange');
    //     console.log('email veri', this.isValidEmail(this.user.email));
    //     if (this.isStart) {
    //         setTimeout(() => this.isStart = false, 1000);
    //         return;
    //     }
    //     if (!this.isValidEmail(this.user.email)) {
    //         this.e_error = true;
    //     } else {
    //         this.e_error = false;
    //     }
    // }
    // onPwdTextChange() {
    //     // this.p_error = false;
    //     console.log('pwd textChange');
    //     if (this.isStart) {
    //         setTimeout(() => this.isStart = false, 1000);
    //         return;
    //     }
    //     if (this.user.password.length == 0) {
    //         this.p_error = true;
    //     } else {
    //         this.p_error = false;
    //     }
    // }
    onLoginTap() {
        let isOk = true;
        console.log('email veri', this.isValidEmail(this.user.email));
        if (!this.isValidEmail(this.user.email)) {
            isOk = false;
            this.e_error = true;
        } else {
            this.e_error = false;
        }
        if (this.user.password.length == 0) {
            isOk = false;
            this.p_error = true;
        } else {
            this.p_error = false;
        }
        if (!isOk) return;
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
                AppSetting.setUserData(res.data.user);
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

    onForgotPassword() {
        let isOk = true;
        if (!this.isValidEmail(this.user.email)) {
            isOk = false;
            this.e_error = true;
        } else {
            this.e_error = false;
        }
        if (!isOk) return;
        this.set('isLoading', true);
        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/auth/forgot-password';
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                username: this.user.email
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            _self.set('isLoading', false);
            if (res.success) {
                _self._toast(res.message);
            }
            else {
                _self._toast('There was an error sending email');
            }
        }, function (error) {
            _self.set('isLoading', false);
            console.error('login error:', JSON.stringify(error), error);
            _self._toast('Network error');
        });
    }

    gotoMainPage() {
        // DataService.getDatasFromServer();
        navigator.navigateToMainPage();
    }
    // error flag
    get e_error(): boolean {
        return this.get("_e_error");
    }

    set e_error(value: boolean) {
        this.set("_e_error", value);
    }

    get p_error(): boolean {
        return this.get("_p_error");
    }

    set p_error(value: boolean) {
        this.set("_p_error", value);
    }

    _toast(_msg) {
        Toast.makeText(_msg).show();
    }
}
