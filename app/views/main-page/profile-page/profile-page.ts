import drawerModule = require("nativescript-telerik-ui-pro/sidedrawer");
import frameModule = require("ui/frame");
import { EventData } from "data/observable";
import { Page } from "ui/page";
import { View } from "ui/core/view";

import * as platform from "platform";
import * as application from "application"
import { ProfileModel } from './profile-view-model';
declare var android: any;

export function onPageLoaded(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = new ProfileModel(page);
}

export function onContentLoaded(args: EventData) {
    let view = <View>args.object;
    console.log('oncontentloaded');
}

export function onBackgroundLoaded(args: EventData) {

}

export function onProfilePictureTapped(args: EventData) {
    notify("Change Image Tapped!");
}
export function onUpdateButtonTapped(args: EventData) {
    notify("Update Tapped!");
}

declare var android;
function notify(msg: string) {
    switch (platform.device.os) {
        case platform.platformNames.android:
            android.widget.Toast.makeText(application.android.context, msg, android.widget.Toast.LENGTH_SHORT).show();
            break;
        case platform.platformNames.ios:
            console.log(msg);
            break;
    }
}

export function showSlideout(args: EventData) {
    let sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("side-drawer"));
    sideDrawer.showDrawer();
}