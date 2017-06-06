import { Observable } from 'data/observable';
export declare class Common extends Observable {
    message: string;
    constructor();
    start(strBleMac): any;
}
export declare class Utils {
    static SUCCESS_MSG(): string;
}
