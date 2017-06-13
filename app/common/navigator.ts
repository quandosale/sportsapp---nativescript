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
    analytics.trackEvent(eventText);
    return to;
}
export function navigateToMainPage() {
    navigateToProfilePage();
}
export function navigateToHome() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/main-page") {
        frame.topmost().navigate(traceNavigateTo("views/main-page/main-page"));
    }
}

export function navigateToAbout() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/about/about") {
        frame.topmost().navigate(traceNavigateTo("views/about/about"));
    }
}
export function navigateToSignUp() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/sign-up-page/sign-up-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/sign-up-page/sign-up-page"), animated: true,
            transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}

export function navigateToConfigureDate() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/sign-up-page/configure/configure-date-picker.component") {
        frame.topmost().navigate(traceNavigateTo("views/main-page/sign-up-page/configure/configure-date-picker.component"));
    }
}
export function navigateToSignIn() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/sign-in-page/sign-in-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/sign-in-page/sign-in-page"), animated: true,
            transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}
export function navigateToScan() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/scan-page/scan-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/scan-page/scan-page"), animated: true, transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}
export function navigateToTutorial() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/tutorial-page/tutorial-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/tutorial-page/tutorial-page"), animated: true, transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}

export function navigateToMonitor() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/monitor-page/monitor-page") {
        frame.topmost().navigate({
            clearHistory: true,
            moduleName: traceNavigateTo("views/main-page/monitor-page/monitor-page"), animated: true, transition: {
                name: 'fade',
                duration: 780,
                curve: "easeIn"
            }
        });
    }
}

export function navigateToMonitorFullDrawer() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/monitor-page/draw-page/draw-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/monitor-page/draw-page/draw-page"), animated: true, transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}

export function navigateToSleep() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/sleep-page/sleep-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/sleep-page/sleep-page"),
            clearHistory: true,
            animated: true,
            transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}

export function navigateToWakeUp() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/sleep-page/wake-page/wake-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/sleep-page/wake-page/wake-page"),
            animated: true,
            transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}
export function navigateToSnooze() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/sleep-page/snooze-page/snooze-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/sleep-page/snooze-page/snooze-page"),
            animated: true, transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}


export function navigateToDataPage() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/data-page/data-monitor") {
        frame.topmost().navigate({
            clearHistory: true,
            moduleName: traceNavigateTo("views/main-page/data-page/data-monitor"), animated: true, transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}


export function navigateToSessionEcg() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/data-page/session-ecg-page/session-ecg-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/data-page/session-ecg-page/session-ecg-page"), animated: true, transition: {
                name: 'slideLeft',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}
export function navigateToSessionSleep() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/data-page/session-sleep-page/session-sleep-page") {
        frame.topmost().navigate({
            moduleName: traceNavigateTo("views/main-page/data-page/session-sleep-page/session-sleep-page"), animated: true, transition: {
                name: 'slideLeft',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}
export function navigateToProfilePage() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/profile-page/profile-page") {
        frame.topmost().navigate({
            clearHistory: true,
            moduleName: traceNavigateTo("views/main-page/profile-page/profile-page"), animated: true, transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
}

export function navigateToSettingPage() {
    var topmost = frame.topmost();
    if (topmost.currentEntry.moduleName !== "views/main-page/setting-page/setting-page") {
        frame.topmost().navigate({
            clearHistory: true,
            moduleName: traceNavigateTo("views/main-page/setting-page/setting-page"), animated: true,
            transition: {
                name: 'fade',
                duration: 380,
                curve: "easeIn"
            }
        });
    }
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