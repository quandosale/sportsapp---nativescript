import * as appSetting from 'application-settings';
import { DeviceModel } from '../model/device-model'
export class AppSetting {
    static setUserData(user: any) {
        appSetting.setString('user', JSON.stringify(user));
    }
    static getUserData(): any {
        let user = appSetting.getString('user');
        if (user == undefined)
            return null;
        return JSON.parse(user);
    }
    static setDevice(device: DeviceModel) {
        appSetting.setString('device', JSON.stringify(device));
    }
    static getDevice(): DeviceModel {
        let device = appSetting.getString('device');
        if (device == undefined)
            return null;
        return JSON.parse(device);
    }
    static setSound(sound: string) {
        console.log('setSound', JSON.stringify(sound, null, 2));
        appSetting.setString('sound', JSON.stringify(sound));
    }
    static getSound(): string {
        let sound = appSetting.getString('sound');
        console.log('getSound', sound);
        if (sound == undefined)
            return null;
        return sound;
    }
    static logout() {
        appSetting.clear();
    }

}