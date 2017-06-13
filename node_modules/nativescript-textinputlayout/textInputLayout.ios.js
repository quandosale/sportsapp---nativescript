"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var textInputLayout_common_1 = require("./textInputLayout.common");
var text_field_1 = require("ui/text-field");
var color_1 = require("color");
function onErrorPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios) {
        til.ios.errorMessage = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.errorProperty.metadata.onSetNativeValue = onErrorPropertyChanged;
function onHintPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios) {
        til.ios.placeholder = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.hintProperty.metadata.onSetNativeValue = onHintPropertyChanged;
function onTitlePropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios) {
        til.ios.title = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.titleProperty.metadata.onSetNativeValue = onTitlePropertyChanged;
function onSelectedTitleColorPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && color_1.Color.isValid(pcData.newValue)) {
        til.ios.selectedTitleColor = new color_1.Color(pcData.newValue).ios;
    }
}
textInputLayout_common_1.TextInputLayout.selectedTitleColorProperty.metadata.onSetNativeValue = onSelectedTitleColorPropertyChanged;
function onTintColorPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && color_1.Color.isValid(pcData.newValue)) {
        til.ios.tintColor = new color_1.Color(pcData.newValue).ios;
    }
}
textInputLayout_common_1.TextInputLayout.tintColorProperty.metadata.onSetNativeValue = onTintColorPropertyChanged;
function onLineColorPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && color_1.Color.isValid(pcData.newValue)) {
        til.ios.lineColor = new color_1.Color(pcData.newValue).ios;
    }
}
textInputLayout_common_1.TextInputLayout.lineColorProperty.metadata.onSetNativeValue = onLineColorPropertyChanged;
function onSelectedLineColorPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && color_1.Color.isValid(pcData.newValue)) {
        til.ios.selectedLineColor = new color_1.Color(pcData.newValue).ios;
    }
}
textInputLayout_common_1.TextInputLayout.selectedLineColorProperty.metadata.onSetNativeValue = onSelectedLineColorPropertyChanged;
function onLineHeightPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.lineHeight = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.lineHeightProperty.metadata.onSetNativeValue = onLineHeightPropertyChanged;
function onSelectedLineHeightPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.selectedLineHeight = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.selectedLineHeightProperty.metadata.onSetNativeValue = onSelectedLineHeightPropertyChanged;
function onErrorColorPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && color_1.Color.isValid(pcData.newValue)) {
        til.ios.errorColor = new color_1.Color(pcData.newValue).ios;
    }
}
textInputLayout_common_1.TextInputLayout.errorColorProperty.metadata.onSetNativeValue = onErrorColorPropertyChanged;
function onIconColorPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && color_1.Color.isValid(pcData.newValue)) {
        til.ios.iconColor = new color_1.Color(pcData.newValue).ios;
    }
}
textInputLayout_common_1.TextInputLayout.iconColorProperty.metadata.onSetNativeValue = onIconColorPropertyChanged;
function onSelectedIconColorPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && color_1.Color.isValid(pcData.newValue)) {
        til.ios.selectedIconColor = new color_1.Color(pcData.newValue).ios;
    }
}
textInputLayout_common_1.TextInputLayout.selectedIconColorProperty.metadata.onSetNativeValue = onSelectedIconColorPropertyChanged;
function onIconFontPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios) {
        til.ios.iconFont = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.iconFontProperty.metadata.onSetNativeValue = onIconFontPropertyChanged;
function onIconTextPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios) {
        til.ios.iconText = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.iconTextProperty.metadata.onSetNativeValue = onIconTextPropertyChanged;
function onIconMarginBottomPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.iconMarginBottom = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.iconMarginBottomProperty.metadata.onSetNativeValue = onIconMarginBottomPropertyChanged;
function onIconMarginLeftPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.iconMarginLeft = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.iconMarginLeftProperty.metadata.onSetNativeValue = onIconMarginLeftPropertyChanged;
function onIconRotationDegreesPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.iconRotationDegrees = pcData.newValue;
    }
}
textInputLayout_common_1.TextInputLayout.iconRotationDegreesProperty.metadata.onSetNativeValue = onIconRotationDegreesPropertyChanged;
var TextInputLayout = (function (_super) {
    __extends(TextInputLayout, _super);
    function TextInputLayout() {
        var _this = _super.call(this) || this;
        global.TILS = global.TILS || [];
        global.TILS.push(_this);
        _this._ios = new SkyFloatingLabelTextField(CGRectMake(0, 0, 0, 0));
        return _this;
    }
    Object.defineProperty(TextInputLayout.prototype, "ios", {
        get: function () { return this._ios; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "_nativeView", {
        get: function () { return this._ios; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "hint", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.hintProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.hintProperty, value + ''); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "error", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.errorProperty); },
        set: function (val) { this._setValue(textInputLayout_common_1.TextInputLayout.errorProperty, val + ''); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "title", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.titleProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.titleProperty, value + ''); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "selectedTitleColor", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.selectedTitleColorProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.selectedTitleColorProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "tintColor", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.tintColorProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.tintColorProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "lineColor", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.lineColorProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.lineColorProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "selectedLineColor", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.selectedLineColorProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.selectedLineColorProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "lineHeight", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.lineHeightProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.lineHeightProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "selectedLineHeight", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.selectedLineHeightProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.selectedLineHeightProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "errorColor", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.errorColorProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.errorColorProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "iconText", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.iconTextProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.iconTextProperty, value + ''); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "iconFont", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.iconFontProperty); },
        set: function (value) {
            if (value instanceof UIFont) {
                this._setValue(textInputLayout_common_1.TextInputLayout.iconFontProperty, value);
            }
            else {
                console.warn('TIL:iconFont can only be set to an instance of UIFont');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "iconColor", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.iconColorProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.iconColorProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "selectedIconColor", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.selectedIconColorProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.selectedIconColorProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "iconMarginBottom", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.iconMarginBottomProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.iconMarginBottomProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "iconMarginLeft", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.iconMarginLeftProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.iconMarginLeftProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "iconRotationDegrees", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.iconRotationDegreesProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.iconRotationDegreesProperty, value); },
        enumerable: true,
        configurable: true
    });
    return TextInputLayout;
}(text_field_1.TextField));
exports.TextInputLayout = TextInputLayout;
var TextInputLayoutWithIcon = (function (_super) {
    __extends(TextInputLayoutWithIcon, _super);
    function TextInputLayoutWithIcon() {
        var _this = _super.call(this) || this;
        _this._ios = new SkyFloatingLabelTextFieldWithIcon(CGRectMake(0, 0, 0, 0));
        return _this;
    }
    return TextInputLayoutWithIcon;
}(TextInputLayout));
exports.TextInputLayoutWithIcon = TextInputLayoutWithIcon;
