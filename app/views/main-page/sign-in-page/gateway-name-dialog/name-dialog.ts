import * as pages from "ui/page";
import textFieldModule = require("ui/text-field");
import * as observable from "data/observable";

var context: any;
var closeCallback: Function;
var page: pages.Page;
var textField_gateway_name: textFieldModule.TextField;


export function onShownModally(args: pages.ShownModallyData) {
    console.log("login-page.onShownModally, context: " + args.context);
    context = args.context;
    closeCallback = args.closeCallback;
}

export function onLoaded(args: observable.EventData) {
    page = <pages.Page>args.object;
    textField_gateway_name = page.getViewById<textFieldModule.TextField>("gateway_name");
}

export function onUnloaded() {

}

export function onOKButtonTap() {
    closeCallback(textField_gateway_name.text);
}
