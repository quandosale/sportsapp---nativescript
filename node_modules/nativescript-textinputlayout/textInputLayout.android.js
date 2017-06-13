"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var textInputLayout_common_1 = require("./textInputLayout.common");
var view_1 = require("ui/core/view");
var text_view_1 = require("ui/text-view");
var text_field_1 = require("ui/text-field");
function onHintPropertyChanged(pcData) {
    var til = pcData.object;
    if (til.android) {
        til.android.setHint(pcData.newValue);
    }
}
textInputLayout_common_1.TextInputLayout.hintProperty.metadata.onSetNativeValue = onHintPropertyChanged;
function onHintAnimationEnabledPropertyChanged(pcData) {
    var til = pcData.object, enabled = !!pcData.newValue;
    if (til.android) {
        til.android.setHintAnimationEnabled(enabled);
    }
}
textInputLayout_common_1.TextInputLayout.hintAnimationEnabledProperty.metadata.onSetNativeValue = onHintAnimationEnabledPropertyChanged;
function onHintAppearancePropertyChanged(pcData) {
    var til = pcData.object;
    if (til.hintTextAppearance) {
        var resId = getStyleResourceId(til._context, til.hintTextAppearance);
        if (resId) {
            til.android.setHintTextAppearance(resId);
        }
    }
}
textInputLayout_common_1.TextInputLayout.hintTextAppearanceProperty.metadata.onSetNativeValue = onHintAppearancePropertyChanged;
function onErrorEnabledPropertyChanged(pcData) {
    var til = pcData.object, enabled = !!pcData.newValue;
    if (til.android) {
        if (!enabled && (til.error || '').length > 0) {
            til.error = '';
        }
        til.android.setErrorEnabled(enabled);
    }
}
textInputLayout_common_1.TextInputLayout.errorEnabledProperty.metadata.onSetNativeValue = onErrorEnabledPropertyChanged;
function onErrorPropertyChanged(pcData) {
    var til = pcData.object, error = pcData.newValue || '', enabled = til.errorEnabled;
    if (til.android && til.childLoaded) {
        til.android.setError(error);
        if (!enabled && error.length > 0) {
            til.errorEnabled = true;
        }
    }
}
textInputLayout_common_1.TextInputLayout.errorProperty.metadata.onSetNativeValue = onErrorPropertyChanged;
function onCounterEnabledPropertyChanged(pcData) {
    var til = pcData.object, enabled = !!pcData.newValue;
    if (til.android) {
        til.android.setCounterEnabled(enabled);
    }
}
textInputLayout_common_1.TextInputLayout.counterEnabledProperty.metadata.onSetNativeValue = onCounterEnabledPropertyChanged;
function getStyleResourceId(context, name) {
    return context.getResources().getIdentifier(name, 'style', context.getPackageName());
}
var TextInputLayout = (function (_super) {
    __extends(TextInputLayout, _super);
    function TextInputLayout() {
        return _super.call(this) || this;
    }
    Object.defineProperty(TextInputLayout.prototype, "childLoaded", {
        get: function () { return this._childLoaded; },
        set: function (val) { this._childLoaded = val; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "android", {
        get: function () { return this._android; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "_nativeView", {
        get: function () { return this._android; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "textField", {
        get: function () { return this._textField; },
        set: function (tf) {
            var old = this._textField;
            if (this._textField) {
                this._removeView(this._textField);
            }
            this._textField = tf;
            if (this._textField) {
                this._addView(tf);
            }
            this._onTextFieldChanged(old, tf);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "_childrenCount", {
        get: function () {
            if (this._textField) {
                return 1;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "counterEnabled", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.counterEnabledProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.counterEnabledProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "errorEnabled", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.errorEnabledProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.errorEnabledProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "hintAnimationEnabled", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.hintAnimationEnabledProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.hintAnimationEnabledProperty, value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextInputLayout.prototype, "hintTextAppearance", {
        get: function () { return this._getValue(textInputLayout_common_1.TextInputLayout.hintTextAppearanceProperty); },
        set: function (value) { this._setValue(textInputLayout_common_1.TextInputLayout.hintTextAppearanceProperty, value); },
        enumerable: true,
        configurable: true
    });
    TextInputLayout.prototype._createUI = function () {
        this._android = new android.support.design.widget.TextInputLayout(this._context);
    };
    TextInputLayout.prototype._addChildFromBuilder = function (name, child) {
        if (!(child instanceof text_view_1.TextView || child instanceof text_field_1.TextField)) {
            throw new Error('TextInputLayout may only have a <TextView> or <TextField> as a child');
        }
        this.textField = child;
    };
    TextInputLayout.prototype._eachChildView = function (callback) {
        if (this._textField) {
            callback(this._textField);
        }
    };
    TextInputLayout.prototype._onTextFieldChanged = function (oldChild, newChild) {
        this.childLoaded = false;
        function onChildLoaded() {
            if (!this.android) {
                this._createUI();
            }
            var layoutParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT), existingEditText = this.android.getEditText();
            if (existingEditText) {
                if (existingEditText !== this.textField.android) {
                    this.android.removeView(this.android.getEditText());
                    this.android.addView(this.textField.android, 0, layoutParams);
                }
            }
            else {
                this.android.addView(this.textField.android, 0, layoutParams);
            }
            this.childLoaded = true;
            this.android.setErrorEnabled(this.errorEnabled);
            this.android.setError(this.error);
            this.textField.off(view_1.View.loadedEvent, onChildLoaded);
            this.textField.on(view_1.View.unloadedEvent, onChildUnloaded, this);
            var txtValue = this.textField.android.getText();
            this.textField.android.setText('');
            this.textField.android.setText(txtValue);
            this.android.drawableStateChanged();
        }
        function onChildUnloaded() {
            this.childLoaded = false;
            this.textField.off(view_1.View.unloadedEvent, onChildUnloaded);
            this.textField.on(view_1.View.loadedEvent, onChildLoaded, this);
        }
        if (this.textField) {
            this.textField.on(view_1.View.loadedEvent, onChildLoaded, this);
        }
    };
    return TextInputLayout;
}(textInputLayout_common_1.TextInputLayout));
exports.TextInputLayout = TextInputLayout;
