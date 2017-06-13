import pages = require("ui/page");
import gestures = require("ui/gestures");
import mainPageVM = require("./main-view-model");
import navigator = require("../../common/navigator");
import prof = require("../../common/profiling");
import { Color } from "color";
import { View } from "ui/core/view";
import { grayTouch } from "../../common/effects";
import { trackEvent } from "../../common/analytics";
import * as platform from "platform";
import { GridLayout } from "ui/layouts/grid-layout";
import { LayoutBase } from "ui/layouts/layout-base";
import { RadSideDrawer } from "nativescript-telerik-ui-pro/sidedrawer";
import * as linearGradient from "../../common/linear-gradient";
import { EventData } from "data/observable";

export function pageLoaded(args) {
    prof.stop("main-page");
    let page = <pages.Page>(<View>args.object).page;
    setTimeout(() => (<any>page).canEnter = true, 3500);
    if (!(<any>page).introStarted) {
        trackEvent("main-page: play intro");
        (<any>page).introStarted = true;
    }
    if (platform.device.os === platform.platformNames.ios) {
        let examplesList = <LayoutBase>page.getViewById("examples-wrap-layout");
        for (let i = 0, length = examplesList.getChildrenCount(); i < length; i++) {
            examplesList.getChildAt(i).ios.layer.masksToBounds = true;
        }
    }

    // To allow the intro things to appear under the ActionBar:
    GridLayout.setRow(page.content, 0);
    GridLayout.setRowSpan(page.content, 2);
}

export function onBackgroundLoaded(args: EventData) {

    let background = <View>args.object;
    let colors = new Array<Color>(new Color("#152189"), new Color("#0E1761"), new Color("#060A2F"));
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

export function onNavigatingTo(args: EventData) {
    (<View>args.object).bindingContext = mainPageVM.instance;
}

export function tapSignUp(args) {
    navigator.navigateToSignUp();
}

export function tapSignIn(args) {
    navigator.navigateToSignIn();
}
export function onGuestModeTap(args) {
    navigator.navigateToScan();
}