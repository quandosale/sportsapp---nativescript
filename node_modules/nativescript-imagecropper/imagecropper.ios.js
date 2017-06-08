"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var frame = require('ui/frame');
var imageSource = require('image-source');
var _options;
var TOCropViewControllerDelegateImpl = (function (_super) {
    __extends(TOCropViewControllerDelegateImpl, _super);
    function TOCropViewControllerDelegateImpl() {
        _super.apply(this, arguments);
    }
    TOCropViewControllerDelegateImpl.initWithOwner = function (owner) {
        var handler = TOCropViewControllerDelegateImpl.new();
        handler._owner = owner;
        return handler;
    };
    TOCropViewControllerDelegateImpl.prototype.initResolveReject = function (resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
    };
    TOCropViewControllerDelegateImpl.prototype.cropViewControllerDidCropToImageWithRectAngle = function (cropViewController, image, cropRect, angle) {
        cropViewController.dismissViewControllerAnimatedCompletion(true, null);
        if (image) {
            var imgSrc = new imageSource.ImageSource();
            if (_options && _options.width && _options.height) {
                var rect = CGRectMake(0, 0, _options.width, _options.height);
                UIGraphicsBeginImageContext(rect.size);
                image.drawInRect(rect);
                var resizedImage = UIGraphicsGetImageFromCurrentImageContext();
                UIGraphicsEndImageContext();
                if (imgSrc.setNativeSource(resizedImage)) {
                    this._resolve({
                        response: "Success",
                        image: imgSrc
                    });
                }
                else {
                    this._reject({
                        response: "Error",
                        image: null
                    });
                }
            }
            else {
                if (imgSrc.setNativeSource(image)) {
                    this._resolve({
                        response: "Success",
                        image: imgSrc
                    });
                }
                else {
                    this._reject({
                        response: "Error",
                        image: null
                    });
                }
            }
        }
        CFRelease(cropViewController.delegate);
    };
    TOCropViewControllerDelegateImpl.prototype.cropViewControllerDidFinishCancelled = function (cropViewController, cancelled) {
        cropViewController.dismissViewControllerAnimatedCompletion(true, null);
        this._resolve({
            response: "Cancelled",
            image: null
        });
        CFRelease(cropViewController.delegate);
    };
    TOCropViewControllerDelegateImpl.ObjCProtocols = [TOCropViewControllerDelegate];
    return TOCropViewControllerDelegateImpl;
}(NSObject));
var ImageCropper = (function () {
    function ImageCropper() {
    }
    ImageCropper.prototype.show = function (image, options) {
        var _that = this;
        return new Promise(function (resolve, reject) {
            _options = options;
            if (image.ios) {
                var viewController = TOCropViewController.alloc().initWithImage(image.ios);
                var delegate = TOCropViewControllerDelegateImpl.initWithOwner(new WeakRef(viewController));
                delegate.initResolveReject(resolve, reject);
                CFRetain(delegate);
                viewController.delegate = delegate;
                var page = frame.topmost().ios.controller;
                page.presentViewControllerAnimatedCompletion(viewController, true, function () {
                    if (_options && _options.width && _options.height) {
                        var gcd = _that._gcd(_options.width, _options.height);
                        viewController.toolbar.clampButtonHidden = true;
                        viewController.cropView.setAspectLockEnabledWithAspectRatioAnimated(CGSizeMake(_options.width / gcd, _options.height / gcd), false);
                    }
                });
            }
            else {
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
    return ImageCropper;
}());
exports.ImageCropper = ImageCropper;
//# sourceMappingURL=imagecropper.ios.js.map