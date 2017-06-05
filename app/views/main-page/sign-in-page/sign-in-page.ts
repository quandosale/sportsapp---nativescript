import * as platform from 'platform';
import pages = require("ui/page");
import { EventData } from "data/observable";
import navigator = require("../../../common/navigator");
import { SignInPageModule } from './sign-in-view-model';

export function onPageLoaded(args: pages.NavigatedData) {
    var page = <pages.Page>args.object;
    page.bindingContext = new SignInPageModule(page);
}

export function goBack(args: EventData) {
    navigator.navigateBack();
}
