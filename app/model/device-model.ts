import observableModule = require("data/observable");
export class DeviceModel {
    UUID: string;
    name: string;
    constructor(uuid: string, name: string) {
        this.UUID = uuid;
        this.name = name;
    }
}
