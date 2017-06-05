import observable = require("data/observable");
import dialogs = require("ui/dialogs");
import navigator = require("../../../../common/navigator");
import { EventData } from "data/observable";
import { Page } from 'ui/page';
import { SessionViewModel } from './session-sleep-view-model';
import { Color } from "color";
import { View } from "ui/core/view";
import * as platform from "platform";
import { RadSideDrawer } from "nativescript-telerik-ui-pro/sidedrawer";
import * as linearGradient from "../../../../common/linear-gradient";

export function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = new SessionViewModel(page);
}
export function goBack(args: observable.EventData) {
    navigator.navigateBack();
}

export function onSleepMapBackgroundLoaded(args: EventData) {
    let background = <View>args.object;
    let colors = new Array<Color>(new Color("#0027D2"), new Color("#14AD1C"), new Color("#DC9701"));

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