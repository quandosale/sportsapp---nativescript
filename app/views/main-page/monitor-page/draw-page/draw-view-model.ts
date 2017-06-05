import { Observable } from 'data/observable';
var frameModule = require("ui/frame");
import observableArray = require("data/observable-array");
import bluetooth = require("nativescript-bluetooth");
import { Page } from 'ui/page';
import { DrawingPad } from 'nativescript-drawingpad';
import * as  orientationModule from "nativescript-screen-orientation";
import navigator = require("../../../../common/navigator");
export class DrawViewdModel extends Observable {
    private _categoricalSource;
    private _counter: number;
    private _message: string;
    private UUID: string;
    private _arrDevice = new observableArray.ObservableArray();
    private _ecgZoomGraph: DrawingPad;
    constructor(mainPage: Page) {
        super();
        orientationModule.setCurrentOrientation("landscape", function () {
            //         console.log("landscape orientation set");
        });
        this._ecgZoomGraph = <DrawingPad>mainPage.getViewById('ecgGraphFull');
    }
    onBackTap() {
        navigator.navigateToMonitor();
        console.log('back ');
    }
}