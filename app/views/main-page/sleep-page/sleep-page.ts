import observable = require("data/observable");
import pages = require("ui/page");
import navigator = require("../../../common/navigator");
import { EventData } from "data/observable";
import drawerModule = require("nativescript-telerik-ui-pro/sidedrawer");
import frameModule = require("ui/frame");
import { SleepViewModule } from './sleep-view-model';

export function onPageLoaded(args: EventData) {
    var page = <pages.Page>args.object;
    page.bindingContext = new SleepViewModule(page);
}
export function goBack(args: observable.EventData) {
    navigator.navigateBack();
}

export function wakeup(args: EventData) {
    navigator.navigateToWakeUp();
}

export function showSlideout(args: EventData) {
    let sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("side-drawer"));
    sideDrawer.showDrawer();
}