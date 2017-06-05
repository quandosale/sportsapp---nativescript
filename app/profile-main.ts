import pages = require("ui/page");
import frame = require("ui/frame");
import button = require("ui/button");
import prof = require("./common/profiling");
export function createPage() {
    var page = new pages.Page();
    var btn = new button.Button();
    btn.text = "GO!";
    btn.on(button.Button.tapEvent, function () {
        prof.startCPUProfile("main-page");
        var nextPage = "views/main-page/main-page";
        frame.topmost().navigate(nextPage);

        // testListenersCreate();
    });

    page.content = btn;
    return page;
}