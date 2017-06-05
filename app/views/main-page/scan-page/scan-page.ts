import pages = require("ui/page");

import navigator = require("../../../common/navigator");
import { EventData } from "data/observable";
import { Page } from 'ui/page';
import { ScanViewdModel } from './scan-view-model';

export function pageLoaded(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = new ScanViewdModel();
}
export function goBack(args: EventData) {
    navigator.navigateBack();
}
export function goMonitor(args: EventData) {
    navigator.navigateToMonitor();
}
