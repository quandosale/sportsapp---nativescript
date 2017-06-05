import observableModule = require("data/observable");
export class DataItem extends observableModule.Observable {
    constructor(id: string, name: string, date: string, day: string, description: string, isStartOfDate: boolean, dataType: string) {
        super();
        this.id = id;
        this.itemName = name;
        this.itemDate = date;
        this.itemDay = day;
        this.itemDescription = description;
        this.isStartOfDate = isStartOfDate;
        this.dataType = dataType;
    }

    get id(): string {
        return this.get("_id");
    }

    set id(value: string) {
        this.set("_id", value);
    }

    get itemName(): string {
        return this.get("_itemName");
    }

    set itemName(value: string) {
        this.set("_itemName", value);
    }

    get itemDescription(): string {
        return this.get("_itemDescription");
    }

    set itemDescription(value: string) {
        this.set("_itemDescription", value);
    }

    get itemDate(): string {
        return this.get("_itemDate");
    }

    set itemDate(value: string) {
        this.set("_itemDate", value);
    }
    get itemDay(): string {
        return this.get("_itemDay");
    }

    set itemDay(value: string) {
        this.set("_itemDay", value);
    }

    get isStartOfDate(): boolean {
        return this.get("_isStartOfDate");
    }

    set isStartOfDate(value: boolean) {
        this.set("_isStartOfDate", value);
    }
    get dataType(): string {
        return this.get("_dataType");
    }

    set dataType(value: string) {
        this.set("_dataType", value);
        this.set("_dataTypeImage", this.dataTypeToImage(value));
    }

    dataTypeToImage(value: string): string {
        if (value.toLocaleLowerCase() == 'ecg') {
            return "res://type_activity";
        }
        if (value.toLocaleLowerCase() !== 'ecg') {
            return "res://type_sleep";
        }
        return "res://type_sleep";
    }

    dataTypeToIcon(value: number): string {
        if (value == 0) {
            return "&#xe566;";
        }
        if (value == 1) {
            return "&#xf236;";
        }
        return "&#xf236;";
    }
}
