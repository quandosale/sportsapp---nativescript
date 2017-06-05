"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require("nativescript-dom");
var app = require('application');
var Platform = require('platform');
var absolute_layout_1 = require('ui/layouts/absolute-layout');
var stack_layout_1 = require('ui/layouts/stack-layout');
var button_1 = require('ui/button');
var label_1 = require('ui/label');
var AnimationModule = require('ui/animation');
var gestures = require('ui/gestures');
var enums_1 = require('ui/enums');
var SLIDE_INDICATOR_INACTIVE = 'slide-indicator-inactive';
var SLIDE_INDICATOR_ACTIVE = 'slide-indicator-active';
var SLIDE_INDICATOR_WRAP = 'slide-indicator-wrap';
var LayoutParams;
if (app.android) {
    LayoutParams = android.view.WindowManager.LayoutParams;
}
else {
    LayoutParams = {};
}
var Slide = (function (_super) {
    __extends(Slide, _super);
    function Slide() {
        _super.apply(this, arguments);
    }
    return Slide;
}(stack_layout_1.StackLayout));
exports.Slide = Slide;
var direction;
(function (direction) {
    direction[direction["none"] = 0] = "none";
    direction[direction["left"] = 1] = "left";
    direction[direction["right"] = 2] = "right";
})(direction || (direction = {}));
var cancellationReason;
(function (cancellationReason) {
    cancellationReason[cancellationReason["user"] = 0] = "user";
    cancellationReason[cancellationReason["noPrevSlides"] = 1] = "noPrevSlides";
    cancellationReason[cancellationReason["noMoreSlides"] = 2] = "noMoreSlides";
})(cancellationReason || (cancellationReason = {}));
var SlideContainer = (function (_super) {
    __extends(SlideContainer, _super);
    function SlideContainer() {
        _super.call(this);
        this.direction = direction.none;
        this.setupDefaultValues();
        this.constructView(true);
    }
    Object.defineProperty(SlideContainer.prototype, "pageIndicators", {
        get: function () {
            return this._pageIndicators;
        },
        set: function (value) {
            this._pageIndicators = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlideContainer.prototype, "pagerOffset", {
        get: function () {
            return this._pagerOffset;
        },
        set: function (value) {
            this._pagerOffset = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlideContainer.prototype, "hasNext", {
        get: function () {
            return !!this.currentPanel && !!this.currentPanel.right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlideContainer.prototype, "hasPrevious", {
        get: function () {
            return !!this.currentPanel && !!this.currentPanel.left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlideContainer.prototype, "loop", {
        get: function () {
            return this._loop;
        },
        set: function (value) {
            this._loop = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlideContainer.prototype, "disablePan", {
        get: function () {
            return this._disablePan;
        },
        set: function (value) {
            this._disablePan = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlideContainer.prototype, "pageWidth", {
        get: function () {
            if (!this.slideWidth) {
                return Platform.screen.mainScreen.widthDIPs;
            }
            return +this.slideWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlideContainer.prototype, "angular", {
        get: function () {
            return this._angular;
        },
        set: function (value) {
            this._angular = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlideContainer.prototype, "currentIndex", {
        get: function () {
            return this.currentPanel.index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlideContainer.prototype, "slideWidth", {
        get: function () {
            return this._slideWidth;
        },
        set: function (width) {
            this._slideWidth = width;
        },
        enumerable: true,
        configurable: true
    });
    SlideContainer.prototype.setupDefaultValues = function () {
        this.clipToBounds = true;
        this._loaded = false;
        if (this._loop == null) {
            this.loop = false;
        }
        this.transitioning = false;
        if (this._disablePan == null) {
            this.disablePan = false;
        }
        if (this._angular == null) {
            this.angular = false;
        }
        if (this._pageIndicators == null) {
            this._pageIndicators = false;
        }
        if (this._pagerOffset == null) {
            this._pagerOffset = '88%';
        }
    };
    SlideContainer.prototype.constructView = function (constructor) {
        var _this = this;
        if (constructor === void 0) { constructor = false; }
        this.on(absolute_layout_1.AbsoluteLayout.loadedEvent, function (data) {
            console.log('LOADDED EVENT');
            if (!_this._loaded) {
                _this._loaded = true;
                if (_this.angular === true && constructor === true) {
                    return;
                }
                var slides_1 = [];
                _this.width = parseInt(_this.slideWidth);
                _this.eachLayoutChild(function (view) {
                    if (view instanceof stack_layout_1.StackLayout) {
                        absolute_layout_1.AbsoluteLayout.setLeft(view, _this.pageWidth);
                        view.width = _this.pageWidth;
                        view.height = '100%';
                        slides_1.push(view);
                    }
                });
                if (_this.pageIndicators) {
                    _this._footer = _this.buildFooter(slides_1.length, 0);
                    _this.setActivePageIndicator(0);
                    _this.insertChild(_this._footer, _this.getChildrenCount());
                }
                _this.currentPanel = _this.buildSlideMap(slides_1);
                if (_this.currentPanel) {
                    _this.positionPanels(_this.currentPanel);
                    if (_this.disablePan === false) {
                        _this.applySwipe(_this.pageWidth);
                    }
                    if (app.ios) {
                        _this.ios.clipsToBound = true;
                    }
                    app.on(app.orientationChangedEvent, function (args) {
                        setTimeout(function () {
                            console.log('orientationChangedEvent');
                            _this.width = parseInt(_this.slideWidth);
                            _this.eachLayoutChild(function (view) {
                                if (view instanceof stack_layout_1.StackLayout) {
                                    absolute_layout_1.AbsoluteLayout.setLeft(view, _this.pageWidth);
                                    view.width = _this.pageWidth;
                                }
                            });
                            if (_this.disablePan === false) {
                                _this.applySwipe(_this.pageWidth);
                            }
                            if (_this.pageIndicators) {
                                absolute_layout_1.AbsoluteLayout.setTop(_this._footer, 0);
                                var pageIndicatorsLeftOffset = _this.pageWidth / 4;
                                absolute_layout_1.AbsoluteLayout.setLeft(_this._footer, pageIndicatorsLeftOffset);
                                _this._footer.width = _this.pageWidth / 2;
                                _this._footer.marginTop = _this._pagerOffset;
                            }
                            _this.positionPanels(_this.currentPanel);
                        }, 0);
                    });
                }
            }
        });
    };
    SlideContainer.prototype.nextSlide = function () {
        var _this = this;
        if (!this.hasNext) {
            this.triggerCancelEvent(cancellationReason.noMoreSlides);
            return;
        }
        this.direction = direction.left;
        this.transitioning = true;
        this.triggerStartEvent();
        this.showRightSlide(this.currentPanel).then(function () {
            _this.setupPanel(_this.currentPanel.right);
            _this.triggerChangeEventRightToLeft();
        });
    };
    SlideContainer.prototype.previousSlide = function () {
        var _this = this;
        if (!this.hasPrevious) {
            this.triggerCancelEvent(cancellationReason.noPrevSlides);
            return;
        }
        this.direction = direction.right;
        this.transitioning = true;
        this.triggerStartEvent();
        this.showLeftSlide(this.currentPanel).then(function () {
            _this.setupPanel(_this.currentPanel.left);
            _this.triggerChangeEventLeftToRight();
        });
    };
    SlideContainer.prototype.setupPanel = function (panel) {
        this.direction = direction.none;
        this.transitioning = false;
        this.currentPanel.panel.off('pan');
        this.currentPanel = panel;
        this.positionPanels(this.currentPanel);
        if (this.disablePan === false) {
            this.applySwipe(this.pageWidth);
        }
        if (this.pageIndicators) {
            this.setActivePageIndicator(this.currentPanel.index);
        }
    };
    SlideContainer.prototype.positionPanels = function (panel) {
        if (panel.left != null) {
            panel.left.panel.translateX = -this.pageWidth * 2;
        }
        panel.panel.translateX = -this.pageWidth;
        if (panel.right != null) {
            panel.right.panel.translateX = 0;
        }
    };
    SlideContainer.prototype.goToSlide = function (index) {
        if (this._slideMap && this._slideMap.length > 0 && index < this._slideMap.length) {
            var previousSlide = this.currentPanel;
            this.setupPanel(this._slideMap[index]);
            this.notify({
                eventName: SlideContainer.changedEvent,
                object: this,
                eventData: {
                    direction: direction.none,
                    newIndex: this.currentPanel.index,
                    oldIndex: previousSlide.index,
                }
            });
        }
        else {
            console.log('invalid index');
        }
    };
    SlideContainer.prototype.applySwipe = function (pageWidth) {
        var _this = this;
        var previousDelta = -1;
        var endingVelocity = 0;
        var startTime, deltaTime;
        this.currentPanel.panel.on('pan', function (args) {
            if (args.state === gestures.GestureStateTypes.began) {
                startTime = Date.now();
                previousDelta = 0;
                endingVelocity = 250;
                _this.triggerStartEvent();
            }
            else if (args.state === gestures.GestureStateTypes.ended) {
                deltaTime = Date.now() - startTime;
                if (args.deltaX > (pageWidth / 3)) {
                    if (_this.hasPrevious) {
                        _this.transitioning = true;
                        _this.showLeftSlide(_this.currentPanel, args.deltaX, endingVelocity).then(function () {
                            _this.setupPanel(_this.currentPanel.left);
                            _this.triggerChangeEventLeftToRight();
                        });
                    }
                    else {
                        _this.triggerCancelEvent(cancellationReason.noPrevSlides);
                    }
                    return;
                }
                else if (args.deltaX < (-pageWidth / 3)) {
                    if (_this.hasNext) {
                        _this.transitioning = true;
                        _this.showRightSlide(_this.currentPanel, args.deltaX, endingVelocity).then(function () {
                            _this.setupPanel(_this.currentPanel.right);
                            _this.triggerChangeEventRightToLeft();
                            if (!_this.hasNext) {
                                _this.notify({
                                    eventName: SlideContainer.finishedEvent,
                                    object: _this
                                });
                            }
                        });
                    }
                    else {
                        _this.triggerCancelEvent(cancellationReason.noMoreSlides);
                    }
                    return;
                }
                if (_this.transitioning === false) {
                    _this.triggerCancelEvent(cancellationReason.user);
                    _this.transitioning = true;
                    _this.currentPanel.panel.animate({
                        translate: { x: -_this.pageWidth, y: 0 },
                        duration: 200,
                        curve: enums_1.AnimationCurve.easeOut
                    });
                    if (_this.hasNext) {
                        _this.currentPanel.right.panel.animate({
                            translate: { x: 0, y: 0 },
                            duration: 200,
                            curve: enums_1.AnimationCurve.easeOut
                        });
                        if (app.ios)
                            _this.currentPanel.right.panel.translateX = 0;
                    }
                    if (_this.hasPrevious) {
                        _this.currentPanel.left.panel.animate({
                            translate: { x: -_this.pageWidth * 2, y: 0 },
                            duration: 200,
                            curve: enums_1.AnimationCurve.easeOut
                        });
                        if (app.ios)
                            _this.currentPanel.left.panel.translateX = -_this.pageWidth;
                    }
                    if (app.ios)
                        _this.currentPanel.panel.translateX = -_this.pageWidth;
                    _this.transitioning = false;
                }
            }
            else {
                if (!_this.transitioning
                    && previousDelta !== args.deltaX
                    && args.deltaX != null
                    && args.deltaX < 0) {
                    if (_this.hasNext) {
                        _this.direction = direction.left;
                        _this.currentPanel.panel.translateX = args.deltaX - _this.pageWidth;
                        _this.currentPanel.right.panel.translateX = args.deltaX;
                    }
                }
                else if (!_this.transitioning
                    && previousDelta !== args.deltaX
                    && args.deltaX != null
                    && args.deltaX > 0) {
                    if (_this.hasPrevious) {
                        _this.direction = direction.right;
                        _this.currentPanel.panel.translateX = args.deltaX - _this.pageWidth;
                        _this.currentPanel.left.panel.translateX = -(_this.pageWidth * 2) + args.deltaX;
                    }
                }
                if (args.deltaX !== 0) {
                    previousDelta = args.deltaX;
                }
            }
        });
    };
    SlideContainer.prototype.showRightSlide = function (panelMap, offset, endingVelocity) {
        if (offset === void 0) { offset = this.pageWidth; }
        if (endingVelocity === void 0) { endingVelocity = 32; }
        var animationDuration;
        animationDuration = 300;
        var transition = new Array();
        transition.push({
            target: panelMap.right.panel,
            translate: { x: -this.pageWidth, y: 0 },
            duration: animationDuration,
            curve: enums_1.AnimationCurve.easeOut
        });
        transition.push({
            target: panelMap.panel,
            translate: { x: -this.pageWidth * 2, y: 0 },
            duration: animationDuration,
            curve: enums_1.AnimationCurve.easeOut
        });
        var animationSet = new AnimationModule.Animation(transition, false);
        return animationSet.play();
    };
    SlideContainer.prototype.showLeftSlide = function (panelMap, offset, endingVelocity) {
        if (offset === void 0) { offset = this.pageWidth; }
        if (endingVelocity === void 0) { endingVelocity = 32; }
        var animationDuration;
        animationDuration = 300;
        var transition = new Array();
        transition.push({
            target: panelMap.left.panel,
            translate: { x: -this.pageWidth, y: 0 },
            duration: animationDuration,
            curve: enums_1.AnimationCurve.easeOut
        });
        transition.push({
            target: panelMap.panel,
            translate: { x: 0, y: 0 },
            duration: animationDuration,
            curve: enums_1.AnimationCurve.easeOut
        });
        var animationSet = new AnimationModule.Animation(transition, false);
        return animationSet.play();
    };
    SlideContainer.prototype.buildFooter = function (pageCount, activeIndex) {
        if (pageCount === void 0) { pageCount = 5; }
        if (activeIndex === void 0) { activeIndex = 0; }
        var footerInnerWrap = new stack_layout_1.StackLayout();
        footerInnerWrap.clipToBounds = false;
        footerInnerWrap.className = SLIDE_INDICATOR_WRAP;
        absolute_layout_1.AbsoluteLayout.setTop(footerInnerWrap, 0);
        footerInnerWrap.orientation = 'horizontal';
        footerInnerWrap.horizontalAlignment = 'center';
        footerInnerWrap.width = this.pageWidth / 2;
        var index = 0;
        while (index < pageCount) {
            footerInnerWrap.addChild(this.createIndicator(index));
            index++;
        }
        var pageIndicatorsLeftOffset = this.pageWidth / 4;
        absolute_layout_1.AbsoluteLayout.setLeft(footerInnerWrap, pageIndicatorsLeftOffset);
        footerInnerWrap.marginTop = this._pagerOffset;
        return footerInnerWrap;
    };
    SlideContainer.prototype.setwidthPercent = function (view, percentage) {
        view.width = percentage + '%';
    };
    SlideContainer.prototype.newFooterButton = function (name) {
        var button = new button_1.Button();
        button.id = 'btn-info-' + name.toLowerCase();
        button.text = name;
        this.setwidthPercent(button, 100);
        return button;
    };
    SlideContainer.prototype.buildSlideMap = function (views) {
        var _this = this;
        this._slideMap = [];
        views.forEach(function (view, index) {
            _this._slideMap.push({
                panel: view,
                index: index,
            });
        });
        this._slideMap.forEach(function (mapping, index) {
            if (_this._slideMap[index - 1] != null)
                mapping.left = _this._slideMap[index - 1];
            if (_this._slideMap[index + 1] != null)
                mapping.right = _this._slideMap[index + 1];
        });
        if (this.loop) {
            this._slideMap[0].left = this._slideMap[this._slideMap.length - 1];
            this._slideMap[this._slideMap.length - 1].right = this._slideMap[0];
        }
        return this._slideMap[0];
    };
    SlideContainer.prototype.triggerStartEvent = function () {
        this.notify({
            eventName: SlideContainer.startEvent,
            object: this,
            eventData: {
                currentIndex: this.currentPanel.index
            }
        });
    };
    SlideContainer.prototype.triggerChangeEventLeftToRight = function () {
        this.notify({
            eventName: SlideContainer.changedEvent,
            object: this,
            eventData: {
                direction: direction.left,
                newIndex: this.currentPanel.index,
                oldIndex: this.currentPanel.index + 1
            }
        });
    };
    SlideContainer.prototype.triggerChangeEventRightToLeft = function () {
        this.notify({
            eventName: SlideContainer.changedEvent,
            object: this,
            eventData: {
                direction: direction.right,
                newIndex: this.currentPanel.index,
                oldIndex: this.currentPanel.index - 1
            }
        });
    };
    SlideContainer.prototype.triggerCancelEvent = function (cancelReason) {
        this.notify({
            eventName: SlideContainer.cancelledEvent,
            object: this,
            eventData: {
                currentIndex: this.currentPanel.index,
                reason: cancelReason
            }
        });
    };
    SlideContainer.prototype.createIndicator = function (index) {
        var indicator = new label_1.Label();
        indicator.classList.add(SLIDE_INDICATOR_INACTIVE);
        return indicator;
    };
    SlideContainer.prototype.setActivePageIndicator = function (index) {
        var indicatorsToDeactivate = this._footer.getElementsByClassName(SLIDE_INDICATOR_ACTIVE);
        indicatorsToDeactivate.forEach(function (activeIndicator) {
            activeIndicator.classList.remove(SLIDE_INDICATOR_ACTIVE);
            activeIndicator.classList.add(SLIDE_INDICATOR_INACTIVE);
        });
        var activeIndicator = this._footer.getElementsByClassName(SLIDE_INDICATOR_INACTIVE)[index];
        if (activeIndicator) {
            activeIndicator.classList.remove(SLIDE_INDICATOR_INACTIVE);
            activeIndicator.classList.add(SLIDE_INDICATOR_ACTIVE);
        }
    };
    SlideContainer.prototype.iosProperty = function (theClass, theProperty) {
        if (typeof theProperty === "function") {
            return theProperty.call(theClass);
        }
        else {
            return theProperty;
        }
    };
    SlideContainer.startEvent = 'start';
    SlideContainer.changedEvent = 'changed';
    SlideContainer.cancelledEvent = 'cancelled';
    SlideContainer.finishedEvent = 'finished';
    return SlideContainer;
}(absolute_layout_1.AbsoluteLayout));
exports.SlideContainer = SlideContainer;
//# sourceMappingURL=nativescript-slides.js.map