import pages = require("ui/page");

import navigator = require("../../../common/navigator");
import { EventData } from "data/observable";
import { Page } from 'ui/page';
import { ScanViewdModel } from './scan-view-model';
import { Color } from "color";
import { View } from "ui/core/view";
import * as platform from "platform";
import { GridLayout } from "ui/layouts/grid-layout";
import { LayoutBase } from "ui/layouts/layout-base";
import { RadSideDrawer } from "nativescript-telerik-ui-pro/sidedrawer";
import * as linearGradient from "../../../common/linear-gradient";

export function pageLoaded(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = new ScanViewdModel();
}
export function goBack(args: EventData) {
    navigator.navigateBack();
}
export function goMonitor(args: EventData) {
    navigator.navigateToMainPage();
}
export function onBackgroundLoaded(args: EventData) {

    // let background = <View>args.object;
    // let colors = new Array<Color>(new Color("#152189"), new Color("#0E1761"), new Color("#060A2F"));
    // let orientation = linearGradient.Orientation.Top_Bottom;

    // switch (platform.device.os) {
    //     case platform.platformNames.android:
    //         linearGradient.drawBackground(background, colors, orientation);
    //         break;
    //     case platform.platformNames.ios:
    //         // The iOS view has to be sized in order to apply a background
    //         setTimeout(() => {
    //             linearGradient.drawBackground(background, colors, orientation);
    //         });
    //         break;
    // }
}