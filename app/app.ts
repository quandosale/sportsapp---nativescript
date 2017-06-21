// import trace = require("trace");
// trace.setCategories(trace.categories.Style);
// trace.enable();

import application = require("application");
import frame = require("ui/frame");
import prof = require("./common/profiling");
import * as trace from "trace";
import * as analytics from "./common/analytics";
import "./bundle-modules";
import * as utils from "utils/utils";
import { isIOS } from "platform";

import { AppSetting } from './common/app-setting'; // app setting module

application.on("uncaughtError", args => {
    let error: Error;
    let nativescriptError = args.android || args.ios;
    if (nativescriptError.nativeError) {
        error = {
            name: nativescriptError.name,
            message: nativescriptError.message,
            stack: (<any>nativescriptError).stackTrace
        };
    } else {
        error = nativescriptError;
    }
    analytics.trackException(error, `Uncaught application error`);
});

application.on(application.launchEvent, context => {
    analytics.start();
});

var inAppTime: analytics.TimeToken;
application.on(application.resumeEvent, data => {
    console.log("Resume");
    inAppTime = analytics.trackTimingStart("In app time");
});

application.on(application.suspendEvent, data => {
    console.log("Suspend");
    if (inAppTime) {
        inAppTime.stop();
        inAppTime = undefined;
    }
});

declare var org;
if (application.android) {
    application.on("launch", args => {
        console.log("onLaunch");
        com.facebook.drawee.backends.pipeline.Fresco.initialize(application.android.context);
        application.android.on("activityStarted", ({ activity }) => {
            console.log("onStarted");
            var window = activity.getWindow();
            if (window) {
                window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0xFF151F2F));

                // Prevent the soft keyboard from hiding EditText's while typing.
                window.setSoftInputMode(32); //android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN;
            }
        });

        // Enable ACRA Telerik Analytics crash reporting
        var packageJson = require("./package.json");
        var analyticsProductKeyAndroid = packageJson.analyticsProductKeyAndroid;
        if (analyticsProductKeyAndroid) {
            org.nativescript.ata.AnalyticsReportSender.init(application.android.nativeApp, analyticsProductKeyAndroid);
        }
    });
}

if (application.ios) {
    application.on("launch", args => {
        // TODO: It would be nice if this was ios-specific property on the action bar and static property on application.ios.
        utils.ios.getter(UIApplication, UIApplication.sharedApplication).statusBarStyle = UIStatusBarStyle.UIStatusBarStyleLightContent;
        setTimeout(() => {
            utils.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.backgroundColor = utils.ios.getter(UIColor, UIColor.blackColor);
        }, 1);
    });
}

prof.start("main-page");

let mainModule = "";
if (AppSetting.getUserData() == null) {
    mainModule = "views/main-page/main-page";
} else {
    // mainModule = "views/main-page/main-page";
    // mainModule = "views/main-page/tutorial-page/tutorial-page";
    // mainModule = "views/main-page/profile-page/profile-page";
    // mainModule = "views/main-page/setting-page/setting-page";
    // mainModule = "views/main-page/data-page/data-monitor";
    // mainModule = "views/main-page/sleep-page/sleep-page";
    mainModule = "views/main-page/monitor-page/monitor-page";
    // mainModule = "views/main-page/scan-page/scan-page";
}
application.start(mainModule);
