import { TextInputLayout as CommonTextInputLayout } from './textInputLayout.common';
import { View } from "ui/core/view";
import { TextView } from 'ui/text-view';
import { TextField } from 'ui/text-field';
export declare class TextInputLayout extends CommonTextInputLayout {
    _android: any;
    _childLoaded: boolean;
    childLoaded: boolean;
    readonly android: any;
    readonly _nativeView: any;
    private _textField;
    textField: TextField | TextView;
    readonly _childrenCount: number;
    counterEnabled: any;
    errorEnabled: any;
    hintAnimationEnabled: any;
    hintTextAppearance: any;
    constructor();
    _createUI(): void;
    _addChildFromBuilder(name: string, child: TextField | TextView): void;
    _eachChildView(callback: (child: View) => boolean): void;
    _onTextFieldChanged(oldChild: View, newChild: TextView | TextField): void;
}
