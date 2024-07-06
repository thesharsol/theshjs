

import { ParserInstance } from "./bases/Parser.js";
import { htmlToComponent } from "./bases/HtmlToComponent.js";
import { vRouter } from "./router/router.js";
import { routes } from "./router/routes.js";
import { config } from "./coreConfig.js";
import { translate, urlParams } from "./helpers/index.js";

/**
 * 
 * @param {*} page 
 */
export function init(desc) {
    document.addEventListener('readystatechange', () => {
        if (document.readyState == 'complete') {
            vRouter.goToCurrent();
            page.replaceWith(ParserInstance.createElementFromStructure(htmlToComponent(desc.container, desc.components)));
            // 
            config.routes = desc.routes;
            config.lang = desc.lang;
            console.log(location.pathname);

            let url = location.href.substring((location.origin.length+location.pathname.length),location.href.length).split("?")[1]??''
            console.log(`url:${url}`)
            translate()
            console.log(vRouter.find())
            console.log(urlParams())
            // //
            // catchSubmit();

            // connectLangChanger();

        }
    })


    document.addEventListener("content_loaded", (e) => {
        catchSubmit();
        reloadIcons();
        translate(e.detail)
        connectLangChanger();
    })
    document.addEventListener("route", (e) => {

        vRouter.searchedLink = e.detail;
        vRouter.route()
    })

}



