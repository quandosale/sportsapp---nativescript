import app = require("application");
import * as platform from 'platform';
import HTTP = require("http");

import observableModule = require("data/observable");
import { ObservableArray } from "data/observable-array";
import listViewModule = require("nativescript-telerik-ui-pro/listview");
import { ListViewEventData } from "nativescript-telerik-ui-pro/listview";

import bluetooth = require("nativescript-bluetooth");
import * as dialogs from "ui/dialogs";
import * as Toast from "nativescript-toast";
import * as  orientationModule from "nativescript-screen-orientation";

import { CONFIG } from '../../../common/config';
import navigator = require("../../../common/navigator");
import phoneMac = require("../../../common/phone");
import { AppSetting } from '../../../common/app-setting';
import { DeviceItemModel } from './device-item';
import { DeviceModel } from '../../../model/device-model';

export class ScanViewdModel extends observableModule.Observable {

    private _items: ObservableArray<DeviceItemModel>;
    private _pair_instro: string = "Double tap CALM. to begin paring";

    constructor() {
        super();

        orientationModule.setCurrentOrientation("portrait", function () {
            console.log("landscape orientation set");
        });
        this._items = new ObservableArray<DeviceItemModel>();
        this.doStartScanning();
        // this.set("pair_instruction", "hello");
    }
    arrDataset = [];
    get dataItems() {
        return this._items;
    }
    public onItemTap(args: listViewModule.ListViewEventData) {
        var item = this.dataItems.getItem(args.itemIndex);
    }
    public doStartScanning() {
        var _self = this;
        // On Android 6 we need this permission to be able to scan for peripherals in the background.
        bluetooth.hasCoarseLocationPermission().then(
            function (granted) {
                console.log(granted);
                if (!granted) {
                    bluetooth.requestCoarseLocationPermission();
                } else {
                    _self.set('isLoading', true);
                    _self.set("tip", "Scanning nearby for devices...");
                    // reset the array
                    _self._items.splice(0, _self._items.length);
                    bluetooth.startScanning({
                        serviceUUIDs: [], // pass an empty array to scan for all services
                        seconds: 4, // passing in seconds makes the plugin stop scanning after <seconds> seconds
                        onDiscovered: function (peripheral: any) {
                            peripheral.isSelect = true;
                            var obsp = new DeviceItemModel(peripheral.UUID, peripheral.name, false);
                            if (peripheral.name.indexOf('CALM') == -1)
                                return;
                            _self._items.push(obsp);

                            console.log('scanResult', _self._items.length);
                        }
                    }).then(function () {
                        _self.set('isLoading', false);
                        _self.set("tip", "");
                    },
                        function (err) {
                            _self.set('isLoading', false);
                            _self.set("tip", "Scanning error");
                        });
                }
            });
    }
    public onPairTap() {
        this.set('isLoading', true);
        this.set("tip", "Connecting...");
        let index = 0;
        let selectedNumber = 0;
        for (index = 0; index < this._items.length; index++) {
            if (this._items.getItem(index).isSelect) {
                selectedNumber++;
                break;
            }
        }
        console.log("selectedNumber", selectedNumber);
        if (selectedNumber == 0) {
            this.set('isLoading', false);
            this.set("tip", "Select device please");
            return;
        }

        AppSetting.setDevice(new DeviceModel(this._items.getItem(index).UUID, this._items.getItem(index).name));
        navigator.navigateToMainPage();
    }

    public itemSelected(args: listViewModule.ListViewEventData) {
        this.dataItems.forEach(dataItem => {
            dataItem.isSelect = false;
        })
        var item = this.dataItems.getItem(args.itemIndex);
        item.isSelect = true;
    }

    public itemDeselected(args: listViewModule.ListViewEventData) {
        var item = this.dataItems.getItem(args.itemIndex);
        item.isSelect = false;
    }

    get pair_instro() {
        return this._pair_instro;
    }
}
