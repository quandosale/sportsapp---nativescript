var content_view_1 = require("ui/content-view");
var color_1 = require("color");
var DrawingPad = (function (_super) {
    __extends(DrawingPad, _super);
    function DrawingPad() {
        _super.call(this);
        this._ios = SignatureView;
        this._ios = SignatureView.alloc().initWithFrame(CGRectMake(0, 0, 100, 100));
        this._ios.clipsToBounds = true;
    }
    Object.defineProperty(DrawingPad.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DrawingPad.prototype, "_nativeView", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DrawingPad.prototype, "penColor", {
        set: function (value) {
            if (this._ios && value) {
                this._ios.setLineColor(new color_1.Color(value).ios);
            }
            else {
                this._penColor = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DrawingPad.prototype, "penWidth", {
        set: function (value) {
            if (this._ios) {
                if (value && typeof value !== 'undefined' && value !== NaN && value !== 'NaN') {
                    this._ios.setLineWidth(Math.floor(parseInt(value)));
                }
            }
            else {
                this._penWidth = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    DrawingPad.prototype.onLoaded = function () {
        if (this.width) {
            this._ios.frame.size.width = this.width;
        }
        if (this.height) {
            this._ios.frame.size.height = this.height;
        }
        try {
            if (this._penColor) {
                this.penColor = this._penColor;
            }
            if (this._penWidth) {
                this.penWidth = this._penWidth;
            }
        }
        catch (ex) {
            console.log(ex);
        }
    };
    DrawingPad.prototype.getDrawing = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var isSigned = _this._ios.isSigned();
                if (isSigned === true) {
                    var data = _this._ios.signatureImage();
                    resolve(data);
                }
                else {
                    reject("DrawingPad is empty.");
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    DrawingPad.prototype.clearDrawing = function () {
        try {
            if (this.backgroundColor) {
                var color = this.backgroundColor;
                if (color.constructor == color_1.Color) {
                    color = color.ios;
                }
                else if (color.constructor == String) {
                    color = new color_1.Color(color).ios;
                }
                this._ios.clearWithColor(color);
            }
            else {
                this._ios.clear();
            }
        }
        catch (err) {
            console.log("Error clearing the DrawingPad: " + err);
        }
    };
    return DrawingPad;
}(content_view_1.ContentView));
exports.DrawingPad = DrawingPad;
