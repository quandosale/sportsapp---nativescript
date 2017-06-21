import HTTP = require("http");
import { CONFIG, BLEConfig } from '../../../common/config';

import { Observable } from 'data/observable';
import * as Toast from "nativescript-toast";
import observableArray = require("data/observable-array");
import bluetooth = require("nativescript-bluetooth");
import dialogs = require("ui/dialogs");
import { Page } from 'ui/page';
import { DrawingPad } from 'nativescript-drawingpad';
import { SendEcg } from '../send-ecg';
import { CalmAnalysis } from '../calm-analysis';

import * as  orientationModule from "nativescript-screen-orientation";

import { ItemSpec, GridLayout } from 'ui/layouts/grid-layout';
import phoneMac = require("../../../common/phone");

import { DeviceModel } from '../../../model/device-model'
import { AppSetting } from '../../../common/app-setting';
import { DataItem } from './dataitem';
export class MonitorViewdModel extends Observable {
    private _mainGridlayout: GridLayout;
    private _ecgGraph: DrawingPad;

    private _hrtGraph: DrawingPad;
    private _motionGraphLayout: GridLayout;
    private _motionGraph: DrawingPad;

    private _calmGraphLayout: GridLayout;
    private _calmGraph: DrawingPad;
    private _categoricalSource;

    _isZoom = false;
    _queueSize = 0;

    private _arrDevice = new observableArray.ObservableArray<DataItem>();
    timeInterValID = 0;
    ecgPoints = [];
    hrtPoints = [];
    _sendEcg: SendEcg;
    _CalmAnalysis: CalmAnalysis;
    isPageLoaded = true;
    mainPage: Page;
    constructor(_mainPage: Page) {
        super();
        this.mainPage = _mainPage;
        this._sendEcg = new SendEcg();

        this._CalmAnalysis = new CalmAnalysis();

        // orientationModule.setCurrentOrientation("portrait", function () {
        //     console.log("landscape orientation set");
        // });
        this._mainGridlayout = <GridLayout>_mainPage.getViewById('mainGridlayout');

        this._ecgGraph = <DrawingPad>_mainPage.getViewById('ecgGraph');

        this._hrtGraph = <DrawingPad>_mainPage.getViewById('hrtGraph');
        this._hrtGraph.setGraphType(3);
        this._calmGraphLayout = <GridLayout>_mainPage.getViewById('calmGraphLayout');
        this._calmGraph = <DrawingPad>_mainPage.getViewById('calmGraph');
        this._calmGraph.setGraphType(8);
        this._motionGraphLayout = <GridLayout>_mainPage.getViewById('motionGraphLayout');
        this._motionGraph = <DrawingPad>_mainPage.getViewById('motionGraph');
        this._motionGraph.setGraphType(7);

        for (var i = 0; i < 400; i++)
            this.ecgPoints.push(1200);
        for (var i = 0; i < 50; i++)
            this.hrtPoints.push(100);

        if (this.isPageLoaded) setTimeout(() => {
            this._ecgGraph.setPts(this.ecgPoints);
            // this._ecgZoomGraph.setPts(this.ecgPoints);
        }, 1000);

        this.drawEcgAndHeart();
        this.drawCalmAndMotion();
        this._CalmAnalysis.start();
        this.getDeviceUUID();
        //*/
    }

    calmInt = 0;
    drawCalmAndMotion() {
        if (!this._CalmAnalysis) {
            if (this.isPageLoaded) setTimeout(() => this.drawCalmAndMotion(), 1000);
            return;
        }
        var calmV = this._CalmAnalysis.getCalmValue();
        this.calmInt = parseInt("" + calmV);
        var float = Math.round((calmV - this.calmInt) * 100);
        let radius = this._calmGraphLayout.getMeasuredWidth();
        var dataM = [radius / 2.0, 13, 134, 30, 30];
        //                    calm Value(0~360), Number
        var arc = calmV * 360 / 100;
        var dataC = [radius / 2, 13, arc, calmV, float];

        // this.set('_motionPoints', dataM);
        this._motionGraph.setPts(dataM);

        // this.set('_calmPoints', dataC);
        this._calmGraph.setPts(dataC);

        this.set('test', this.calmInt);
        if (this.isPageLoaded) setTimeout(() => this.drawCalmAndMotion(), 1000);
    }

    onUnloaded() {
        this.isPageLoaded = false;
        this._CalmAnalysis.stop();
    }

    getDeviceUUID() {
        let device: DeviceModel = AppSetting.getDevice();
        console.log(device);
        if (device == null) {
            Toast.makeText("Device is not registered").show();
            return;
        }
        this.doStartScanning(device.UUID);

    }

    onRescanTap() {
        Toast.makeText("Rescan").show();
        this.doStartScanning(this.get("_mac"));
    }
    public onZoomTap() {
        // navigator.navigateToMonitorFullDrawer();
        this.isZoom = !this.isZoom;
        if (this.isZoom) {
            // orientationModule.setCurrentOrientation("landscape", function () {
            //     console.log("landscape orientation set");
            // });

            let testView: GridLayout;
            testView = <GridLayout>this.mainPage.getViewById('first');
            // this._mainGridlayout.removeChild(testView);
            // this._mainGridlayout.getRows().forEach((item: gridLayoutModule.ItemSpec, index: number) => {
            //     console.log('item', item, 'index', index);
            //     this._mainGridlayout.removeRow(item);
            // });
        } else {
            // orientationModule.setCurrentOrientation("portrait", function () {
            //     console.log("landscape orientation set");
            // });
        }
    }

    isSend = false;
    isCSVRecord = false;
    onCSVExportTap() {
        console.log('csv export', this.isCSVRecord);
        this.isCSVRecord = !this.isCSVRecord;
        if (this.isCSVRecord) {
            this._CalmAnalysis.startCSVExport();
        } else {
            this._CalmAnalysis.stopCSVExport();
        }
    }
    public onRecordTap() {
        this.isSend = !this.isSend;
        if (this.isSend) {
            Toast.makeText('record start').show();

            this._sendEcg.start(); // uplaod to cloud

            this._CalmAnalysis.start();
        }
        else {
            Toast.makeText('record stop').show();
            this._sendEcg.stop();
            this._CalmAnalysis.stop();
        }
        this.set('queueSize', 'queue size: ' + this._sendEcg.queue.length);
        this.set('nPacketNumber', 'packet index: ' + this._sendEcg.nPacketIndex);
    }

    fetchCount = 0;
    drawCount = 0;
    drawTime = -1;
    isLive = true;
    public drawEcgChart() {
        if (this.drawTime == -1) {
            this.drawTime = new Date().getTime();
        }
        this.drawCount++;
        let elapseTime = new Date().getTime() - this.drawTime;
        if (elapseTime > 1000) {
            this.drawTime = new Date().getTime();
            if (this.queue.length > 1000) {
                this.fetchCount = Math.round(this.averageHRCount() / this.averageDrawingCount());
            } else
                this.fetchCount = Math.floor(this.averageHRCount() / this.averageDrawingCount());

            // console.log("avgDrawTime", "DataFreq: " + this.averageHRCount() + " FSP: " + this.averageDrawingCount() + " fetchCount: " + this.fetchCount + " queue: " + this.queue.length);
            let debugString = "DataFreq: " + this.averageHRCount() + " FPS: " + this.averageDrawingCount() + " fetchCount: " + this.fetchCount + " queue: " + this.queue.length;
            this.set("debug", debugString);
            // console.log(debugString);
            if (this.firstDRSize < this.drMAX) this.firstDRSize++;
            this.drQueue[this.drIndex] = this.drawCount;
            this.drIndex++;
            this.drIndex = this.drIndex % this.drMAX;
            this.drawCount = 0;
        }
        for (let i = 0; i < this.fetchCount / 3; i++) {
            var _newVal = this.deQueueN(3);
            if (_newVal == -1) break;
            // var temp = this.ecgPoints.slice(0);
            // temp.shift();
            // temp.push(_newVal);
            // this.ecgPoints = temp;
            let zoomValue = 1; //5
            if (this._ecgGraph)
                this._ecgGraph.addPoint(_newVal * zoomValue - 1250 * (zoomValue - 1));
            // this._ecgZoomGraph.addPoint(_newVal * zoomValue - 1250 * (zoomValue - 1));
        }
        if (this._ecgGraph)
            this._ecgGraph.update();
        // this._ecgZoomGraph.update();
        // this.set('_ecgPoints', this.ecgPoints);
        // radius strokevalue,value(0~360)
        if (this.isLive)
            if (this.isPageLoaded) setTimeout(() => this.drawEcgChart(), 50);
    }

    public setHRTPoint(_newVal) {

        var temp = this.hrtPoints.slice(0);
        temp.shift();
        temp.push(_newVal);

        this.hrtPoints = temp;
        this.set('_hrtPoints', this.hrtPoints);
    }

    sinXX = 0;
    cosXX = 0;
    public drawEcgAndHeart() {
        var _self = this;

        setTimeout(() => {
            _self.drawEcgChart();
        }, 1000);

        setTimeout(() => {
            this._hrtGraph.setPts(this.hrtPoints);
            _self.drawHeartRateChart();
        }, 1000);
    }

    drawHeartRateChart() {
        var hr = this._CalmAnalysis.getHrValue();
        if (hr != -1) {
            this.hrtPoints.push(hr);
            this.hrtPoints.shift();
            this._hrtGraph.setPts(this.hrtPoints);
        }
        setTimeout(() => this.drawHeartRateChart(), 50);
    }

    public setPtTest() {
        clearInterval(this.timeInterValID);
        var tt = [1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200, 100, 1, 2, 3, 200,];
        console.log('call setPtTest array length: ' + tt.length)
        this._ecgGraph.setPts(tt);
    }

    public addPtTest() {
        clearInterval(this.timeInterValID);
        var tt = Math.random() * 100;
        console.log('call addPoint, value: ' + tt)
        if (this._ecgGraph)
            this._ecgGraph.addPoint(tt);
    }

    index = 0;
    queue = [];

    //    --------------- Calculate Average Ecg Count ---------------------------------
    ecgMAX = 10;
    ecgQueue = []
    ecgIndex = 0;
    firstEcgSize = 0;

    ecgReceiveTime = -1;
    ecgNumber = 0;

    public averageHRCount(): number {
        if (this.firstEcgSize == 0) return 1;
        let total = 0;
        for (let i = 0; i < this.firstEcgSize; i++) {
            total += this.ecgQueue[i];
        }
        total = Math.floor(total / this.firstEcgSize);
        return total;
    }

    //    ------------------------------------------------
    //    ---------------- Calculate Average Fetch ( Drawing ) Count --------------------------------
    drMAX = 10;
    drQueue = []
    drIndex = 0;
    firstDRSize = 0;

    public averageDrawingCount(): number {
        if (this.firstDRSize == 0) return 1;
        let total = 0;
        for (let i = 0; i < this.firstDRSize; i++) {
            total += this.drQueue[i];
        }
        total = Math.floor(total / this.firstDRSize);
        return total;
    }
    //    ------------------------------------------------

    enQueue(value) {
        this.queue.push(value);

        this.ecgNumber++;
        if (this.ecgReceiveTime == -1) this.ecgReceiveTime = new Date().getTime();
        let elipse = new Date().getTime() - this.ecgReceiveTime;
        if (elipse > 1000) {
            this.ecgReceiveTime = new Date().getTime();

            this.ecgQueue[this.ecgIndex] = this.ecgNumber;
            this.ecgIndex++;
            this.ecgIndex = this.ecgIndex % this.ecgMAX;
            if (this.firstEcgSize < this.ecgMAX) this.firstEcgSize++;
            this.ecgNumber = 0;
        }
    }
    deQueue() {
        var preValue = 1000 + Math.sin(this.sinXX) * 1000;
        this.sinXX += 0.1;
        if (this.queue.length > 0) {
            preValue = this.queue.shift();
        }
        return preValue;
    }

    deQueueN(count: number): number {
        if (count === 0 || this.queue.length < count) {
            return -1;
        }
        let derivationE: number[] = [];

        for (let i = 0; i < count; i++) {
            if (i === 0) {
                derivationE[i] = this.queue[i + 1] - this.queue[i];
            } else if (i === count - 1) {
                if (this.queue.length > count) {
                    derivationE[i] = this.queue[i + 1] - 2 * this.queue[i] + this.queue[i - 1];
                } else {
                    derivationE[i] = -this.queue[i] + this.queue[i - 1];
                }
            } else {
                derivationE[i] = this.queue[i + 1] - 2 * this.queue[i] + this.queue[i - 1];
            }
            derivationE[i] = Math.abs(derivationE[i]);
        }
        let peakIndexE = 0;
        let peakValE = derivationE[0];

        for (let i = 1; i < count; i++) {
            if (derivationE[i] > peakValE) {
                peakValE = derivationE[i];
                peakIndexE = i;
            }
        }

        let rstE = this.queue[peakIndexE];
        this.queue = this.queue.slice(count);
        return rstE;
    }

    get arrDevice() {
        if (this._arrDevice) {
            return this._arrDevice;
        } else {
            return [];
        }
    }
    mMac = "";
    public doStartScanning(_mac) {

        if (!_mac) return;
        this.mMac = _mac;
        var _self = this;
        // On Android 6 we need this permission to be able to scan for peripherals in the background.
        bluetooth.hasCoarseLocationPermission().then(
            function (granted) {
                if (!granted) {
                    bluetooth.requestCoarseLocationPermission().then(() => {
                        setTimeout(() => _self.doStartScanning(_mac), 1000);
                    });
                } else {
                    _self.set('isLoading', true);
                    // reset the array
                    _self._arrDevice.splice(0, _self._arrDevice.length);
                    bluetooth.startScanning({
                        serviceUUIDs: [], // pass an empty array to scan for all services
                        seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
                        onDiscovered: function (peripheral: bluetooth.Peripheral) {
                            var obsp = new DataItem(peripheral.UUID, peripheral.name, false);
                            _self._arrDevice.push(obsp);
                        }
                    }).then(function () {
                        _self.set('isLoading', false);

                        let isFound = false;
                        if (_self._arrDevice.length > 0) {
                            for (let i = 0; i < _self._arrDevice.length; i++) {
                                if (_self._arrDevice.getItem(i).UUID == _mac) {
                                    _self.ConnectDevice(i);
                                    isFound = true;
                                    break;
                                }
                            }
                        }
                        // if not found then re scan
                        if (!isFound)
                            setTimeout(() => _self.doStartScanning(_mac), 1000);
                    },
                        function (err) {
                            _self.set('isLoading', false);

                            setTimeout(() => _self.doStartScanning(_mac), 1000);
                        });
                }
            }).catch((e) => {
                console.log('has permision catch', e);
                _self.doStartScanning(_mac);
            });
    }

    public ConnectDevice(index) {
        var str = JSON.stringify(this._arrDevice.getItem(index));
        var device: any = this._arrDevice.getItem(index);
        var _self = this;
        console.log("deviceUUID", device.UUID);
        bluetooth.setCharacteristicLogging(false);
        bluetooth.connect({
            UUID: device.UUID,
            // NOTE: we could just use the promise as this cb is only invoked once
            onConnected: function (peripheral) {
                // console.log(JSON.stringify(peripheral));
                // peripheral.services.forEach(function (value) {
                // console.log("---- ###### adding service: " + value.UUID);
                clearInterval(_self.timeInterValID);
                bluetooth.startNotifying({
                    peripheralUUID: device.UUID,
                    serviceUUID: BLEConfig.serviceUUID,
                    characteristicUUID: BLEConfig.characteristicUUID,
                    onNotify: function (result) {
                        // result.value is an ArrayBuffer. Every service has a different encoding.
                        // fi. a heartrate monitor value can be retrieved by:
                        var data = new Uint8Array(result.value);
                        var strData = [];
                        if (data[0] == 1) {
                            _self.set('isConnected', true);
                        } else {
                            _self.set('isConnected', false);
                        }
                        let ecgSize = data[1];

                        for (let i = 0; i < ecgSize; i++) {
                            let ecgValue = data[2 + 2 * i] + data[2 + 2 * i + 1] * 255;
                            if (ecgValue > 2500) continue;
                            strData.push(ecgValue);
                            _self.enQueue(ecgValue);
                            if (data[0] == 1) { // hand connected
                                _self._CalmAnalysis.addEcg((ecgValue - 1200) / 800);
                                _self._sendEcg.enQueue(ecgValue);

                                _self.set('queueSize', 'calm: ' + _self._CalmAnalysis.queue.length + ',ecg: ' + _self._sendEcg.queue.length);
                                _self.set('nPacketNumber', 'packet index: ' + _self._sendEcg.nPacketIndex);
                            }
                        }

                        for (let i = 0; i < data.length; i++) {
                            var data1 = ("00" + data[i]).slice(-3);
                        }
                        var str = JSON.stringify(strData);
                        // console.log('test', str, ecgSize);
                    }
                }).then(function (result) {
                    console.log('end', result);
                });
            },
            onDisconnected: function (peripheral) {
                _self.set('isConnected', false);
                Toast.makeText("Device disconnected").show();
                // dialogs.confirm({
                //     title: "Disconnected",
                //     message: "Disconnected from peripheral: " + JSON.stringify(peripheral),
                //     okButtonText: "Rescan",
                //     cancelButtonText: 'Cancel',
                // }).then(function (result) {
                //     // result argument is boolean
                //     console.log("Dialog result: " + result);
                //     if (result == true) {
                //         _self.doStartScanning(global._mac);
                //     }
                // });
                _self.doStartScanning(_self.mMac);
            }
        });
    }
    get isZoom(): boolean {
        return this._isZoom;
    }
    set isZoom(v: boolean) {
        this._isZoom = v;
    }
    get queueSize(): number {
        return this._queueSize;
    }
    set queueSize(v: number) {
        this._queueSize = v;
    }
    _nPacketNumber = 1;
    get nPacketNumber(): number {
        return this._nPacketNumber;
    }
    set nPacketNumber(v: number) {
        this._nPacketNumber = v;
    }

}