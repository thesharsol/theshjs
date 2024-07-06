import { isset, loadContent } from "../helpers/index.js";
import { Store } from "../storage/store.js";
import { config } from "../coreConfig.js";

class router {
    #searchedLink;
    #currentRoute;
    #foundedRoute;
    #currentPath = [];
    #pathRegExp = new RegExp('^(?<path>[a-z]*)(/:(?<param>[a-z]*)(?<optional>[?])?)?');

    get pathRegEpx() {
        return this.#pathRegExp;
    }
    constructor() {
        this.currentPath = []
    }
    get currentPath() {
        return this.#currentPath;
    }
    set currentPath(path) {
        this.#currentPath = path;
    }
    addRouteToCurrentpath(path) {
        this.#currentPath.push(path);
    }
    get searchedLink() {
        return this.#searchedLink;
    }
    set searchedLink(searchedLink) {
        this.#searchedLink = searchedLink;
    }
    get currentRoute() {
        return this.#currentRoute;
    }
    set currentRoute(route) {
        this.#currentRoute = route;
    }
    get foundedRoute() {
        return this.#foundedRoute;
    }
    set foundedRoute(route) {
        this.#foundedRoute = route;
    }
    get searchedUrl() {
        return location.href.substring((location.origin.length + location.pathname.length), location.href.length).split("?")[1] ?? '';
    }
    get searchedUrlArray() {
        return this.searchedUrl.split('/');
    }
    getSearchedUrlArrayItem(index = 0) {
        return this.searchedUrlArray[index];
    }
    subSearchedUrl(start) {
        return this.searchedUrlArray.slice(start, this.searchedUrlArray.length);
    }
    find(routesArray = config.routes, index = 0) {
        routesArray.forEach(route => {
            const { groups: { param, path, optional } } = route.path.match(this.pathRegEpx);
            // getting route infos
            let routeObject = {
                path: path,

                param: param ? {
                    name: param,
                    optional: optional ? true : false
                } : null,

            };
            // 
            let currentUrlArray = this.subSearchedUrl(index);
            let nextIndex = index + (routeObject.param ? 2 : 1);
            // 
            if (routeObject.path == currentUrlArray[0]) {
                // 
                // 
                if (currentUrlArray.length == 1 || !isset(this.searchedUrlArray[nextIndex])) {
                    console.log("content loaded successfull");
                } else {

                    this.addRouteToCurrentpath(route.path);
                    switch (true) {
                        case isset(route.children) && Array.isArray(route.children) && route.children.length>0:
                            console.log(`the next index is ${nextIndex}`);

                            this.find(route.children, nextIndex);
                            break;

                        default:
                            console.error(`route not founded ${currentUrlArray}`);

                            break;
                    }
                }
            } else {
                console.error('route not founded');

            }

            // if (route.path == this.searchedUrlArray[index]) {

            //     if (this.searchedUrlArray.length == 1 || (this.searchedUrlArray.length > 1 && this.getSearchedUrlArrayItem[index + 1] == '')) {
            //         // this.manageRoute(route)
            //         return 0;
            //     } else {
            //         this.addRouteToCurrentpath(route.path);
            //         if (isset(route.children)) {
            //             this.find(route.children, index + 1);
            //         }
            //     }
            // }
        });
        return this.currentPath;
    }
    goToCurrent(callback = null) {
        Store.defineActiveStorage('sess');
        let current = Store.get('currentRoute', true)
        if (current) {
            this.searchedLink = { url: current.name, box: current.box };
            this.findAndRoute(routes, this.searchedLink, true, callback)
        }
    }
    findAndRoute(routesArray = config.routes, searched, current = false, afterFounded) {
        routesArray.forEach(route => {
            this.addRouteToCurrentpath(route.path);
            if (route.name == searched.url) {
                this.foundedRoute = route;

                if (!current) {
                    Store.defineActiveStorage('sess');
                    let routeString = `{ "name": "${route.name}", "path": "${route.path}","box":"${searched.box}" }`;
                    // 
                    if (Store.get('currentRoute') != routeString) {
                        Store.set('currentRoute', routeString);
                    }
                }
                this.manageRoute(route, afterFounded)
                return
            } else {
                if (route.children) {
                    this.findAndRoute(route.children, searched, false, afterFounded)
                }
            }
            this.currentPath = [];
        })
    }
    /**
     * 
     * @param {*} routesArray 
     * @param {*} link 
     */
    route(routesArray = config.routes) {
        this.findAndRoute(this.searchedLink);
    }
    /**
     * 
     * @param {*} route 
     */
    manageRoute(route, afterFounded) {
        if (route.beforeEnter) {
            route.beforeEnter()
        }
        console.log(this.currentPath);
        // let pathsToLoad = 
        loadContent({ url: this.currentPath, callbacks: [route.afterEnter, afterFounded] });
    }

}
export let vRouter = new router();