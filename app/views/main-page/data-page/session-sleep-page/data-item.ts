import { Observable, EventData } from 'data/observable';
export class DataItem extends Observable {
    constructor(id: number, name: string, description: string, isStartOfDate: boolean, dataType: number) {
        super();
        this.id = id;
        this.itemName = name;
        this.itemDescription = description;
        this.isStartOfDate = isStartOfDate;
        this.dataType = dataType;
    }

    get id(): number {
        return this.get("_id");
    }

    set id(value: number) {
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

    get isStartOfDate(): boolean {
        return this.get("_isStartOfDate");
    }

    set isStartOfDate(value: boolean) {
        this.set("_isStartOfDate", value);
    }
    get dataType(): number {
        return this.get("_dataType");
    }

    set dataType(value: number) {
        this.set("_dataType", value);
        this.set("_dataTypeImage", this.dataTypeToImage(value));

    }
    dataTypeToImage(value: number): string {
        if (value == 0) {
            return "res://type_activity";
        }
        if (value == 1) {
            return "res://type_sleep";
        }
        return "res://type_sleep";
    }
}
