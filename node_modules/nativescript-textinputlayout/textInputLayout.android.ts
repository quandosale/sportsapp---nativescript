declare var android: any;

import {PropertyChangeData} from "ui/core/dependency-observable";
import {PropertyMetadata} from "ui/core/proxy";
import {TextInputLayout as CommonTextInputLayout} from './textInputLayout.common';
import {View} from "ui/core/view";
import {TextView} from 'ui/text-view';
import {TextField} from 'ui/text-field';


/* callbacks to update native widget when exposed properties change */

// hintProperty
function onHintPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.android) {
        til.android.setHint(pcData.newValue);
    }
}
(<PropertyMetadata>CommonTextInputLayout.hintProperty.metadata).onSetNativeValue = onHintPropertyChanged;

// hintAnimationEnabledProperty
function onHintAnimationEnabledPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object,
        enabled: boolean = !!pcData.newValue;
    if (til.android) {
        til.android.setHintAnimationEnabled(enabled);
    }
}
(<PropertyMetadata>CommonTextInputLayout.hintAnimationEnabledProperty.metadata).onSetNativeValue = onHintAnimationEnabledPropertyChanged;

// hintAppearanceProperty
function onHintAppearancePropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;

    if(til.hintTextAppearance) {
        let resId = getStyleResourceId(til._context, til.hintTextAppearance);
        if (resId) {
            til.android.setHintTextAppearance(resId);
        }
    }
}
(<PropertyMetadata>CommonTextInputLayout.hintTextAppearanceProperty.metadata).onSetNativeValue = onHintAppearancePropertyChanged;

// errorEnabledProperty
function onErrorEnabledPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object,
        enabled: boolean = !!pcData.newValue;
    if (til.android) {
        if (!enabled && (til.error || '').length > 0) {
            til.error = '';
        }

        til.android.setErrorEnabled(enabled);
    }
}
(<PropertyMetadata>CommonTextInputLayout.errorEnabledProperty.metadata).onSetNativeValue = onErrorEnabledPropertyChanged;

// errorProperty
// NOTE: Android natively sets errorEnabled to true if this is not null
function onErrorPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object,
        error: string = pcData.newValue || '',
        enabled: boolean = til.errorEnabled;
    if (til.android && til.childLoaded) {
        til.android.setError(error);
        if (!enabled && error.length > 0) {
            til.errorEnabled = true;
        }
    }
}
(<PropertyMetadata>CommonTextInputLayout.errorProperty.metadata).onSetNativeValue = onErrorPropertyChanged;

// counterEnabledProperty
function onCounterEnabledPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object,
        enabled: boolean = !!pcData.newValue;
    if (til.android) {
        til.android.setCounterEnabled(enabled);
    }
}

(<PropertyMetadata>CommonTextInputLayout.counterEnabledProperty.metadata).onSetNativeValue = onCounterEnabledPropertyChanged;


function getStyleResourceId(context: any, name: string) {
    return context.getResources().getIdentifier(name, 'style', context.getPackageName());
}

export class TextInputLayout extends CommonTextInputLayout {
    _android: any;
    _childLoaded: boolean;

    get childLoaded() { return this._childLoaded; }
    set childLoaded(val: boolean) { this._childLoaded = val; }

    get android() { return this._android; }
    get _nativeView() { return this._android; }

    private _textField: TextField | TextView;

    get textField(): TextField | TextView { return this._textField; }
    set textField(tf: TextField | TextView) {
        let old: View = this._textField;
        if (this._textField) {
            this._removeView(this._textField);
        }

        this._textField = tf;

        if (this._textField) {
            this._addView(tf);
        }

        this._onTextFieldChanged(old, tf);
    }

    get _childrenCount(): number {
        if (this._textField) {
            return 1;
        }

        return 0;
    }

    get counterEnabled() { return this._getValue(CommonTextInputLayout.counterEnabledProperty); }
    set counterEnabled(value) { this._setValue(CommonTextInputLayout.counterEnabledProperty, value); }

    get errorEnabled() { return this._getValue(CommonTextInputLayout.errorEnabledProperty); }
    set errorEnabled(value) { this._setValue(CommonTextInputLayout.errorEnabledProperty, value); }


    get hintAnimationEnabled() { return this._getValue(CommonTextInputLayout.hintAnimationEnabledProperty); }
    set hintAnimationEnabled(value) { this._setValue(CommonTextInputLayout.hintAnimationEnabledProperty, value); }

    get hintTextAppearance() { return this._getValue(CommonTextInputLayout.hintTextAppearanceProperty); }
    set hintTextAppearance(value) { this._setValue(CommonTextInputLayout.hintTextAppearanceProperty, value); }

    constructor() {
        super();
    }

    _createUI() {
        this._android = new android.support.design.widget.TextInputLayout(this._context);
    }

    /**
     * Callback that gets called when a child element is added.
     * The TextInputLayout can only accept TextView or TextField, so do appropriate checking here.
     */
    public _addChildFromBuilder(name: string, child: TextField | TextView): void {
        if (!(child instanceof TextView || child instanceof TextField)) {
            throw new Error('TextInputLayout may only have a <TextView> or <TextField> as a child');
        }

        this.textField = child;
    }

    public _eachChildView(callback: (child: View) => boolean) {
        if (this._textField) {
            callback(this._textField);
        }
    }

    /**
     * Callback that gets called when a child element is added.
     * The TextInputLayout can only accept TextView or TextField, so do appropriate checking here.
     */
    _onTextFieldChanged(oldChild: View, newChild: TextView | TextField): void {

        this.childLoaded = false;

        //some properties cannot be added until after the child text element has loaded
        function onChildLoaded() {
            // let layoutParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, android.widget.LinearLayout.LayoutParams.MATCH_PARENT, 0);
            
            //Need this for when navigating back to a historical view
            if (!this.android) { this._createUI(); }

            let layoutParams = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT),
                existingEditText = this.android.getEditText();

            if (existingEditText) {
                if (existingEditText !== this.textField.android) {
                    this.android.removeView(this.android.getEditText())
                    this.android.addView(this.textField.android, 0, layoutParams);
                }
            } else {
                this.android.addView(this.textField.android, 0, layoutParams);
            }

            this.childLoaded = true;

            this.android.setErrorEnabled(this.errorEnabled);
            this.android.setError(this.error);
            this.textField.off(View.loadedEvent, onChildLoaded);
            this.textField.on(View.unloadedEvent, onChildUnloaded, this);

            // sometimes hint text isn't immediately triggered to move when navigating back to a prior view.
            // this triggers it via brute force :(
            let txtValue = this.textField.android.getText();

            this.textField.android.setText('');
            this.textField.android.setText(txtValue);
            this.android.drawableStateChanged();
        }

        function onChildUnloaded() {
            this.childLoaded = false;
            this.textField.off(View.unloadedEvent, onChildUnloaded);
            this.textField.on(View.loadedEvent, onChildLoaded, this);
        }

        if (this.textField) {
            this.textField.on(View.loadedEvent, onChildLoaded, this);
        }
    }
}
