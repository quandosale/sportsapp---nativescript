var view_1 = require("ui/core/view");
var proxy_1 = require("ui/core/proxy");
var dependency_observable_1 = require("ui/core/dependency-observable");
var penColorProperty = new dependency_observable_1.Property("penColor", "DrawingPad", new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.None));
var penWidthProperty = new dependency_observable_1.Property("penWidth", "DrawingPad", new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.None));
var pointsProperty = new dependency_observable_1.Property("points", "DrawingPad", new proxy_1.PropertyMetadata(undefined, dependency_observable_1.PropertyMetadataSettings.None));
var DrawingPad = (function (_super) {
    __extends(DrawingPad, _super);

    function DrawingPad() {
        _super.call(this);
    }
    Object.defineProperty(DrawingPad.prototype, "penColor", {
        get: function () {
            return this._getValue(DrawingPad.penColorProperty);
        },
        set: function (value) {
            this._setValue(DrawingPad.penColorProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DrawingPad.prototype, "penWidth", {
        get: function () {
            return this._getValue(DrawingPad.penWidthProperty);
        },
        set: function (value) {
            this._setValue(DrawingPad.penWidthProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DrawingPad.prototype, "points", {
        get: function () {
            return this._getValue(DrawingPad.pointsProperty);
        },
        set: function (value) {
            this._setValue(DrawingPad.pointsProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    DrawingPad.prototype.clearDrawing = function () {};
    DrawingPad.prototype.getDrawing = function () {};
    DrawingPad.prototype.setPts = function (arr) {};
    DrawingPad.prototype.update = function () {};

    DrawingPad.prototype.setHrtMark = function (index, str) {};

    DrawingPad.prototype.addPoint = function (point) {};

    DrawingPad.penColorProperty = penColorProperty;
    DrawingPad.penWidthProperty = penWidthProperty;
    DrawingPad.pointsProperty = pointsProperty;
    return DrawingPad;
}(view_1.View));
exports.DrawingPad = DrawingPad;