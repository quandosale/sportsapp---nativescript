var color_1 = require("color");
var common = require("./drawingpad-common");

function onPenWidthPropertyChanged(data) {
    var dPad = data.object;
    if (!dPad.android) {
        return;
    }
    dPad.android.setPts(data.newValue);
}

function onPenColorPropertyChanged(data) {
    var dPad = data.object;
    if (!dPad.android) {
        return;
    }
    dPad.android.setPenColor(new color_1.Color(data.newValue).android);
}

function onPointsPropertyChanged(data) {
    var dPad = data.object;
    if (!dPad.android) {
        return;
    }
    // dPad.android.setPenColor(new color_1.Color(data.newValue).android);
}
common.DrawingPad.penWidthProperty.metadata.onSetNativeValue = onPenWidthPropertyChanged;
common.DrawingPad.penColorProperty.metadata.onSetNativeValue = onPenColorPropertyChanged;
common.DrawingPad.pointsProperty.metadata.onSetNativeValue = onPointsPropertyChanged;
global.moduleMerge(common, exports);
var SignaturePad = com.github.gcacace.signaturepad.views.SignaturePad;
var DrawingPad = (function (_super) {
    __extends(DrawingPad, _super);

    function DrawingPad() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(DrawingPad.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DrawingPad.prototype, "_nativeView", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    DrawingPad.prototype._createUI = function () {
        this._android = new SignaturePad(this._context, null);
        if (this.penColor) {
            this._android.setPenColor(new color_1.Color(this.penColor).android);
        }
        if (this.penWidth) {
            this._android.setMinWidth(this.penWidth);
        }
    };
    DrawingPad.prototype.getDrawing = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!_this._android.isEmpty()) {
                    var data = _this._android.getSignatureBitmap();
                    resolve(data);
                } else {
                    reject("DrawingPad is empty.");
                }
            } catch (err) {
                reject(err);
            }
        });
    };
    DrawingPad.prototype.getTransparentDrawing = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!_this._android.isEmpty()) {
                    var data = _this._android.getTransparentSignatureBitmap();
                    resolve(data);
                } else {
                    reject("DrawingPad is empty.");
                }
            } catch (err) {
                reject(err);
            }
        });
    };
    DrawingPad.prototype.getDrawingSvg = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!_this._android.isEmpty()) {
                    var data = _this._android.getSignatureSvg();
                    resolve(data);
                } else {
                    reject("DrawingPad is empty.");
                }
            } catch (err) {
                reject(err);
            }
        });
    };
    DrawingPad.prototype.clearDrawing = function () {
        try {
            console.log('clear drawing');
            if (this._android)
                this._android.clear();
        } catch (err) {
            console.log('Error in clearDrawing: ' + err);
        }
    };
    DrawingPad.prototype.setPts = function (arr) {
        try {
            if (this.android)
                this.android.setPts(arr);
        } catch (err) {
            console.log('Error in setPts: ' + err);
        }
    };
    DrawingPad.prototype.setHrtMark = function (index, str) {
        try {
            console.log('setHrtMark function');
            if (this.android)
                this.android.setHrtMark(index, str);
        } catch (err) {
            console.log('Error in setHrtMark: ' + err);
        }
    };

    DrawingPad.prototype.addPoint = function (point) {
        try {
            if (this.android)
                this.android.addPoint(point);
        } catch (err) {
            console.log('Error in addPoint: ' + err);
        }
    };
    DrawingPad.prototype.update = function (point) {
        try {
            // console.log('update function');
            if (this.android)
                this.android.update();
        } catch (err) {
            console.log('Error in update: ' + err);
        }
    };



    return DrawingPad;
}(common.DrawingPad));
exports.DrawingPad = DrawingPad;