import { SidedrawerViewModel } from '../side-drawer-content-view-model';
import { Page } from "ui/page";
export function onLoaded(args) {
    let page = <Page>args.object;
    page.bindingContext = new SidedrawerViewModel(page);
}