"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var viewModule = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var proxyModule = require("ui/core/proxy");
var PLACEHOLDERIMAGEURI = "placeholderImageUri";
var IMAGEURI = "imageUri";
var FRESCODRAWEE = "FrescoDrawee";
var ACTUALIMAGESCALETYPE = "actualImageScaleType";
var FADEDURATION = "fadeDuration";
var BACKGROUNDURI = "backgroundUri";
var PROGRESSIVERENDERINGENABLED = "progressiveRenderingEnabled";
var SHOWPROGRESSBAR = "showProgressBar";
var PROGRESSBARCOLOR = "progressBarColor";
var FAILUREIMAGEURI = "failureImageUri";
var ROUNDASCIRCLE = "roundAsCircle";
var ROUNDTOPLEFT = "roundTopLeft";
var ROUNDTOPRIGHT = "roundTopRight";
var ROUNDBOTTOMLEFT = "roundBottomLeft";
var ROUNDBOTTOMRIGHT = "roundBottomRight";
var ROUNDEDCORNERRADIUS = "roundedCornerRadius";
var AUTOPLAYANIMATIONS = "autoPlayAnimations";
var TAPTORETRYENABLED = "tapToRetryEnabled";
var ASPECTRATIO = "aspectRatio";
var ScaleType;
(function (ScaleType) {
    ScaleType.Center = "center";
    ScaleType.CenterCrop = "centerCrop";
    ScaleType.CenterInside = "centerInside";
    ScaleType.FitCenter = "fitCenter";
    ScaleType.FitEnd = "fitEnd";
    ScaleType.FitStart = "fitStart";
    ScaleType.FitXY = "fitXY";
    ScaleType.FocusCrop = "focusCrop";
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
var EventData = (function () {
    function EventData() {
    }
    Object.defineProperty(EventData.prototype, "eventName", {
        get: function () {
            return this._eventName;
        },
        set: function (value) {
            this._eventName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventData.prototype, "object", {
        get: function () {
            return this._object;
        },
        set: function (value) {
            this._object = value;
        },
        enumerable: true,
        configurable: true
    });
    return EventData;
}());
exports.EventData = EventData;
var FrescoDrawee = (function (_super) {
    __extends(FrescoDrawee, _super);
    function FrescoDrawee() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(FrescoDrawee.prototype, "imageUri", {
        get: function () {
            return this._getValue(FrescoDrawee.imageUriProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.imageUriProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "placeholderImageUri", {
        get: function () {
            return this._getValue(FrescoDrawee.placeholderImageUriProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.placeholderImageUriProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "failureImageUri", {
        get: function () {
            return this._getValue(FrescoDrawee.failureImageUriProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.failureImageUriProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "actualImageScaleType", {
        get: function () {
            return this._getValue(FrescoDrawee.actualImageScaleTypeProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.actualImageScaleTypeProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "fadeDuration", {
        get: function () {
            return this._getValue(FrescoDrawee.fadeDurationProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.fadeDurationProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "backgroundUri", {
        get: function () {
            return this._getValue(FrescoDrawee.backgroundUriProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.backgroundUriProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "progressiveRenderingEnabled", {
        get: function () {
            return this._getValue(FrescoDrawee.progressiveRenderingEnabledProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.progressiveRenderingEnabledProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "showProgressBar", {
        get: function () {
            return this._getValue(FrescoDrawee.showProgressBarProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.showProgressBarProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "progressBarColor", {
        get: function () {
            return this._getValue(FrescoDrawee.progressBarColorProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.progressBarColorProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "roundAsCircle", {
        get: function () {
            return this._getValue(FrescoDrawee.roundAsCircleProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.roundAsCircleProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "roundBottomRight", {
        get: function () {
            return this._getValue(FrescoDrawee.roundBottomRightProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.roundBottomRightProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "roundTopLeft", {
        get: function () {
            return this._getValue(FrescoDrawee.roundTopLeftProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.roundTopLeftProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "roundTopRight", {
        get: function () {
            return this._getValue(FrescoDrawee.roundTopRightProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.roundTopRightProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "roundBottomLeft", {
        get: function () {
            return this._getValue(FrescoDrawee.roundBottomLeftroperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.roundBottomLeftroperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "roundedCornerRadius", {
        get: function () {
            return this._getValue(FrescoDrawee.roundedCornerRadiusProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.roundedCornerRadiusProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "autoPlayAnimations", {
        get: function () {
            return this._getValue(FrescoDrawee.autoPlayAnimationsProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.autoPlayAnimationsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "tapToRetryEnabled", {
        get: function () {
            return this._getValue(FrescoDrawee.tapToRetryEnabledProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.tapToRetryEnabledProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrescoDrawee.prototype, "aspectRatio", {
        get: function () {
            return this._getValue(FrescoDrawee.aspectRatioProperty);
        },
        set: function (value) {
            this._setValue(FrescoDrawee.aspectRatioProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    FrescoDrawee.onImageUriPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onImageUriChanged(args);
    };
    FrescoDrawee.onPlaceholderImageUriPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onPlaceholderImageUriChanged(args);
    };
    FrescoDrawee.onFailureImageUriPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onFailureImageUriChanged(args);
    };
    FrescoDrawee.onActualImageScaleTypePropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onActualImageScaleTypeChanged(args);
    };
    FrescoDrawee.onFadeDurationPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onFadeDurationChanged(args);
    };
    FrescoDrawee.onBackgroundUriPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onBackgroundUriChanged(args);
    };
    FrescoDrawee.onProgressiveRenderingEnabledPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onProgressiveRenderingEnabledChanged(args);
    };
    FrescoDrawee.onShowProgressBarPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onShowProgressBarChanged(args);
    };
    FrescoDrawee.onProgressBarColorPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onProgressBarColorChanged(args);
    };
    FrescoDrawee.onRoundAsCirclePropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onRoundAsCircleChanged(args);
    };
    FrescoDrawee.onRoundTopLeftPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onRoundTopLeftChanged(args);
    };
    FrescoDrawee.onRoundTopRightPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onRoundTopRightChanged(args);
    };
    FrescoDrawee.onRoundBottomLeftPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onRoundBottomLeftChanged(args);
    };
    FrescoDrawee.onRoundBottomRightPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onRoundBottomRightChanged(args);
    };
    FrescoDrawee.onRoundedCornerRadiusPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onRoundedCornerRadiusChanged(args);
    };
    FrescoDrawee.onAutoPlayAnimationsPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onAutoPlayAnimationsPChanged(args);
    };
    FrescoDrawee.onTapToRetryEnabledPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onTapToRetryEnabledChanged(args);
    };
    FrescoDrawee.onAspectRatioPropertyChanged = function (args) {
        var drawee = args.object;
        drawee.onAspectRatioChanged(args);
    };
    FrescoDrawee.prototype.onImageUriChanged = function (args) {
    };
    FrescoDrawee.prototype.onPlaceholderImageUriChanged = function (args) {
    };
    FrescoDrawee.prototype.onFailureImageUriChanged = function (args) {
    };
    FrescoDrawee.prototype.onActualImageScaleTypeChanged = function (args) {
    };
    FrescoDrawee.prototype.onFadeDurationChanged = function (args) {
    };
    FrescoDrawee.prototype.onBackgroundUriChanged = function (args) {
    };
    FrescoDrawee.prototype.onProgressiveRenderingEnabledChanged = function (args) {
    };
    FrescoDrawee.prototype.onShowProgressBarChanged = function (args) {
    };
    FrescoDrawee.prototype.onProgressBarColorChanged = function (args) {
    };
    FrescoDrawee.prototype.onRoundAsCircleChanged = function (args) {
    };
    FrescoDrawee.prototype.onRoundTopLeftChanged = function (args) {
    };
    FrescoDrawee.prototype.onRoundTopRightChanged = function (args) {
    };
    FrescoDrawee.prototype.onRoundBottomLeftChanged = function (args) {
    };
    FrescoDrawee.prototype.onRoundBottomRightChanged = function (args) {
    };
    FrescoDrawee.prototype.onRoundedCornerRadiusChanged = function (args) {
    };
    FrescoDrawee.prototype.onAutoPlayAnimationsPChanged = function (args) {
    };
    FrescoDrawee.prototype.onTapToRetryEnabledChanged = function (args) {
    };
    FrescoDrawee.prototype.onAspectRatioChanged = function (args) {
    };
    FrescoDrawee.finalImageSetEvent = "finalImageSet";
    FrescoDrawee.failureEvent = "failure";
    FrescoDrawee.intermediateImageFailedEvent = "intermediateImageFailed";
    FrescoDrawee.intermediateImageSetEvent = "intermediateImageSet";
    FrescoDrawee.releaseEvent = "release";
    FrescoDrawee.submitEvent = "submit";
    FrescoDrawee.imageUriProperty = new dependencyObservable.Property(IMAGEURI, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onImageUriPropertyChanged));
    FrescoDrawee.placeholderImageUriProperty = new dependencyObservable.Property(PLACEHOLDERIMAGEURI, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onPlaceholderImageUriPropertyChanged));
    FrescoDrawee.failureImageUriProperty = new dependencyObservable.Property(FAILUREIMAGEURI, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onFailureImageUriPropertyChanged));
    FrescoDrawee.actualImageScaleTypeProperty = new dependencyObservable.Property(ACTUALIMAGESCALETYPE, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onActualImageScaleTypePropertyChanged));
    FrescoDrawee.fadeDurationProperty = new dependencyObservable.Property(FADEDURATION, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onFadeDurationPropertyChanged));
    FrescoDrawee.backgroundUriProperty = new dependencyObservable.Property(BACKGROUNDURI, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onBackgroundUriPropertyChanged));
    FrescoDrawee.progressiveRenderingEnabledProperty = new dependencyObservable.Property(PROGRESSIVERENDERINGENABLED, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onProgressiveRenderingEnabledPropertyChanged));
    FrescoDrawee.showProgressBarProperty = new dependencyObservable.Property(SHOWPROGRESSBAR, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onShowProgressBarPropertyChanged));
    FrescoDrawee.progressBarColorProperty = new dependencyObservable.Property(PROGRESSBARCOLOR, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onProgressBarColorPropertyChanged));
    FrescoDrawee.roundAsCircleProperty = new dependencyObservable.Property(ROUNDASCIRCLE, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, FrescoDrawee.onRoundAsCirclePropertyChanged));
    FrescoDrawee.roundTopLeftProperty = new dependencyObservable.Property(ROUNDTOPLEFT, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, FrescoDrawee.onRoundTopLeftPropertyChanged));
    FrescoDrawee.roundTopRightProperty = new dependencyObservable.Property(ROUNDTOPRIGHT, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, FrescoDrawee.onRoundTopRightPropertyChanged));
    FrescoDrawee.roundBottomLeftroperty = new dependencyObservable.Property(ROUNDBOTTOMLEFT, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, FrescoDrawee.onRoundBottomLeftPropertyChanged));
    FrescoDrawee.roundBottomRightProperty = new dependencyObservable.Property(ROUNDBOTTOMRIGHT, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, FrescoDrawee.onRoundBottomRightPropertyChanged));
    FrescoDrawee.roundedCornerRadiusProperty = new dependencyObservable.Property(ROUNDEDCORNERRADIUS, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, FrescoDrawee.onRoundedCornerRadiusPropertyChanged));
    FrescoDrawee.autoPlayAnimationsProperty = new dependencyObservable.Property(AUTOPLAYANIMATIONS, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onAutoPlayAnimationsPropertyChanged));
    FrescoDrawee.tapToRetryEnabledProperty = new dependencyObservable.Property(TAPTORETRYENABLED, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.None, FrescoDrawee.onTapToRetryEnabledPropertyChanged));
    FrescoDrawee.aspectRatioProperty = new dependencyObservable.Property(ASPECTRATIO, FRESCODRAWEE, new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, FrescoDrawee.onAspectRatioPropertyChanged));
    return FrescoDrawee;
}(viewModule.View));
exports.FrescoDrawee = FrescoDrawee;
