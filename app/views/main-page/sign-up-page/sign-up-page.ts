import { EventData } from "data/observable";
import * as navigator from "../../../common/navigator";
import pages = require("ui/page");
import { SignUpPageModule } from './sign-up-page-model';
export function onPageLoaded(args: pages.NavigatedData) {
    var page = <pages.Page>args.object;
    page.bindingContext = new SignUpPageModule(page);
}
export function goBack(args: EventData) {
    navigator.navigateBack();
}