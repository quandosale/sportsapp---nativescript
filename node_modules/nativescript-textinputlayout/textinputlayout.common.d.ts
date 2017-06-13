import definition = require('textInputLayout');
import { View } from "ui/core/view";
import { Property } from "ui/core/dependency-observable";
export declare class TextInputLayout extends View implements definition.TextInputLayout {
    static errorProperty: Property;
    static hintProperty: Property;
    static counterEnabledProperty: Property;
    static hintAnimationEnabledProperty: Property;
    static hintTextAppearanceProperty: Property;
    static errorEnabledProperty: Property;
    static titleProperty: Property;
    static selectedTitleColorProperty: Property;
    static tintColorProperty: Property;
    static lineColorProperty: Property;
    static selectedLineColorProperty: Property;
    static lineHeightProperty: Property;
    static selectedLineHeightProperty: Property;
    static errorColorProperty: Property;
    static iconColorProperty: Property;
    static selectedIconColorProperty: Property;
    static iconFontProperty: Property;
    static iconTextProperty: Property;
    static iconMarginBottomProperty: Property;
    static iconMarginLeftProperty: Property;
    static iconRotationDegreesProperty: Property;
    constructor();
    hint: any;
    error: any;
}
