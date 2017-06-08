"use strict";
var application = require('application');
var imageSource = require('image-source');
var fs = require('file-system');
var enums = require('ui/enums');
var _options;
var ctx = application.android.context;
var UCrop = com.yalantis.ucrop.UCrop;
var ImageCropper = (function () {
    function ImageCropper() {
    }
    ImageCropper.prototype.show = function (image, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _options = options;
                if (image.android) {
                    var _that = _this;
                    var sourcePathTemp = _this._storeImageSource(image);
                    var folder = fs.knownFolders.temp();
                    var destinationPathTemp = fs.path.join(folder.path, "destTemp.jpg");
                    if (sourcePathTemp == null) {
                        _this._cleanFiles();
                        reject({
                            response: "Error",
                            image: null
                        });
                    }
                    var sourcePath = android.net.Uri.parse("file://" + sourcePathTemp);
                    var destinationPath = android.net.Uri.parse("file://" + destinationPathTemp);
                    function onResult(args) {
                        var requestCode = args.requestCode;
                        var resultCode = args.resultCode;
                        var data = args.intent;
                        if (resultCode == android.app.Activity.RESULT_OK && requestCode == UCrop.REQUEST_CROP) {
                            var resultUri = UCrop.getOutput(data);
                            var is = new imageSource.ImageSource();
                            is.setNativeSource(android.graphics.BitmapFactory.decodeFile(resultUri.getPath()));
                            _that._cleanFiles();
                            application.android.off(application.AndroidApplication.activityResultEvent, onResult);
                            resolve({
                                response: "Success",
                                image: is
                            });
                            return;
                        }
                        else if (resultCode == android.app.Activity.RESULT_CANCELED && requestCode == UCrop.REQUEST_CROP) {
                            _that._cleanFiles();
                            application.android.off(application.AndroidApplication.activityResultEvent, onResult);
                            resolve({
                                response: "Cancelled",
                                image: null
                            });
                            return;
                        }
                        else if (resultCode == UCrop.RESULT_ERROR) {
                            _that._cleanFiles();
                            var cropError = UCrop.getError(data);
                            console.log(cropError.getMessage());
                            application.android.off(application.AndroidApplication.activityResultEvent, onResult);
                            reject({
                                response: "Error",
                                image: null
                            });
                            return;
                        }
                    }
                    ;
                    application.android.on(application.AndroidApplication.activityResultEvent, onResult);
                    if (_options && _options.width && _options.height) {
                        var gcd = _this._gcd(_options.width, _options.height);
                        UCrop.of(sourcePath, destinationPath)
                            .withAspectRatio(_options.width / gcd, _options.height / gcd)
                            .withMaxResultSize(_options.width, _options.height)
                            .start(_this._getContext());
                    }
                    else {
                        UCrop.of(sourcePath, destinationPath)
                            .start(_this._getContext());
                    }
                }
                else {
                    reject({
                        response: "Error",
                        image: null
                    });
                }
            }
            catch (e) {
                reject({
                    response: "Error",
                    image: null
                });
            }
        });
    };
    ImageCropper.prototype._gcd = function (width, height) {
        if (height == 0) {
            return width;
        }
        else {
            return this._gcd(height, width % height);
        }
    };
    ImageCropper.prototype._storeImageSource = function (image) {
        var folder = fs.knownFolders.temp();
        var path = fs.path.join(folder.path, "temp.jpg");
        if (image.saveToFile(path, enums.ImageFormat.jpeg, 100)) {
            return path;
        }
        else {
            return null;
        }
    };
    ImageCropper.prototype._cleanFiles = function () {
        var folder = fs.knownFolders.temp();
        folder.clear();
    };
    ImageCropper.prototype._getContext = function () {
        return application.android.foregroundActivity;
    };
    return ImageCropper;
}());
exports.ImageCropper = ImageCropper;
//# sourceMappingURL=imagecropper.android.js.map