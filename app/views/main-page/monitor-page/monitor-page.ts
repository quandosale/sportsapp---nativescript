import observable = require("data/observable");
import dialogs = require("ui/dialogs");

import frameModule = require("ui/frame");

import navigator = require("../../../common/navigator");
import { EventData } from "data/observable";
import { Page } from 'ui/page';
import { MonitorViewdModel } from './monitor-view-model';
import drawerModule = require("nativescript-telerik-ui-pro/sidedrawer");

export function pageLoaded(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = new MonitorViewdModel(page);
}
export function onUnloaded() {

}
export function goBack(args: observable.EventData) {
    navigator.navigateBack();
}
export function showSlideout(args: observable.EventData) {
    let sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("side-drawer"));
    sideDrawer.showDrawer();
}