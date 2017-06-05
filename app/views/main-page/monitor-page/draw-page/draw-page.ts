import { EventData } from "data/observable";
import { Page } from 'ui/page';
import { DrawViewdModel } from './draw-view-model';

export function pageLoaded(args: EventData) {
    let page = <Page>args.object;
    page.bindingContext = new DrawViewdModel(page);
}