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
		setTimeout(() => this.readCookie(), 2000);
	}

	readCookie() {
		let _self = this;
		var documents = fs.knownFolders.documents();
		var file = documents.getFile(CONFIG.COOKIE_FILE);
		file.readText()
			.then(function (result) {
				// Succeeded writing to the file.
				let data = JSON.parse(result);
				console.log('Success for READ cookie ' + JSON.stringify(data, null, 2));
				_self.getConfig(data);
			}, function (error) {
				// Failed to write to the file.
				console.log('Fail for READ cookie');
			});
	}

	getConfig(data) {
		if (!data) {
			console.log('error data');
			return;
		}
		if (!data.userId) {
			console.log('error data');
			return;
		}
		let _self = this;
		let request_url = CONFIG.SERVER_URL + "/gateways/get/" + phoneMac.getMacAddress() + "/" + data.userId;
		console.log(request_url);
		HTTP.request({
			method: "GET",
			url: request_url,
			headers: { "Content-Type": "application/json" },
			timeout: CONFIG.timeout
		}).then(function (result) {
			var res = result.content.toJSON();
			_self.set('isLoading', false);

			if (res.success) {
				global.login_everytime = res.gateway.login_everytime;
				if (!res.gateway.login_everytime) {// auto login
					console.log('auto login');
					_self.login(data);
				} else {
					console.log('login_everytime');
				}
			}
			else {
				Toast.makeText(res.message).show();
			}
		}, function (error) {
			_self.set('isLoading', false);
			console.error('Nework error');
			Toast.makeText('Network error').show();
		});

	}
	login(user) {
		console.log(user.username, user.password);
		this.set('isLoading', true);
		var _self = this;
		let request_url = CONFIG.SERVER_URL + '/gateways/auth/';
		HTTP.request({
			method: "POST",
			url: request_url,
			content: JSON.stringify({
				username: user.username,
				password: user.password,
				mac: phoneMac.getMacAddress()
			}),
			headers: { "Content-Type": "application/json" },
			timeout: CONFIG.timeout
		}).then(function (result) {
			var res = result.content.toJSON();
			_self.set('isLoading', false);
			if (res.success) {
				console.log('success');
				global.userId = res.data._id;
				global.user = res.data;
				_self.gotoMainPage();
			}
			else {
				Toast.makeText('Your email or password is invalid.').show();
			}
		}, function (error) {
			_self.set('isLoading', false);
			console.error('login error:', JSON.stringify(error), error);
			Toast.makeText('Network error').show();
		});
	}
	gotoMainPage() {
		this.getDeviceFromServer();
	}
	getDeviceFromServer() {
		let userId = global.userId;
		// if (global.user) {
		let gatewayMac = phoneMac.getMacAddress();
		var _self = this;
		let request_url = CONFIG.SERVER_URL + '/devices/get-by-doctor-gateway/' + userId + "/" + gatewayMac;
		HTTP.request({
			method: "GET",
			url: request_url,
			headers: { "Content-Type": "application/json" },
			timeout: CONFIG.timeout
		}).then(function (result) {
			var res = result.content.toJSON();
			console.log(JSON.stringify(res));
			_self.set('isLoading', false);
			if (res.success) {

				Toast.makeText("" + res.message + ":" + res.data[0].mac).show();
				let length = res.data.length;
				let mac = [];
				for (let i = 0; i < length; i++) {
					mac.push(res.data[i].mac);
				}
				console.log('sign in page ------   success  from server     -------------- mac address', mac.length, mac, mac[0]);
				global.mac = mac[0];
				navigator.navigateToMainPage();
			}
			else {
				console.log('fail ');
				// Toast.makeText("" + res.message).show();
				_self.set("tip", "" + res.message);
			}

		}, function (error) {
			console.error(JSON.stringify(error));
			_self.set('isLoading', false);
			_self.set("tip", "Network error");
		});
	}
	get screenWidth(): number {
		return paltfrom.screen.mainScreen.widthDIPs;
	}


}

export var instance = new MainPageViewModel();
