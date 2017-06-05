import app = require("application");
import * as platform from 'platform';
import HTTP = require("http");
import { CONFIG } from '../../../common/config';
import observableModule = require("data/observable");
import { ObservableArray } from "data/observable-array";
import listViewModule = require("nativescript-telerik-ui-pro/listview");
import { ListViewEventData } from "nativescript-telerik-ui-pro/listview";
import navigator = require("../../../common/navigator");
import phoneMac = require("../../../common/phone");

import bluetooth = require("nativescript-bluetooth");
import * as dialogs from "ui/dialogs";
import * as Toast from "nativescript-toast";
import * as  orientationModule from "nativescript-screen-orientation";
export class ScanViewdModel extends observableModule.Observable {

    private _items: ObservableArray<DataItem>;
    constructor() {
        super();
        if (global.isGuest) {

        }

        orientationModule.setCurrentOrientation("portrait", function () {
            console.log("landscape orientation set");
        });
        this._items = new ObservableArray<DataItem>();
        this.doStartScanning();

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
                            var obsp = new DataItem(peripheral.UUID, peripheral.name, false);
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
            this.set("tip", "Select at least One Device");
            return;
        }

        var str = JSON.stringify(this._items.getItem(index));

        var deviceUUID: any = this._items.getItem(index).UUID;
        var name = this._items.getItem(index).name;

        var _self = this;
        console.log(str);
        if (!global.isGuest) {
            _self.register(name, deviceUUID);
        } else { ///////// guest mode
            console.log("guest Mode", deviceUUID);
            global.mac = deviceUUID;
            navigator.navigateToMonitor();
        }
    }

    public register(name, deviceUUID) {

        let __deviceName = name;
        let __deviceUUID = deviceUUID;
        let userId = "5901f65483755e3701856c4e";
        if (global.userId)
            userId = global.userId;
        this.set('isLoading', true);
        this.set("tip", "Registring Devices ...");
        let request_url = CONFIG.SERVER_URL + '/devices/register/';
        let gatewaymac = phoneMac.getMacAddress();
        let _self = this;
        HTTP.request({
            method: "POST",
            url: request_url,
            content: JSON.stringify({
                ownerId: userId,
                gatewayMac: gatewaymac,
                devices: [{
                    name: __deviceName,
                    mac: __deviceUUID,
                    type: "1"
                }]
            }),
            headers: { "Content-Type": "application/json" },
            timeout: CONFIG.timeout
        }).then(function (result) {
            var res = result.content.toJSON();
            console.log(JSON.stringify(res));
            _self.set('isLoading', false);
            if (res.success) {
                Toast.makeText("please restart app").show();
                navigator.navigateToMonitor();
            }
            else {
                Toast.makeText("" + res.message).show();
                _self.set("tip", "" + res.message);
            }

        }, function (error) {
            console.error(JSON.stringify(error));
            _self.set('isLoading', false);
            _self.set("tip", "Network error");
            navigator.navigateToTutorial();
        });

    }
    public onResetClick(args: listViewModule.ListViewEventData) {
        while (this._items.length) {
            this._items.pop();
        }
    }

    // >> listview-howto-item-selection-events
    public itemSelected(args: listViewModule.ListViewEventData) {
        var item = this.dataItems.getItem(args.itemIndex);
        item.isSelect = true;
    }

    public itemDeselected(args: listViewModule.ListViewEventData) {
        var item = this.dataItems.getItem(args.itemIndex);
        item.isSelect = false;
    }
}

export class DataItem extends observableModule.Observable {
    constructor(uuid: string, name: string, isSelect: boolean) {
        super();
        this.UUID = uuid;
        this.name = name;
        this.isSelect = isSelect;
    }

    get UUID(): string {
        return this.get("_UUID");
    }

    set UUID(value: string) {
        this.set("_UUID", value);
    }

    get name(): string {
        return this.get("_name");
    }

    set name(value: string) {
        this.set("_name", value);
    }

    get isSelect(): boolean {
        return this.get("_isSelect");
    }

    set isSelect(value: boolean) {
        this.set("_isSelect", value);
    }
}
