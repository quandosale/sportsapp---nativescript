import * as Toast from 'nativescript-toast';
import observable = require("data/observable");
var image = require("ui/image");
var plugin = require("nativescript-screenshot");
import dialogs = require("ui/dialogs");

import pages = require("ui/page");
import frame = require("ui/frame");
import frameModule = require("ui/frame");
import gaugesModule = require("nativescript-telerik-ui-pro/gauges");

import navigator = require("../../../../common/navigator");
import { EventData } from "data/observable";
import bluetooth = require("nativescript-bluetooth");
import { Page } from 'ui/page';
import { SessionViewModel } from './session-ecg-view-model';
import drawerModule = require("nativescript-telerik-ui-pro/sidedrawer");

import { Color } from "color";
import { View } from "ui/core/view";

import { Image } from "ui/image";
import * as platform from "platform";
import { GridLayout } from "ui/layouts/grid-layout";
import { LayoutBase } from "ui/layouts/layout-base";
import { RadSideDrawer } from "nativescript-telerik-ui-pro/sidedrawer";

import * as linearGradient from "../../../../common/linear-gradient";

export function pageLoaded(args) {
    var page = <Page>args.object;
    page.bindingContext = new SessionViewModel(page);

    try {
        Toast.makeText('Screen').show();
        var img = new image.Image();
        img.imageSource = plugin.getImage(args.object);
        console.log(img, args);
        // stackLayout.addChild(img);
    } catch (e) {
        console.log("error: " + e);
    }

}
export function goBack(args: observable.EventData) {
    navigator.navigateBack();
}

export function onCALMBackgroundLoaded(args: EventData) {
    let background = <View>args.object;
    let colors = new Array<Color>(new Color("#64EA66"), new Color('#86ED17'), new Color('#B9F40C'), new Color('#D8F106'), new Color("#E3D106"), new Color("#E9BF06"), new Color("#F2A706"), new Color("#F69F18"));
    let orientation = linearGradient.Orientation.Top_Bottom;

    switch (platform.device.os) {
        case platform.platformNames.android:
            linearGradient.drawBackground(background, colors, orientation);
            break;
        case platform.platformNames.ios:
            // The iOS view has to be sized in order to apply a background
            setTimeout(() => {
                linearGradient.drawBackground(background, colors, orientation);
            });
            break;
    }

}
export function onMotionBackgroundLoaded(args: EventData) {
    let background = <View>args.object;
    // let colors = new Array<Color>(new Color("#BB1700"), new Color('#C03000'), new Color('#C76C03'), new Color('#CEA106'), new Color("#D0B105"));
    let colors = new Array<Color>(new Color("#BB1700"), new Color("#D0B105"));

    let orientation = linearGradient.Orientation.Top_Bottom;

    switch (platform.device.os) {
        case platform.platformNames.android:
            linearGradient.drawBackground(background, colors, orientation);
            break;
        case platform.platformNames.ios:
            // The iOS view has to be sized in order to apply a background
            setTimeout(() => {
                linearGradient.drawBackground(background, colors, orientation);
            });
            break;
    }
}
export function onSnapShotTap(args: EventData) {
    try {
        Toast.makeText('Screen').show();
        var img = new image.Image();
        img.imageSource = plugin.getImage(args.object);

        // stackLayout.addChild(img);
    } catch (e) {
        console.log("error: " + e);
    }
}