import { EventData } from "data/observable";
import drawerModule = require("nativescript-telerik-ui-pro/sidedrawer");
import frameModule = require("ui/frame");
import viewModel = require("./data-model");

export function onPageLoaded(args) {
    var page = args.object;
    page.bindingContext = new viewModel.ViewModel();
}
export function showSlideout(args: EventData) {
    let sideDrawer: drawerModule.RadSideDrawer = <drawerModule.RadSideDrawer>(frameModule.topmost().getViewById("side-drawer"));
    sideDrawer.showDrawer();
}