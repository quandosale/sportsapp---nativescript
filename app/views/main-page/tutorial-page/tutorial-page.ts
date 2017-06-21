import pages = require("ui/page");
import navigator = require("../../../common/navigator");
import { EventData } from "data/observable";
import { Page } from 'ui/page';
import { TutorialViewdModel } from './tutorial-view-model';

export function pageLoaded(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = new TutorialViewdModel();
}
export function goBack(args: EventData) {
    navigator.navigateBack();
}
export function goScan(args: EventData) {

    navigator.navigateToScan();
}
