declare var ios: any;
declare var SkyFloatingLabelTextField: any;
declare var SkyFloatingLabelTextFieldWithIcon: any;

import {PropertyChangeData} from 'ui/core/dependency-observable';
import {PropertyMetadata} from 'ui/core/proxy';
import {TextInputLayout as CommonTextInputLayout} from './textInputLayout.common';
import {TextField} from 'ui/text-field';
import {Color} from 'color';

/* callbacks to update native widget wehn exposed properties cange */
function onErrorPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios) {
        til.ios.errorMessage = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.errorProperty.metadata).onSetNativeValue = onErrorPropertyChanged;

function onHintPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios) {
        til.ios.placeholder = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.hintProperty.metadata).onSetNativeValue = onHintPropertyChanged;

function onTitlePropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios) {
        til.ios.title = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.titleProperty.metadata).onSetNativeValue = onTitlePropertyChanged;

function onSelectedTitleColorPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && Color.isValid(pcData.newValue)) {
        til.ios.selectedTitleColor = new Color(pcData.newValue).ios;
    }
}
(<PropertyMetadata>CommonTextInputLayout.selectedTitleColorProperty.metadata).onSetNativeValue = onSelectedTitleColorPropertyChanged;

function onTintColorPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && Color.isValid(pcData.newValue)) {
        til.ios.tintColor = new Color(pcData.newValue).ios;
    }
}
(<PropertyMetadata>CommonTextInputLayout.tintColorProperty.metadata).onSetNativeValue = onTintColorPropertyChanged;

function onLineColorPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && Color.isValid(pcData.newValue)) {
        til.ios.lineColor = new Color(pcData.newValue).ios;
    }
}
(<PropertyMetadata>CommonTextInputLayout.lineColorProperty.metadata).onSetNativeValue = onLineColorPropertyChanged;

function onSelectedLineColorPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && Color.isValid(pcData.newValue)) {
        til.ios.selectedLineColor = new Color(pcData.newValue).ios;
    }
}
(<PropertyMetadata>CommonTextInputLayout.selectedLineColorProperty.metadata).onSetNativeValue = onSelectedLineColorPropertyChanged;

function onLineHeightPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.lineHeight = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.lineHeightProperty.metadata).onSetNativeValue = onLineHeightPropertyChanged;

function onSelectedLineHeightPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.selectedLineHeight = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.selectedLineHeightProperty.metadata).onSetNativeValue = onSelectedLineHeightPropertyChanged;

function onErrorColorPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && Color.isValid(pcData.newValue)) {
        til.ios.errorColor = new Color(pcData.newValue).ios;
    }
}
(<PropertyMetadata>CommonTextInputLayout.errorColorProperty.metadata).onSetNativeValue = onErrorColorPropertyChanged;

function onIconColorPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && Color.isValid(pcData.newValue)) {
        til.ios.iconColor = new Color(pcData.newValue).ios;
    }
}
(<PropertyMetadata>CommonTextInputLayout.iconColorProperty.metadata).onSetNativeValue = onIconColorPropertyChanged;

function onSelectedIconColorPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && Color.isValid(pcData.newValue)) {
        til.ios.selectedIconColor = new Color(pcData.newValue).ios;
    }
}
(<PropertyMetadata>CommonTextInputLayout.selectedIconColorProperty.metadata).onSetNativeValue = onSelectedIconColorPropertyChanged;

function onIconFontPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios) {
        til.ios.iconFont = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.iconFontProperty.metadata).onSetNativeValue = onIconFontPropertyChanged;

function onIconTextPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios) {
        til.ios.iconText = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.iconTextProperty.metadata).onSetNativeValue = onIconTextPropertyChanged;

function onIconMarginBottomPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.iconMarginBottom = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.iconMarginBottomProperty.metadata).onSetNativeValue = onIconMarginBottomPropertyChanged;

function onIconMarginLeftPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.iconMarginLeft = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.iconMarginLeftProperty.metadata).onSetNativeValue = onIconMarginLeftPropertyChanged;

function onIconRotationDegreesPropertyChanged(pcData: PropertyChangeData) {
    let til = <TextInputLayout>pcData.object;
    if (til.ios && !isNaN(pcData.newValue)) {
        til.ios.iconRotationDegrees = pcData.newValue;
    }
}
(<PropertyMetadata>CommonTextInputLayout.iconRotationDegreesProperty.metadata).onSetNativeValue = onIconRotationDegreesPropertyChanged;

export class TextInputLayout extends TextField implements CommonTextInputLayout {
    _ios: any;
    _childLoaded: boolean;

    get ios() {return this._ios;}
    get _nativeView() {return this._ios;}

    get hint() { return this._getValue(CommonTextInputLayout.hintProperty); }
    set hint(value) { this._setValue(CommonTextInputLayout.hintProperty, value + ''); }

    get error() { return this._getValue(CommonTextInputLayout.errorProperty) }
    set error(val) { this._setValue(CommonTextInputLayout.errorProperty, val + ''); }

    get title() { return this._getValue(CommonTextInputLayout.titleProperty); }
    set title(value) { this._setValue(CommonTextInputLayout.titleProperty, value+''); }
    
    get selectedTitleColor() { return this._getValue(CommonTextInputLayout.selectedTitleColorProperty); }
    set selectedTitleColor(value) { this._setValue(CommonTextInputLayout.selectedTitleColorProperty, value); }

    get tintColor() { return this._getValue(CommonTextInputLayout.tintColorProperty); }
    set tintColor(value) { this._setValue(CommonTextInputLayout.tintColorProperty, value); }

    get lineColor() { return this._getValue(CommonTextInputLayout.lineColorProperty); }
    set lineColor(value) { this._setValue(CommonTextInputLayout.lineColorProperty, value); }

    get selectedLineColor() { return this._getValue(CommonTextInputLayout.selectedLineColorProperty); }
    set selectedLineColor(value) { this._setValue(CommonTextInputLayout.selectedLineColorProperty, value); }

    get lineHeight() { return this._getValue(CommonTextInputLayout.lineHeightProperty); }
    set lineHeight(value) { this._setValue(CommonTextInputLayout.lineHeightProperty, value); }

    get selectedLineHeight() { return this._getValue(CommonTextInputLayout.selectedLineHeightProperty); }
    set selectedLineHeight(value) { this._setValue(CommonTextInputLayout.selectedLineHeightProperty, value); }

    get errorColor() { return this._getValue(CommonTextInputLayout.errorColorProperty); }
    set errorColor(value) { this._setValue(CommonTextInputLayout.errorColorProperty, value); }

    get iconText() { return this._getValue(CommonTextInputLayout.iconTextProperty); }
    set iconText(value) { this._setValue(CommonTextInputLayout.iconTextProperty, value+''); }
    
    get iconFont() { return this._getValue(CommonTextInputLayout.iconFontProperty); }
    set iconFont(value) { 
        if (value instanceof UIFont) { 
            this._setValue(CommonTextInputLayout.iconFontProperty, value);
        } else {
            console.warn('TIL:iconFont can only be set to an instance of UIFont');
        }
    }
    
    get iconColor() { return this._getValue(CommonTextInputLayout.iconColorProperty); }
    set iconColor(value) { this._setValue(CommonTextInputLayout.iconColorProperty, value); }

    get selectedIconColor() { return this._getValue(CommonTextInputLayout.selectedIconColorProperty); }
    set selectedIconColor(value) { this._setValue(CommonTextInputLayout.selectedIconColorProperty, value); }

    get iconMarginBottom() { return this._getValue(CommonTextInputLayout.iconMarginBottomProperty); }
    set iconMarginBottom(value) { this._setValue(CommonTextInputLayout.iconMarginBottomProperty, value); }

    get iconMarginLeft() { return this._getValue(CommonTextInputLayout.iconMarginLeftProperty); }
    set iconMarginLeft(value) { this._setValue(CommonTextInputLayout.iconMarginLeftProperty, value); }
    
    get iconRotationDegrees() { return this._getValue(CommonTextInputLayout.iconRotationDegreesProperty); }
    set iconRotationDegrees(value) { this._setValue(CommonTextInputLayout.iconRotationDegreesProperty, value); }

    constructor() {
        super();

        global.TILS = global.TILS || [];
        global.TILS.push(this);

        // TextField delegate will take care of rending to the appropriate size, just pass in zeros here
        this._ios = new SkyFloatingLabelTextField(CGRectMake(0, 0, 0, 0));
    }
}

export class TextInputLayoutWithIcon extends TextInputLayout {
    constructor() {
        super();

        // TextField delegate will take care of rending to the appropriate size, just pass in zeros here
        this._ios = new SkyFloatingLabelTextFieldWithIcon(CGRectMake(0,0,0,0));
    }
}
