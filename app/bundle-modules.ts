alert('bundle modules');
if (global.TNS_WEBPACK) {
    global.registerModule("views/about/about", () => require("views/about/about"));
    global.registerModule("views/main-page/main-page", () => require("views/main-page/main-page"));
    global.registerModule("views/main-page/data-page/data-monitor", () => require("views/main-page/data-page/data-monitor"));
    global.registerModule("views/main-page/data-page/session-ecg-page/session-ecg-page", () => require("views/main-page/data-page/session-ecg-page/session-ecg-page"));
    global.registerModule("views/main-page/data-page/session-sleep-page/session-sleep-page", () => require("views/main-page/data-page/session-sleep-page/session-sleep-page"));

    global.registerModule("views/main-page/monitor-page/monitor-page", () => require("views/main-page/monitor-page/monitor-page"));
    global.registerModule("views/main-page/profile-page/profile-page", () => require("views/main-page/profile-page/profile-page"));
    global.registerModule("views/main-page/scan-page/scan-page", () => require("views/main-page/scan-page/scan-page"));
    global.registerModule("views/main-page/setting-page/setting-page", () => require("views/main-page/setting-page/setting-page"));
    global.registerModule("views/main-page/sign-in-page/sign-in-page", () => require("views/main-page/sign-in-page/sign-in-page"));
    global.registerModule("views/main-page/sign-up-page/sign-up-page", () => require("views/main-page/sign-up-page/sign-up-page"));
    global.registerModule("views/main-page/sleep-page/sleep-page", () => require("views/main-page/sleep-page/sleep-page"));
    global.registerModule("views/main-page/sleep-page/wake-page/wake-page", () => require("views/main-page/sleep-page/wake-page/wake-page"));
    global.registerModule("views/main-page/sleep-page/snooze-page/snooze-page", () => require("views/main-page/sleep-page/snooze-page/snooze-page"));
    global.registerModule("views/main-page/tutorial-page/tutorial-page", () => require("views/main-page/tutorial-page/tutorial-page"));

    global.registerModule("views/side-drawer/side-drawer-content-d/side-drawer-content", () => require("views/side-drawer/side-drawer-content-d/side-drawer-content"));
    global.registerModule("views/side-drawer/side-drawer-content-m/side-drawer-content", () => require("views/side-drawer/side-drawer-content-m/side-drawer-content"));
    global.registerModule("views/side-drawer/side-drawer-content-p/side-drawer-content", () => require("views/side-drawer/side-drawer-content-p/side-drawer-content"));
    global.registerModule("views/side-drawer/side-drawer-content-s/side-drawer-content", () => require("views/side-drawer/side-drawer-content-s/side-drawer-content"));
    global.registerModule("views/side-drawer/side-drawer-content-st/side-drawer-content", () => require("views/side-drawer/side-drawer-content-st/side-drawer-content"));

    global.registerModule("ui/page", () => require("ui/page"))
    global.registerModule("ui/action-bar", () => require("ui/action-bar"))
    global.registerModule("ui/layouts/absolute-layout", () => require("ui/layouts/absolute-layout"))
    global.registerModule("ui/activity-indicator", () => require("ui/activity-indicator"))
    global.registerModule("ui/border", () => require("ui/border"))
    global.registerModule("ui/button", () => require("ui/button"))
    global.registerModule("ui/content-view", () => require("ui/content-view"))
    global.registerModule("ui/date-picker", () => require("ui/date-picker"))
    global.registerModule("ui/layouts/dock-layout", () => require("ui/layouts/dock-layout"))
    global.registerModule("ui/layouts/grid-layout", () => require("ui/layouts/grid-layout"))
    global.registerModule("ui/html-view", () => require("ui/html-view"))
    global.registerModule("ui/image", () => require("ui/image"))
    global.registerModule("ui/label", () => require("ui/label"))
    global.registerModule("ui/list-picker", () => require("ui/list-picker"))
    global.registerModule("ui/list-view", () => require("ui/list-view"))
    global.registerModule("ui/placeholder", () => require("ui/placeholder"))
    global.registerModule("ui/progress", () => require("ui/progress"))
    global.registerModule("ui/proxy-view-container", () => require("ui/proxy-view-container"))
    global.registerModule("ui/repeater", () => require("ui/repeater"))
    global.registerModule("ui/scroll-view", () => require("ui/scroll-view"))
    global.registerModule("ui/search-bar", () => require("ui/search-bar"))
    global.registerModule("ui/segmented-bar", () => require("ui/segmented-bar"))
    global.registerModule("ui/slider", () => require("ui/slider"))
    global.registerModule("ui/layouts/stack-layout", () => require("ui/layouts/stack-layout"))
    global.registerModule("ui/switch", () => require("ui/switch"))
    global.registerModule("ui/tab-view", () => require("ui/tab-view"))
    global.registerModule("ui/text-field", () => require("ui/text-field"))
    global.registerModule("ui/text-view", () => require("ui/text-view"))
    global.registerModule("ui/time-picker", () => require("ui/time-picker"))
    global.registerModule("ui/web-view", () => require("ui/web-view"))
    global.registerModule("ui/layouts/wrap-layout", () => require("ui/layouts/wrap-layout"))
    global.registerModule("text/formatted-string", () => require("text/formatted-string"))
    global.registerModule("text/span", () => require("text/span"))
    global.registerModule("ui/proxy-view-container", () => require("ui/proxy-view-container"))

    global.registerModule("nativescript-telerik-ui-pro/sidedrawer", () => require("nativescript-telerik-ui-pro/sidedrawer"))
    global.registerModule("nativescript-telerik-ui-pro/chart", () => require("nativescript-telerik-ui-pro/chart"))
    global.registerModule("nativescript-telerik-ui-pro/listview", () => require("nativescript-telerik-ui-pro/listview"))
}
