"use strict";
var appModule = require("application");
var utils = require("utils/utils");
var DFU_CODE = 3556; // random number
Object.defineProperty(exports, "__esModule", {
    value: true
});
var sportsotadfu_common_1 = require("./sportsotadfu.common");

var DfuActivity = com.tool.sports.com.dfutool.DfuActivity;

var Sportsotadfu = (function (_super) {
    __extends(Sportsotadfu, _super);

    function Sportsotadfu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Sportsotadfu.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Sportsotadfu.prototype.start = function (strBleMac) {
        try {
            var intent = new android.content.Intent(utils.ad.getApplicationContext(), DfuActivity.class);
            intent.putExtra("BLE_MAC_ADDRESS", strBleMac); // send Ble Mac Address to Android Activity
            appModule.android.foregroundActivity.startActivity(intent);
        } catch (err) {
            console.log('---------------BEGIN Error in call dfu Activity ------------------');
            console.log(err);
            console.log('---------------END   Error in call dfu Activity ------------------');
        }
    };
    return Sportsotadfu;
}(sportsotadfu_common_1.Common));
exports.Sportsotadfu = Sportsotadfu;
//# sourceMappingURL=sportsotadfu.android.js.map