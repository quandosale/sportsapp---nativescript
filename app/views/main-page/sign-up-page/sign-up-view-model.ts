import * as Toast from "nativescript-toast";
// Social Login Module
import SocialLogin = require("nativescript-social-login");
import * as TimeDatePicker from 'nativescript-timedatepicker';
import HTTP = require("http");
import { Observable } from 'data/observable';
import observableModule = require("data/observable");
import { EventData } from "data/observable";
import { CONFIG, SNS_GOOGLE_serverClientId } from '../../../common/config';
import navigator = require("../../../common/navigator");
import dialogs = require("ui/dialogs");
import pages = require("ui/page");
import { AppSetting } from '../../../common/app-setting';

export class SignUpPageModule extends Observable {
    page: pages.Page;
    constructor(page) {
        super(); this.page = page;
        this.set('isAllow', true);
        this.email = "";//a0af@yandex.com
        this.password = "";//12345
        this.name = "";//john
        this.birthday = "Birthday";
        this.gender = "Gender";
        // this.height = 0;//170
        // this.weight = 0;

        //--------- demo
        // this.email = 'khs0618@yandex.com';
        // this.password = "12345";
        // this.name = "john";
        // this.birthday = "Birthday";
        // this.gender = "Gender";
        // this.height = 175;//170
        // this.weight = 160;
    }
    isValidEmail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.email);
    }
    onSignUp(args: EventData) {
        console.log('email validat', this.isValidEmail());

        if (this.get('isAllow')) {
            this.signup();
        } else {
            this._toast('Checkbox no checked');
        }
    }

    onGoogleSignUpTap(args: EventData) {
        Toast.makeText('google singup').show();
        this.set('isLoading', true);
        var _self = this;
        try {
            // Social Login Init(google)
            SocialLogin.init({
                google: { serverClientId: SNS_GOOGLE_serverClientId },
            });
            SocialLogin.loginWithGoogle(function (result) {
                console.log(JSON.stringify(result, null, 2));
                if (result.id)
                    _self._googlelogin(result);
                else {
                    _self.set('isLoading', false);
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
        let photo: string = result.photo == {} ? "res://default_man" : result.photo;
        console.log('photo', photo, photo.toString(), typeof photo, JSON.stringify(photo, null, 2));
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                snsId: result.id,
                username: result.userToken,
                firstname: result.displayName,
                secondname: result.displayName,
                photo: photo,
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
    gotoMainPage() {
        navigator.navigateToMainPage();
    }
    onFacebookSignUpTap(args: EventData) {
        this.set('isLoading', true);
        SocialLogin.init({
            facebook: {}
        });
        var _self = this;
        try {
            SocialLogin.loginWithFacebook(function (result) {
                console.log('-------------------------------------');
                console.log(JSON.stringify(result));
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

    onShowPasswordTapped(args: EventData) {
        var prev: boolean = this.get('isAllow');
        prev = !prev;
        this.set('isAllow', prev);
    }
    setGender(args: EventData) {
        var options = {
            title: "",
            message: "Gender",
            cancelButtonText: "Cancel",
            actions: ["Male", "Female"]
        };
        var _self = this;
        dialogs.action(options).then((result) => {
            _self.gender = result;
            _self.set("_gender", result);
        });
    }
    onBirthday() {
        var _self = this;
        let mCallback = ((result: String) => {
            console.log('birthday date', result);
            let _split = result.split(' ');
            if (_split.length < 3) {
                Toast.makeText('Unsupported Date format').show();
                return;
            }
            let y = parseInt(_split[2]);
            let m = parseInt(_split[1]);// January = 1
            m = m - 1;
            let d = parseInt(_split[0]);

            let date = new Date();
            date.setFullYear(y);
            date.setMonth(m);
            date.setDate(d);
            var dateStr = _self.dateFormat(date);
            _self.birthday = dateStr;
        });
        //Initialize the PickerManager (.init(yourCallback, title, initialDate))
        TimeDatePicker.init(mCallback, null, null);

        //Show the dialog
        TimeDatePicker.showDatePickerDialog();
    }
    dateFormat(date: Date): string {
        let dateTime = new Date(date);
        let yyyy = dateTime.getFullYear();
        let month = dateTime.getMonth();
        let MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let monthStr = MONTH[month];
        let mm = (month / 10 >= 1) ? month : ('0' + month);
        let day = dateTime.getDate();
        let dd = (day / 10 >= 1) ? day : ('0' + day);

        let result: string = `${yyyy}-${month + 1}-${dd}`;
        return result;
    }

    signup() {
        this.set('isLoading', true);
        let request_url = CONFIG.SERVER_URL + '/auth/signup/';
        let birthday = new Date();
        let gender = this.gender;
        if (this.gender == "Gender") gender = "Male";
        if (this.birthday != null && this.birthday != undefined) {
            birthday = new Date(this.birthday);
        }
        let _self = this;
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                username: this.email,
                password: this.password,
                sec_question: this.password,
                sec_answer: this.password,
                firstname: this.name,
                birthday: birthday,
                gender: gender,
                height: this.height,
                height_unit: 'feet',
                weight: this.weight,
                weight_unit: 'lbs'
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            console.log(JSON.stringify(res));
            _self.set('isLoading', true);
            if (res.success) {
                _self._toast(res.message);
                console.log(res.data);
                AppSetting.setUserData(res.data);
                navigator.navigateToTutorial();
            } else {
                _self._toast(res.message);
            }
        }, function (error) {
            _self.set('isLoading', true);
            console.error(JSON.stringify(error));
            _self._toast('Network error');
            // navigator.navigateToTutorial();
        });
    }

    //

    get email(): string {
        return this.get("_email");
    }

    set email(value: string) {
        this.set("_email", value);
    }

    get password(): string {
        return this.get("_password");
    }

    set password(value: string) {
        this.set("_password", value);
    }
    get name(): string {
        return this.get("_name");
    }

    set name(value: string) {
        this.set("_name", value);
    }
    get birthday(): string {
        return this.get("_birthday");
    }

    set birthday(value: string) {
        this.set("_birthday", value);
    }
    get gender(): string {
        return this.get("_gender");
    }

    set gender(value: string) {
        this.set("_gender", value);
    }
    get height(): number {
        return this.get("_height");
    }

    set height(value: number) {
        this.set("_height", value);
    }
    get weight(): number {
        return this.get("_weight");
    }

    set weight(value: number) {
        this.set("_weight", value);
    }

    _toast(_msg) {
        Toast.makeText(_msg).show();
    }
}