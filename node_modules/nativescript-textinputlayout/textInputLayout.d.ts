/**
 * TextInputLayout Class
 *      Acts as a wrapper around <TextField> or <TextView> components
 *      Implements functionality outline in android's TextInputLayout component
 */

declare module 'textInputLayout' {
    import View = require("ui/core/view");
    import {Property} from "ui/core/dependency-observable";

    export class TextInputLayout extends View.View implements View.AddChildFromBuilder {
        // common
        public static errorProperty: Property;
        public static hintProperty: Property;
        
        // android-only
        public static counterEnabledProperty: Property;
        public static errorEnabledProperty: Property;
        public static hintAnimationEnabledProperty: Property;
        public static hintTextAppearanceProperty: Property;

        // ios-only
        public static titleProperty: Property;
        public static selectedTitleColorProperty: Property;
        public static tintColorProperty: Property;
        // public static textColorProperty: Property;
        public static lineColorProperty: Property;
        public static selectedLineColorProperty: Property;
        public static lineHeightProperty: Property;
        public static selectedLineHeightProperty: Property;
        public static errorColorProperty: Property;
        public static iconColorProperty: Property;
        public static selectedIconColorProperty: Property;
        public static iconFontProperty: Property;
        public static iconTextProperty: Property;
        public static iconMarginBottomProperty: Property;
        public static iconMarginLeftProperty: Property;
        public static iconRotationDegreesProperty: Property;

        /**
         * Native [android TextInputLayout](http://developer.android.com/reference/android/support/design/widget/TextInputLayout.html)
         */
        android ?: any;

        ios ?: any;
    }
}