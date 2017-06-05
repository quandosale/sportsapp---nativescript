"use strict";
var types = require("utils/types");
var FilePicker = (function () {
    function FilePicker() {
        this._allowMultiple = null;
        this._allowCreateDir = null;
        this._mode = null;
        this._singleClick = null;
        this._startPath = null;
    }
    //methods
    FilePicker.prototype.show = function () {
        return new Promise(function (resolve, reject) { });
    };
    Object.defineProperty(FilePicker.prototype, "allowMultiple", {
        get: function () {
            return this._allowMultiple;
        },
        set: function (allowMultiple) {
            if (types.isBoolean(allowMultiple))
                this._allowMultiple = allowMultiple;
            else
                this._allowMultiple = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilePicker.prototype, "allowCreateDir", {
        get: function () {
            return this._allowCreateDir;
        },
        set: function (allowCreateDir) {
            if (types.isBoolean(allowCreateDir))
                this._allowCreateDir = allowCreateDir;
            else
                this._allowCreateDir = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilePicker.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (mode) {
            if (types.isNumber(mode))
                this._mode = mode;
            else
                this._mode = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilePicker.prototype, "singleClick", {
        get: function () {
            return this._singleClick;
        },
        set: function (singleClick) {
            if (types.isBoolean(singleClick))
                this._singleClick = singleClick;
            else
                this._singleClick = null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilePicker.prototype, "startPath", {
        get: function () {
            return this._startPath;
        },
        set: function (startPath) {
            if (startPath.substring(0.7) == "file://")
                this._startPath = startPath;
            else
                this._startPath = "file://" + startPath;
        },
        enumerable: true,
        configurable: true
    });
    return FilePicker;
}());
exports.FilePicker = FilePicker;
//# sourceMappingURL=file-picker.common.js.map