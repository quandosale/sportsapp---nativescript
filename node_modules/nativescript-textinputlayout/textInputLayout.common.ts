import definition = require('textInputLayout');
import {View} from "ui/core/view";
import {Property, PropertyMetadataSettings} from "ui/core/dependency-observable";
import {PropertyMetadata} from "ui/core/proxy";
import {TextView} from 'ui/text-view';
import {TextField} from 'ui/text-field';

const TIL = 'TextInputLayout';

const errorProperty: Property = new Property(
    "error",
    TIL,
    new PropertyMetadata('', PropertyMetadataSettings.AffectsLayout)
);

// NOTE: This is 'placeholder' for ios
const hintProperty: Property = new Property(
    "hint",
    TIL,
    new PropertyMetadata('', PropertyMetadataSettings.AffectsLayout)
);


/*** android-only properties ***/
const hintAnimationEnabledProperty: Property = new Property(
    "hintAnimationEnabled",
    TIL,
    new PropertyMetadata(true, PropertyMetadataSettings.None)
);
const hintTextAppearanceProperty: Property = new Property(
    "hintTextAppearance",
    TIL,
    new PropertyMetadata(undefined)
);
const counterEnabledProperty: Property = new Property(
    "counterEnabled",
    TIL,
    new PropertyMetadata(false, PropertyMetadataSettings.AffectsLayout)
);
const errorEnabledProperty: Property = new Property(
    "errorEnabled",
    TIL,
    new PropertyMetadata(true, PropertyMetadataSettings.AffectsLayout)
);

/*** ios-only properties ***/

// note: this is the floating label value 
const titleProperty: Property = new Property(
    "title",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
);
const tintColorProperty: Property = new Property(
    "tintColor",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsStyle)
);

const lineColorProperty: Property = new Property(
    "lineColor",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsStyle)
);
const selectedTitleColorProperty: Property = new Property(
    "selectedTitleColor",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsStyle)
);
const selectedLineColorProperty: Property = new Property(
    "selectedLineColor",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsStyle)
);
const lineHeightProperty: Property = new Property(
    "lineHeight",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
);
const selectedLineHeightProperty: Property = new Property(
    "selectedLineHeight",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
);
const errorColorProperty: Property = new Property(
    "errorColor",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsStyle)
);
const iconColorProperty: Property = new Property(
    "iconColor",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsStyle)
);
const selectedIconColorProperty: Property = new Property(
    "selectedIconColor",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsStyle)
);
const iconFontProperty: Property = new Property(
    "iconFont",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
);
const iconTextProperty: Property = new Property(
    "iconText",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
);
const iconMarginBottomProperty: Property = new Property(
    "iconMarginBottom",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
);
const iconMarginLeftProperty: Property = new Property(
    "iconMarginLeft",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
);
const iconRotationDegreesProperty: Property = new Property(
    "iconRotationDegrees",
    TIL,
    new PropertyMetadata(undefined, PropertyMetadataSettings.AffectsLayout)
);



export class TextInputLayout extends View implements definition.TextInputLayout {
    // common
    public static errorProperty: Property = errorProperty;
    public static hintProperty: Property = hintProperty;
    
    //android-only
    public static counterEnabledProperty: Property = counterEnabledProperty;
    public static hintAnimationEnabledProperty: Property = hintAnimationEnabledProperty;
    public static hintTextAppearanceProperty: Property = hintTextAppearanceProperty;
    public static errorEnabledProperty: Property = errorEnabledProperty;

    //ios-only
    public static titleProperty: Property = titleProperty;
    public static selectedTitleColorProperty: Property = selectedTitleColorProperty;
    public static tintColorProperty: Property = tintColorProperty;
    // public static textColorProperty: Property = textColorProperty;
    public static lineColorProperty: Property = lineColorProperty;
    public static selectedLineColorProperty: Property = selectedLineColorProperty;
    public static lineHeightProperty: Property = lineHeightProperty;
    public static selectedLineHeightProperty: Property = selectedLineHeightProperty;
    public static errorColorProperty: Property = errorColorProperty;
    public static iconColorProperty: Property = iconColorProperty;
    public static selectedIconColorProperty: Property = selectedIconColorProperty;
    public static iconFontProperty: Property = iconFontProperty;
    public static iconTextProperty: Property = iconTextProperty;
    public static iconMarginBottomProperty: Property = iconMarginBottomProperty;
    public static iconMarginLeftProperty: Property = iconMarginLeftProperty;
    public static iconRotationDegreesProperty: Property = iconRotationDegreesProperty;

    constructor() {
        super();
    }

    // common
    get hint() { return this._getValue(hintProperty); }
    set hint(value) { this._setValue(hintProperty, value + ''); }

    get error() { return this._getValue(errorProperty) }
    set error(val) { this._setValue(errorProperty, val + ''); }

    /* GETTERS/SETTERS for other property accessors implemented individually in ios/android components as they're so different */
}
