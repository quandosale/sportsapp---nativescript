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

    constructor(mainPage: Page) {
        super();
        // orientationModule.setCurrentOrientation("portrait", function () {
        //     console.log("landscape orientation set");
        // })

        this.page = mainPage;
        this.name = "";
        this.birthday = "";
        this.gender = "";
        this.height = 0;
        this.weight = 0;

        this.imgUserPhoto = mainPage.getViewById<Image>("userPhoto");
        this.getUserInfo();
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
        let user = AppSetting.getUserData();
        if (user == null) {
            Toast.makeText("Now Guest mode").show();
            return;
        }
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
            //guest mode
            this.name = "Guest";
            this.birthday = "";
            this.gender = "";
            this.height = 0;
            this.weight = 0;
            this.imgUserPhoto.src = "res://default_man";
        }
    }


    initUserData(data) {
        console.log('---------- photo --------------', data.photo, data.photo.length);

        this.name = data.firstname;
        this.birthday = this.dateFormat(data.birthday);
        this.gender = data.gender;

        this.height = data.height;
        this.weight = data.weight;
        var pSrc: string = data.photo;
        this.photoSrc = pSrc;
        if (data.photo != "")
            this.imgUserPhoto.src = data.photo;
        else
            this.imgUserPhoto.src = "res://default_man";
    }
    saveChange() {
        let user = AppSetting.getUserData();
        if (user == null) {
            Toast.makeText("Now Guest mode").show();
            return;
        }
        this.set('isLoading', true);
        if (imageBase64.length == 0) {
            imageBase64 = this.photoSrc;
        }

        user.photo = imageBase64;
        user.firstname = this.name;
        user.birthday = this.birthday;
        user.gender = this.gender;
        user.height = this.height;
        user.weight = this.weight;
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
                _self.getUserInfo();
            }
            else {
                Toast.makeText(res.message).show();
            }
        }, function (error) {
            _self.set('isLoading', false);
            Toast.makeText('Profile will be synced later due to bad network traffic.').show();
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
    get weight(): number {
        return this.get("_weight");
    }

    set weight(value: number) {
        this.set("_weight", value);
    }
    set photoSrc(v: string) {
        this.set("__photoSrc", v);
    }
    get photoSrc(): string {
        return this.get("__photoSrc");
    }
}