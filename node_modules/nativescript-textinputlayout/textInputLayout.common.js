"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("ui/core/view");
var dependency_observable_1 = require("ui/core/dependency-observable");
var proxy_1 = require("ui/core/proxy");
var TIL = 'TextInputLayout';
var errorProperty = new dependency_observable_1.Property("error", TIL, new proxy_1.PropertyMetadata('', dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var hintProperty = new dependency_observable_1.Property("hint", TIL, new proxy_1.PropertyMetadata('', dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var hintAnimationEnabledProperty = new dependency_observable_1.Property("hintAnimationEnabled", TIL, new proxy_1.PropertyMetadata(true, dependency_observable_1.PropertyMetadataSettings.None));
var hintTextAppearanceProperty = new dependency_observable_1.Property("hintTextAppearance", TIL, new proxy_1.PropertyMetadata(undefined));
var counterEnabledProperty = new dependency_observable_1.Property("counterEnabled", TIL, new proxy_1.PropertyMetadata(false, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var errorEnabledProperty = new dependency_observable_1.Property("errorEnabled", TIL, new proxy_1.PropertyMetadata(true, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var titleProperty = new dependency_observable_1.Property("title", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var tintColorProperty = new dependency_observable_1.Property("tintColor", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsStyle));
var lineColorProperty = new dependency_observable_1.Property("lineColor", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsStyle));
var selectedTitleColorProperty = new dependency_observable_1.Property("selectedTitleColor", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsStyle));
var selectedLineColorProperty = new dependency_observable_1.Property("selectedLineColor", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsStyle));
var lineHeightProperty = new dependency_observable_1.Property("lineHeight", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var selectedLineHeightProperty = new dependency_observable_1.Property("selectedLineHeight", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var errorColorProperty = new dependency_observable_1.Property("errorColor", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsStyle));
var iconColorProperty = new dependency_observable_1.Property("iconColor", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsStyle));
var selectedIconColorProperty = new dependency_observable_1.Property("selectedIconColor", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsStyle));
var iconFontProperty = new dependency_observable_1.Property("iconFont", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var iconTextProperty = new dependency_observable_1.Property("iconText", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var iconMarginBottomProperty = new dependency_observable_1.Property("iconMarginBottom", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var iconMarginLeftProperty = new dependency_observable_1.Property("iconMarginLeft", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var iconRotationDegreesProperty = new dependency_observable_1.Property("iconRotationDegrees", TIL, new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.AffectsLayout));
var TextInputLayout = (function (_super) {
    __extends(TextInputLayout, _super);
    function TextInputLayout() {
        return _super.call(this) || this;
    }
    Object.defineProperty(TextInputLayout.prototype, "hint", {
        get: function () { return this._getValue(hintProperty); },
        set: function (value) { this._setValue(hintProperty, value + ''); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "error", {
        get: function () { return this._getValue(errorProperty); },
        set: function (val) { this._setValue(errorProperty, val + ''); },
        enumerable: true,
        configurable: true
    });
    return TextInputLayout;
}(view_1.View));
TextInputLayout.errorProperty = errorProperty;
TextInputLayout.hintProperty = hintProperty;
TextInputLayout.counterEnabledProperty = counterEnabledProperty;
TextInputLayout.hintAnimationEnabledProperty = hintAnimationEnabledProperty;
TextInputLayout.hintTextAppearanceProperty = hintTextAppearanceProperty;
TextInputLayout.errorEnabledProperty = errorEnabledProperty;
TextInputLayout.titleProperty = titleProperty;
TextInputLayout.selectedTitleColorProperty = selectedTitleColorProperty;
TextInputLayout.tintColorProperty = tintColorProperty;
TextInputLayout.lineColorProperty = lineColorProperty;
TextInputLayout.selectedLineColorProperty = selectedLineColorProperty;
TextInputLayout.lineHeightProperty = lineHeightProperty;
TextInputLayout.selectedLineHeightProperty = selectedLineHeightProperty;
TextInputLayout.errorColorProperty = errorColorProperty;
TextInputLayout.iconColorProperty = iconColorProperty;
TextInputLayout.selectedIconColorProperty = selectedIconColorProperty;
TextInputLayout.iconFontProperty = iconFontProperty;
TextInputLayout.iconTextProperty = iconTextProperty;
TextInputLayout.iconMarginBottomProperty = iconMarginBottomProperty;
TextInputLayout.iconMarginLeftProperty = iconMarginLeftProperty;
TextInputLayout.iconRotationDegreesProperty = iconRotationDegreesProperty;
exports.TextInputLayout = TextInputLayout;
