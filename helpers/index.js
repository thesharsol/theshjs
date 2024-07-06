import lang from "../lang.js";
import { config } from "../coreConfig.js";
import xhr from "../formsubmitter/xhr.js";
import { htmlToComponent } from "../bases/HtmlToComponent.js";
import { importRequired } from "../bases/Require.js";
import { Store } from "../storage/store.js";
import { ParserInstance } from "../bases/Parser.js";



export function definePropsFromElement(obj) {
    if (obj.attributes != undefined) {
        var swi_ = {};
        var oa = obj.attributes;
        for (const attr_index in oa) {
            if (isset(oa[attr_index].value)) {
                swi_[oa[attr_index].name] = oa[attr_index].value;
            }
        }
        return swi_;
    } else {
        return obj;
    }

}

export function register(selector, actions) {
    if (document.readyState == "complete") {
        try {
            apply(selector, actions);
        } catch (e) {

        }
    }
}


function apply(selector, actions) {
    let ParserInstance = new ui();

    let elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        try {
            element.replaceWith(ParserInstance.createElementFromStructure(actions(element)));

        } catch (error) {
            console.log(error);
        }

    })
}

export function childNodes(element) {
    let childNodes = element.childNodes;
    let childNodesWithoutText = []
    for (let index = 0; index < childNodes.length; index++) {
        if (childNodes[index].nodeType != 3 && childNodes[index].nodeType != 8) {
            childNodesWithoutText.push(childNodes[index]);
        } else {
            if (childNodes[index].nodeType == 3 && !isEmpty(childNodes[index].nodeValue)) {
                childNodesWithoutText.push(childNodes[index]);

            }
        }

    }
    return childNodesWithoutText;
}

export function toggleClasses(obj, selectors = []) {
    selectors.forEach(selector => {
        obj.classList.toggle(selector);
    });
}


export function emit(obj, eventName, params = {}) {
    const event = new CustomEvent(eventName, params)
}

export function isset(el) {
    return (el != undefined && el != null) ? true : false;
}
export function reloadIcons() {
    try {
        lucide.createIcons();
    } catch (error) {
        console.log('unloaded icons')
    }
}

export function isEmpty(string) {
    return (string == "" || string == "\n" || string == "\n        ") ? true : false;
}
export function getParent(obj, level, result = []) {
    if (level > 0) {
        getParent(obj.parentNode, level - 1, result);
    } else {
        result.push(obj)
    }
    return result[0];
}
export function urlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams;
}

export function url(url = null) {
    return config.baseUrl + (url ?? '');
}
export function hostUrl(url = null) {
    return config.hostUrl + (url ?? '');
}

export function translate(box = document, languageToset = config.locale) {
    let translatables = box.querySelectorAll('t');
    Store.defineActiveStorage("sess");
    let currentLangKey = '';
    if (isset(Store.get(config.storeLabels.system.currentLanguage))) {
        currentLangKey = Store.get(config.storeLabels.system.currentLanguage);
    } else {
        alert()
        currentLangKey = config.locale;
        Store.set(config.storeLabels.system.currentLanguage, languageToset);
    }

    console.log(config.lang.dictionary[currentLangKey])
    console.log(translatables)
    if (isset(config.lang.dictionary[currentLangKey])) {
        translatables.forEach(trans => {
            trans.innerHTML = findKeys(config.lang.dictionary[currentLangKey], trans.getAttribute('t').split('.'));
        });
    } else {

    }
}
export function connectLangChanger(box = document) {
    let langChangers = box.querySelectorAll('.langChanger');

    langChangers.forEach(langChanger => {
        langChanger.addEventListener("click", (e) => {
            e.preventDefault()
            if (langChanger.hasAttribute('target-lang')) {
                let langKey = langChanger.getAttribute('target-lang');
                if (isset(lang.dictionary[langKey])) {
                    Store.defineActiveStorage("sess");
                    Store.set(config.storeLabels.system.currentLanguage, langKey);
                    translate()
                }
            }
        })

    });
}
function isArray(array) {
    return isset(array.length);
}
/**
 * 
 * @param {*} array 
 * @param {*} keys 
 * @param {*} index 
 * @returns 
 */
function findKeys(array, keys, index = 0) {
    let ret = ''
    if (isArray(keys)) {
        if (isset(array[keys[index]])) {

            if (index == (keys.length - 1)) {
                console.log(array[keys[index]])

                return array[keys[index]];

            } else {
                ret = findKeys(array[keys[index]], keys, index + 1);
            }
        } else {
            return '';
        }
    }
    return ret

}
export function loadContent(params) {
    let url = '';
    let isCascade = false;
    let isLastOfCascade = false;
    // 
    switch (true) {
        case isset(params.url.length) && !isset(params.index):
            params.index = 0;
            url = params.url[0];
            isCascade = true;
            isLastOfCascade = ((params.length - 1) == params.index);

            !isLastOfCascade ? params.index++ : '';
            break;
        case isset(params.url.length) && isset(params.index):
            url = params.url[params.index];
            isCascade = true;
            isLastOfCascade = ((params.url.length - 1) == params.index);
            !isLastOfCascade ? params.index++ : '';

            console.log(`isLastOfCascade ${isLastOfCascade}`);
            break;
        default:
            url = params.url
            break;
    }

    new xhr({
        url: hostUrl(url),
        method: "get",
        callback: (response) => {
            let boxes = document.getElementsByTagName('router-box');
            let box = boxes[boxes.length - 1]
            if (isset(box)) {
                box.innerHTML = "";
                let vBox = document.createElement("div");
                vBox.setAttribute("class", "h-full");
                vBox.innerHTML = response;
                importRequired(vBox)
                let page = ParserInstance.createElementFromStructure(htmlToComponent(vBox))
                box.append(page)
                switch (true) {
                    case !isCascade || (isCascade && isLastOfCascade):
                        if (isset(params.callbacks)) {
                            params.callbacks.forEach(callback => {
                                isset(callback) ?
                                    callback() : '';
                            });

                        }
                        let event = new CustomEvent("content_loaded", { detail: page });
                        document.dispatchEvent(event);
                        break;
                    case (isCascade && !isLastOfCascade):
                        loadContent(params);
                        break;
                    default:
                        break;
                }


            }
        }
    })
}