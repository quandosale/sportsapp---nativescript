import { Observable } from 'data/observable';
export class DataItem extends Observable {
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
