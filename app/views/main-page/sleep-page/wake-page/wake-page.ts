import pages = require("ui/page");
import { EventData } from "data/observable";
import { WakeViewModule } from './wake-view-model';
export function onPageLoaded(args: EventData) {
    var page = <pages.Page>args.object;
    page.bindingContext = new WakeViewModule(page);
}