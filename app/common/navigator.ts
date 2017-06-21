import frame = require("ui/frame");
import viewModule = require("ui/core/view");
import platform = require("platform");
import prof = require("../common/profiling");
import * as analytics from "./analytics";
import * as utils from "utils/utils";

var isIOS: boolean = platform.device.os === platform.platformNames.ios;
var isAndroid: boolean = platform.device.os === platform.platformNames.android;

function traceNavigateTo(to: string, context?: string): string {
    var eventText = "Navigate to: " + to + (context ? " (" + context + ")" : "");
    console.log("Track: " + eventText);
    // analytics.trackEvent(eventText);
    return to;
}
export function navigateToMainPage() {
    // navigateToProfilePage();
    // navigateToDataPage();
    navigateToMonitor();
    // navigateToScan();
    // navigateToSleep();
    // navigateToTutorial();
    // navigateToSettingPage();
    // navigateToAbout();
}
export function navigateToHome() {
    commonNavigateWithClear("views/main-page/main-page");
}

export function navigateToAbout() {
    commonNavigateWithClear("views/about/about");
}
export function navigateToSignUp() {
    commonNavigateWithClear("views/main-page/sign-up-page/sign-up-page");
}


export function navigateToConfigureDate() {
    commonNavigateWithClear("views/main-page/sign-up-page/configure/configure-date-picker.component");
}
export function navigateToSignIn() {
    commonNavigateWithClear("views/main-page/sign-in-page/sign-in-page");
}
export function navigateToScan() {
    commonNavigateWithClear("views/main-page/scan-page/scan-page");
}
export function navigateToTutorial() {
    commonNavigateWithClear("views/main-page/tutorial-page/tutorial-page", true);
}

export function navigateToMonitor() {
    commonNavigateWithClear("views/main-page/monitor-page/monitor-page", true);
}

export function navigateToMonitorFullDrawer() {
    commonNavigateWithClear("views/main-page/monitor-page/draw-page/draw-page");
}

export function navigateToSleep() {
    commonNavigateWithClear("views/main-page/sleep-page/sleep-page");
}

export function navigateToWakeUp() {
    commonNavigateWithClear("views/main-page/sleep-page/wake-page/wake-page");
}
export function navigateToSnooze() {
    commonNavigateWithClear("views/main-page/sleep-page/snooze-page/snooze-page");
}

export function navigateToDataPage() {
    commonNavigateWithClear("views/main-page/data-page/data-monitor", true);
}


export function navigateToSessionEcg(datasetId: string) {
    commonNavigateWithClear("views/main-page/data-page/session-ecg-page/session-ecg-page", false, datasetId);
}
export function navigateToSessionSleep(datasetId: string) {
    commonNavigateWithClear("views/main-page/data-page/session-sleep-page/session-sleep-page", false, datasetId);
}
export function navigateToProfilePage() {
    commonNavigateWithClear("views/main-page/profile-page/profile-page", true);
}

export function navigateToSettingPage() {
    commonNavigateWithClear("views/main-page/setting-page/setting-page", true);
}

export function navigateBack() {
    frame.goBack();
}

export function openLink(view: any) {
    var url = view.tag;
    if (url) {
        if (isIOS) {
            var nsUrl = NSURL.URLWithString(url);
            var sharedApp = utils.ios.getter(UIApplication, UIApplication.sharedApplication);
            if (sharedApp.canOpenURL(nsUrl)) {
                sharedApp.openURL(nsUrl);
            }
        }
        else if (isAndroid) {
            var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url));
            var activity = frame.topmost().android.activity;
            activity.startActivity(android.content.Intent.createChooser(intent, "share"));
        }
    }
}
function commonNavigateWithClear(page: string, _flagClearHistory?: boolean, _datasetId?: string) {
    _flagClearHistory = _flagClearHistory ? _flagClearHistory : false;
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== page) {
        frame.topmost().navigate({
            clearHistory: _flagClearHistory,
            moduleName: traceNavigateTo(page), animated: true, transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            },
            context: {
                datasetId: _datasetId
            }
        });
    }
}