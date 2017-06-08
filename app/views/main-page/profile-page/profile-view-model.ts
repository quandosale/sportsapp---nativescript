import * as Toast from "nativescript-toast";
import * as TimeDatePicker from 'nativescript-timedatepicker';
import { Observable } from 'data/observable';
import { Page } from 'ui/page';
import dialogs = require("ui/dialogs");
import HTTP = require("http");
import { Image } from "ui/image";
import * as imageSource from "image-source";
import * as camera from "nativescript-camera";
import * as imagepickerModule from "nativescript-imagepicker";
import imageAsset = require("image-asset");
import { CONFIG } from '../../../common/config';
import { AppSetting } from '../../../common/app-setting';
var icModule = require("nativescript-imagecropper");

// global variable
var imageBase64: string = "";
var takePhoto: number = 0;
var imageUrl: string = "";
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
        // })

        this.page = mainPage;
        this.name = "john";
        this.birthday = this.dateFormat(this.dateTest);
        this.gender = "Male";
        this.height = 0;
        this.height2 = 0;
        this.height_unit = "feet";
        this.weight = 0;
        this.weight_unit = "lbs";

        this.imgUserPhoto = mainPage.getViewById<Image>("userPhoto");
        this.getUserInfo();
        console.log('takephoto', takePhoto);
        if (takePhoto == 1) {
            this.imgUserPhoto.src = imageBase64;
            takePhoto = 0;
        }
        if (takePhoto == 2) {
            this.imgUserPhoto.src = imageUrl;
            takePhoto = 0;
        }
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
        let _self = this;
        _contex
            .authorize()
            .then(function () {
                var result = [];
                return _contex.present();
            })
            .then(function (selection) {
                takePhoto = 1;
                selection.forEach(function (selected) {
                    console.log("uri: " + selected.uri);
                    console.log("fileUri: " + selected.fileUri);
                    imageUrl = selected.fileUri;
                    var img = imageSource.fromFile(imageUrl);

                    var cropper = new icModule.ImageCropper();
                    cropper.show(img, { width: 100, height: 100 }).then(function (res) {
                        takePhoto = 1;
                        var m: imageSource.ImageSource = res.image;
                        imageBase64 = 'data:image/png;base64,' + m.toBase64String("jpg");
                    })
                        .catch(function (e) {
                            console.log('crop err', e);
                        });
                });

                let result = selection;

            }).catch(function (e) {
                console.log(e);
            });
    }
    onTakePhoto() {
        takePhoto = 1;
        console.log('camera on');
        var _self = this;
        camera.requestPermissions();
        camera.takePicture({ width: 100, height: 100, keepAspectRatio: false }).
            then((imageAsset: imageAsset.ImageAsset) => {
                console.log("Result is an image asset instance");
                var __self = this;
                imageSource.fromAsset(imageAsset)
                    .then(e => {
                        var t: imageSource.ImageSource = e;
                        console.log('w', t.width);
                        console.log('h', t.height);
                        imageBase64 = 'data:image/png;base64,' + t.toBase64String("jpg");
                        this.imgUserPhoto.src = imageBase64;
                        var cropper = new icModule.ImageCropper();
                        cropper.show(t, { width: 100, height: 100 }).then(function (res) {
                            takePhoto = 1;
                            var m: imageSource.ImageSource = res.image;
                            imageBase64 = 'data:image/png;base64,' + m.toBase64String("jpg");
                            _self.imgUserPhoto.src = imageBase64;
                        })
                            .catch(function (e) {
                                console.log('crop err', e);
                            });
                    });
            }).catch((err) => {
                console.log("Error -> " + err.message);
            });
    }

    getUserInfo() {
        console.log('getUserInfo');
        let user = AppSetting.getUserData();
        if (user != null)
            this.initUserData(user);
        else {

        }
    }
    setHeight() {
        if (this.height_unit == 'feet') {
            let feet = this.meterTofeet(this.heightMeter);
            this.height = Math.round(feet.feet);// unit ft
            this.height2 = Math.round(feet.inch);// unit in
            this.height_unit1 = 'ft';
            this.height_unit2 = 'in';
        } else {
            this.heightMeter = this.meterTofeet(this.height, this.height2);
            this.height = Math.round(this.heightMeter);
            this.height2 = 0;
            this.height_unit1 = 'm';
            this.height_unit2 = '';
        }
    }
    setWeight() {
        if (this.weight_unit.toLocaleLowerCase() == 'lbs') {
            let lbs = this.kgToLbs(this.weightKg);
            this.weight = Math.round(lbs);
        } else {
            this.weight = Math.round(this.weightKg);

        }
    }

    meterTofeet(val1: number, val2: number = undefined): any {
        if (val2 == undefined) {
            let foot = val1 * 3.2808399;
            let _f = Math.floor(foot);
            let _distance = foot - _f;
            let inch = _distance * 12;
            inch = Math.round(inch);
            return { feet: _f, inch: inch };
        } else {
            let meter = val1 * 0.3048 + val2 * 0.3048 / 12;
            return meter;
        }
    }
    kgToLbs(v, isKg: Boolean = true) {
        let res;
        if (isKg)
            res = v * 2.20462262185;
        else
            res = v * 0.45359237;
        return res;

    }

    initUserData(data) {
        console.log('---------- photo --------------')

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
        if (data.photo != "")
            this.imgUserPhoto.src = data.photo;
        else
            this.imgUserPhoto.src = "res://default_man";
    }
    saveChange() {
        let user = AppSetting.getUserData();
        this.set('isLoading', true);
        if (imageBase64.length == 0) {
            imageBase64 = this.photoSrc;
        }
        if (this.height_unit == "feet") {
            this.heightMeter = this.meterTofeet(this.height, this.height2);
        } else {
            this.heightMeter = this.height;
        }

        if (this.weight_unit.toLocaleLowerCase() == "lbs") {
            this.weightKg = this.kgToLbs(this.weight, false);
        } else {
            this.weightKg = this.weight;
        }
        console.log(this.weightKg);
        user.photo = imageBase64;
        user.firstname = this.name;
        user.birthday = this.birthday;
        user.gender = this.gender;
        user.height = this.heightMeter;
        user.height_unit = this.height_unit;
        user.weight = this.weightKg;
        user.weight_unit = this.weight_unit;
        user.photo = imageBase64;
        AppSetting.setUserData(user);

        var _self = this;
        let request_url = CONFIG.SERVER_URL + '/accounts/update/' + user._id;
        HTTP.request({
            method: "PUT",
            url: request_url,
            content: JSON.stringify(user),
            timeout: CONFIG.timeout,
            headers: { "Content-Type": "application/json" },
        }).then(function (result) {
            _self.set('isLoading', false);
            var res = result.content.toJSON();
            if (res.success) {
                Toast.makeText("Profile has been saved successfully on cloud").show();
            }
            else {
                Toast.makeText(res.message).show();
            }
        }, function (error) {
            _self.set('isLoading', false);
            Toast.makeText('Profile will be synced later due to bad network traffic.').show();
        });
        _self.getUserInfo();
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
    get height(): number {
        return this.get("_height");
    }

    set height(value: number) {
        this.set("_height", value);
    }
    get height2(): number {
        return this.get("_height2");
    }

    set height2(value: number) {
        this.set("_height2", value);
    }
    get height_unit(): string {
        return this.get("_height_unit");
    }

    set height_unit(value: string) {
        this.set("_height_unit", value);
    }
    get height_unit1(): string {
        return this.get("_height_unit1");
    }

    set height_unit1(value: string) {
        this.set("_height_unit1", value);
    }
    get height_unit2(): string {
        return this.get("_height_unit2");
    }

    set height_unit2(value: string) {
        this.set("_height_unit2", value);
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