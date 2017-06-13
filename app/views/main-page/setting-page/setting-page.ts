import drawerModule = require("nativescript-telerik-ui-pro/sidedrawer");
import frameModule = require("ui/frame");
import * as dialogs from "ui/dialogs";
import observable = require("data/observable");
import pages = require("ui/page");
import navigator = require("../../../common/navigator");
import { EventData } from "data/observable";
import { SettingPageModule } from './setting-view-model';
import { AppSetting } from '../../../common/app-setting';
export function onPageLoaded(args: pages.NavigatedData) {
    var page = <pages.Page>args.object;
    page.bindingContext = new SettingPageModule(page);
}
export function goBack(args: observable.EventData) {
    navigator.navigateBack();
}

export function NEXT(args: observable.EventData) {
    navigator.navigateToScan();
    // navigator.navigateToMonitor();

}
export function showSlideout(args: EventData) {
    let sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("side-drawer"));
    if (sideDrawer != undefined)
        sideDrawer.showDrawer();
}
function setDrawerTransition(transition: drawerModule.DrawerTransitionBase) {
    let sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>frameModule.topmost().getViewById("sideDrawer");
    sideDrawer.drawerTransition = transition;
}// << sidedrawer-setting-transition

export function onPairNewDevice(args: EventData) {
    navigator.navigateToScan();
}

export function onLogout(args: EventData) {
    navigator.navigateToHome();
    AppSetting.logout();
}

export function onAboutPage(args: EventData) {
    navigator.navigateToAbout();
}
export function onPrivacy(args: EventData) {
    let options = {
        title: "Your Profile Privacy Seting",
        cancelButtonText: "Cancel",
        actions: ["Shair", "Hidden"]
    };
    dialogs.action(options).then((result) => {
        console.log(result);
    });
}

