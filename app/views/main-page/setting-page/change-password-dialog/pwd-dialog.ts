import * as pages from "ui/page";
import textFieldModule = require("ui/text-field");
import * as observable from "data/observable";

var context: any;
var closeCallback: Function;
var page: pages.Page;
var textField_pre: textFieldModule.TextField;
var textField_new: textFieldModule.TextField;
var textField_confirm: textFieldModule.TextField;


export function onShownModally(args: pages.ShownModallyData) {
    console.log("login-page.onShownModally, context: " + args.context);
    context = args.context;
    closeCallback = args.closeCallback;
}

export function onLoaded(args: observable.EventData) {
    page = <pages.Page>args.object;
    textField_pre = page.getViewById<textFieldModule.TextField>("pre");
    textField_new = page.getViewById<textFieldModule.TextField>("new");
    textField_confirm = page.getViewById<textFieldModule.TextField>("confirm");
}

export function onUnloaded() {

}

export function onOKButtonTap() {

    if (textField_new.text != textField_confirm.text) {
        alert('The passwords do not match');
        return;
    }
    closeCallback("success");
}
