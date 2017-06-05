"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var observable_1 = require("data/observable");
var app = require("application");
var dialogs = require("ui/dialogs");
var Common = (function (_super) {
    __extends(Common, _super);

    function Common() {
        var _this = _super.call(this) || this;

        return _this;
    }
    return Common;
}(observable_1.Observable));
exports.Common = Common;
var Utils = (function () {
    function Utils() {}
    Utils.SUCCESS_MSG = function () {
        var msg = "Your plugin is working on " + (app.android ? 'Android' : 'iOS') + ".";
        setTimeout(function () {
            dialogs.alert(msg + " For real. It's really working :)").then(function () {
                return console.log("Dialog closed.");
            });
        }, 2000);
        return msg;
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=sportsotadfu.common.js.map