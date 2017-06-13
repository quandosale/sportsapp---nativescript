import { TextInputLayout as CommonTextInputLayout } from './textInputLayout.common';
import { TextField } from 'ui/text-field';
export declare class TextInputLayout extends TextField implements CommonTextInputLayout {
    _ios: any;
    _childLoaded: boolean;
    readonly ios: any;
    readonly _nativeView: any;
    hint: any;
    error: any;
    title: any;
    selectedTitleColor: any;
    tintColor: any;
    lineColor: any;
    selectedLineColor: any;
    lineHeight: any;
    selectedLineHeight: any;
    errorColor: any;
    iconText: any;
    iconFont: any;
    iconColor: any;
    selectedIconColor: any;
    iconMarginBottom: any;
    iconMarginLeft: any;
    iconRotationDegrees: any;
    constructor();
}
export declare class TextInputLayoutWithIcon extends TextInputLayout {
    constructor();
}
