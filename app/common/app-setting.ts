import * as appSetting from 'application-settings';

export class AppSetting {
    static setUserData(user: any) {
        appSetting.setString('user', JSON.stringify(user));
    }
    static getUserData(): Object {
        let user = appSetting.getString('user');
        if(user == undefined)
            return null;
        return JSON.parse(user);
    }
}