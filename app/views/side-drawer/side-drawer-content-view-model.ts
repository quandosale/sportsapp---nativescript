import * as navigator from "../../common/navigator"
import * as gestures from "ui/gestures";
import { topmost } from "ui/frame"
import { grayTouch } from "../../common/effects";
import * as application from "application";
import { Observable } from "data/observable";
import imageModule = require("ui/image");
import drawerModule = require("nativescript-telerik-ui-pro/sidedrawer");
import { Page } from 'ui/page';
import { Image } from "ui/image";
import * as pages from "ui/page";
var image: imageModule.Image;
var page: pages.Page;
import { AppSetting } from '../../common/app-setting';
export class SidedrawerViewModel extends Observable {
    // imgUserPhoto
    imgUserPhoto: Image;
    constructor(mainPage: Page) {
        super();
        this.imgUserPhoto = mainPage.getViewById<Image>("imgUserPhoto");
        this.setImage();
    }
    setImage() {
        let user = AppSetting.getUserData();
        if (user != null) {
            let imageSrc = user.photo;
            if (imageSrc != null || imageSrc != undefined || imageSrc.length != 0)
                this.imgUserPhoto.src = imageSrc;
            else
                this.imgUserPhoto.src = "res://default_man";
        } else {
            // guest mode
            this.imgUserPhoto.src = "res://default_man";
        }
    }
    tileTouch(args: gestures.TouchGestureEventData) {
        grayTouch(args);
    }

    sideDrawer(): any {
        return topmost().currentPage.getViewById("side-drawer");
    }

    closeDrawer() {
        var instance = this.sideDrawer();
        if (instance) {
            instance.closeDrawer();
        }
    }

    toggleDrawerState() {
        var instance = this.sideDrawer();
        if (instance) {
            instance.toggleDrawerState();
        }
    }

    showSlideout(args) {
        this.toggleDrawerState();
    }

    tapHome(args) {
        this.closeDrawer();
        navigator.navigateToHome();
    }
    tapMonitor(args) {
        this.closeDrawer();
        var item = args.object;

        navigator.navigateToMonitor();
    }
    tapSleep(args) {
        this.closeDrawer();
        var item = args.object;

        navigator.navigateToSleep();
    }
    tapData(args) {
        this.closeDrawer();
        navigator.navigateToDataPage();
    }
    tapProfile(args) {
        this.closeDrawer();
        navigator.navigateToProfilePage();
        // navigator.navigateToProfilePageFirst();

    }
    tapSetting(args) {
        this.closeDrawer();
        navigator.navigateToSettingPage();
    }

    tapLogout(args) {
        this.closeDrawer();
        navigator.navigateToHome();
        AppSetting.logout();
    }

    tapAbout(args) {
        this.closeDrawer();
        if (application.android) {
            setTimeout(() => navigator.navigateToAbout(), 600);
        } else {
            navigator.navigateToAbout()
        }
    }

    tapDrawerLink(args) {
        this.closeDrawer();
        navigator.openLink(args.object);
    }
}