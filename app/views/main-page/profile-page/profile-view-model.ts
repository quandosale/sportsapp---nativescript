import * as Toast from "nativescript-toast";
import * as TimeDatePicker from 'nativescript-timedatepicker';
import { Observable } from 'data/observable';
import { Page } from 'ui/page';
import dialogs = require("ui/dialogs");
import HTTP = require("http");

import { Image } from "ui/image";
import * as imageSource from "image-source";
import * as camera from "nativescript-camera";
var imagepickerModule = require("nativescript-imagepicker");
import imageAsset = require("image-asset");
import { CONFIG } from '../../../common/config';
// global variable
var imageBase64: string = "";
export class ProfileModel extends Observable {
    dateTest = new Date();
    imgUserPhoto: Image;
    page: Page;
    heightMeter = 0;
    weightKg = 0;

    constructor(mainPage: Page) {
        super();
        // orientationModule.setCurrentOrientation("portrait", function () {
        //     console.log("landscape orientation set");
        // });
        this.page = mainPage;
        this.name = "john";
        this.birthday = this.dateFormat(this.dateTest);
        this.gender = "Male";
        this.height = '0 ft';
        this.height2 = '0 in';
        this.height_unit = "feet";
        this.weight = 0;
        this.weight_unit = "lbs";

        this.imgUserPhoto = mainPage.getViewById<Image>("userPhoto");
        this.getUserInfo();
    }
    onTakePhotoTap() {

        var options = {
            title: "",
            message: "Select Mode",
            cancelButtonText: "Cancel",
            actions: ["From Gallery", "Take photo"]
        };
        var _self = this;
        dialogs.action(options).then((result) => {
            if (result == "From Gallery") {
                _self.photoFromGallery();
            } if (result == "Take photo") {
                _self.onTakePhoto();
            }
        });
    }
    photoFromGallery() {
        var context = imagepickerModule.create({
            mode: "single"
        });
        this.startSelection(context);
    }
    startSelection(_contex: any) {
        _contex
            .authorize()
            .then(function () {
                var result = [];
                return _contex.present();
            })
            .then(function (selection) {
                selection.forEach(function (selected) {
                    console.log("uri: " + selected.uri);
                    console.log("fileUri: " + selected.fileUri);
                });
                let result = selection;
            }).catch(function (e) {
                console.log(e);
            });

    }
    onTakePhoto() {
        console.log('camera on');
        var _self = this;
        camera.requestPermissions();
        camera.takePicture({ width: 100, height: 100, keepAspectRatio: true }).
            then((imageAsset: imageAsset.ImageAsset) => {
                console.log("Result is an image asset instance");
                this.imgUserPhoto.src = imageAsset;
                this.imgUserPhoto.height = 100;
                var __self = _self;
                imageSource.fromAsset(imageAsset)
                    .then(e => {
                        var t: imageSource.ImageSource = e;
                        console.log('w', t.width);
                        console.log('h', t.height);
                        imageBase64 = t.toBase64String("PNG");
                    });

            }).catch((err) => {
                console.log("Error -> " + err.message);
            });
    }

    getUserInfo() {
        if (!global.userId) return;
        this.set('isLoading', true);
        var _self = this;

        let request_url = CONFIG.SERVER_URL + '/accounts/get/' + global.userId;
        HTTP.request({
            method: "GET",
            url: request_url,
            timeout: 3000,
            headers: { "Content-Type": "application/json" },
        }).then(function (result) {
            _self.set('isLoading', false);
            var res = result.content.toJSON();
            if (res.success) {
                // console.log(JSON.stringify(res, null, 2));
                _self.initUserData(res.data);
            }
            else {
                Toast.makeText(res.message).show();
            }
        }, function (error) {
            _self.set('isLoading', false);
            Toast.makeText('Network error').show();
        });
    }
    setHeight() {
        if (this.height_unit == 'feet') {
            let feet = this.meterTofeet(this.heightMeter);
            this.height = feet.feet + ' ft';
            this.height2 = feet.inch + ' in';
        } else {
            this.height = this.heightMeter + ' cm'
            this.height2 = "";
        }
    }
    setWeight() {






        if (this.weight_unit.toLocaleLowerCase() == 'lbs') {
            let lbs = this.kgToLbs(this.weightKg);
            this.weight = lbs;
        } else {
            this.weight = this.weightKg;

        }
    }

    meterTofeet(v) {
        let foot = 3.2808399 * v / 100;
        let _f = Math.floor(foot);
        let _distance = foot - _f;
        let inch = _distance * 12;
        inch = Math.round(inch);
        return { feet: _f, inch: inch };
    }
    kgToLbs(v) {
        let res = v * 2.20462262185;
        return Math.round(res);

    }

    initUserData(data) {
        console.log('---------- photo --------------')
        console.log(data.photo);

        this.name = data.firstname;
        this.birthday = this.dateFormat(data.birthday);
        this.gender = data.gender;
        this.height_unit = data.height_unit ? data.height_unit : 'feet';
        this.heightMeter = data.height;
        this.setHeight();

        this.weight_unit = data.weight_unit ? data.weight_unit : 'lbs';
        this.weightKg = data.weight;
        this.setWeight();
        var pSrc: string = data.photo;
        this.photoSrc = pSrc;

        imageSource.fromUrl(pSrc)
            .then(e => {
                var t: imageSource.ImageSource = e;
                console.log('w', t.width);
                console.log('h', t.height);
                this.imgUserPhoto.src = t;
            });
    }
    saveChange() {
        if (!global.userId) {
            return;
        }
        this.set('isLoading', true);
        if (imageBase64.length == 0) {
            imageBase64 = this.photoSrc;
        }
        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/accounts/update/' + global.userId;
        HTTP.request({
            method: "PUT",
            url: request_url,
            content: JSON.stringify({
                photo: imageBase64,
                firstname: this.name,
                birthday: this.birthday,
                gender: this.gender,
                height: this.heightMeter,
                height_unit: this.height_unit,
                weight: this.weightKg,
                weight_unit: this.weight_unit
            }),
            timeout: CONFIG.timeout,
            headers: { "Content-Type": "application/json" },
        }).then(function (result) {
            _self.set('isLoading', false);
            var res = result.content.toJSON();
            if (res.success) {
                _self.getUserInfo();
            }
            else {
                Toast.makeText(res.message).show();
            }
        }, function (error) {
            _self.set('isLoading', false);
            Toast.makeText('Network error').show();
        });
    }
    onBirthdayTap0() {
        var modalPageModule = "views/main-page/sign-up-page/birthday/birthday";
        var context = "some custom context";
        var fullscreen = false;
        var _self = this;
        this.page.showModal(modalPageModule, context, function (date: Date) {
            if (date == undefined) date = new Date();
            var dateStr = _self.dateFormat(date);
            _self.birthday = dateStr;
        }, fullscreen);
    }
    onBirthdayTap() {
        var _self = this;
        let mCallback = ((result) => {
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
    onGenderTap() {
        var options = {
            title: "",
            message: "Gender",
            cancelButtonText: "Cancel",
            actions: ["Male", "Female"]
        };
        var _self = this;
        dialogs.action(options).then((result) => {
            if (result == "Male" || result == "Female")
                _self.gender = result;
        });
    }
    onWeightTypeTap() {
        var options = {
            title: "",
            message: "Weight Unit",
            cancelButtonText: "Cancel",
            actions: ["Lbs", "Kg"]
        };
        var _self = this;
        dialogs.action(options).then((result) => {
            if (result.toLocaleLowerCase() != "cancel")
                _self.weight_unit = result;
            _self.setWeight();
        });
    }
    onHeightTypeTap() {
        var options = {
            title: "",
            message: "Height Unit",
            cancelButtonText: "Cancel",
            actions: ["feet", "meter"]
        };
        var _self = this;
        dialogs.action(options).then((result) => {
            if (result.toLocaleLowerCase() != "cancel")
                _self.height_unit = result;
            if (result == "feet") {
                this.setHeight();
            } else {
                this.setHeight();
            }
        });
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

        let result: string = `${dd} ${monthStr} ${yyyy}`;
        return result;
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
    get height(): string {
        return this.get("_height");
    }

    set height(value: string) {
        this.set("_height", value);
    }
    get height2(): string {
        return this.get("_height2");
    }

    set height2(value: string) {
        this.set("_height2", value);
    }
    get height_unit(): string {
        return this.get("_height_unit");
    }

    set height_unit(value: string) {
        this.set("_height_unit", value);
    }

    get weight(): number {
        return this.get("_weight");
    }

    set weight(value: number) {
        this.set("_weight", value);
    }
    get weight_unit(): string {
        return this.get("_weight_unit");
    }

    set weight_unit(value: string) {
        this.set("_weight_unit", value);
    }
    set photoSrc(v: string) {
        this.set("__photoSrc", v);
    }
    get photoSrc(): string {
        return this.get("__photoSrc");
    }
}