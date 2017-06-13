import { Common } from './yourplugin.common';
export declare class YourPlugin extends Common {
  // define your typings manually
  // or..
  // use take the ios or android .d.ts files and copy/paste them here

  update(): any;
  setNotyfy(callback): any;
  startCalmness(): any;
  setCalmnessNotyfy(callback): any;
  addEcgData(data): any;

  show(callback): Promise<string[]>;
  startCSVExport(): any;
  stopCSVExport(): any;
  private setIntent();
}
