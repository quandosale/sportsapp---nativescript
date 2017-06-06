import * as platform from 'platform';

import HTTP = require("http");
import observable = require("data/observable");
import paltfrom = require("platform");
import * as fs from "file-system";
import { File, Folder, path } from "file-system";
import * as Toast from "nativescript-toast";
import { CONFIG } from '../../common/config';
import navigator = require("../../common/navigator");
import phoneMac = require("../../common/phone");

export class MainPageViewModel extends observable.Observable {

	constructor() {
		super();
	}
	get screenWidth(): number {
		return paltfrom.screen.mainScreen.widthDIPs;
	}
}

export var instance = new MainPageViewModel();
