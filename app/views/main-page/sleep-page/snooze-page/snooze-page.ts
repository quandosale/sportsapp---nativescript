import observable = require("data/observable");
import pages = require("ui/page");
import navigator = require("../../../../common/navigator");
import { EventData } from "data/observable";
import { SnoozeViewModule } from './snooze-view-model';
export function onPageLoaded(args: pages.NavigatedData) {
    var page = <pages.Page>args.object;
    page.bindingContext = new SnoozeViewModule(page);
}
export function goBack(args: observable.EventData) {
    navigator.navigateBack();
}


export function wakeup(args: EventData) {
    navigator.navigateToScan();
}