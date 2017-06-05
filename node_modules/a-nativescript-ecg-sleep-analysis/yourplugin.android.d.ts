import { Common } from './yourplugin.common';
export declare class YourPlugin extends Common {

    update(): any;
    setNotyfy(callback): any;
    startCalmness(): any;
    setCalmnessNotyfy(callback): any;
    addCalmdata(data): any;
    addEcgData(data): any;
    show(callback): Promise<string[]>;

}
