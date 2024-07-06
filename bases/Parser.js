/*
@author BEBE EPEE Ivan Sampi
@version
@description

*/
class Parser {
    #sel = null;
    #copy = [];
    #isTargetStatement = false;
    #message = {
        errors: {
            empty_selector: "selector can't be empty",
            no_match_selector:
                "the selector does not correspond to any element of the page",
            re_select: "the selector does not correspond to any element of the page",
        },
    };

    constructor() {
        //
    }
    get message() {
        return this.#message;
    }
    get isTargetStatement() {
        return this.#isTargetStatement;
    }
    set isTargetStatement(statement) {
        this.#isTargetStatement = statement;
    }
    select(selector = null) {
        //
        if (selector != null) {
            //
            var tmp_object = this.$(selector);
            if (!this.isNull(tmp_object)) {
                if (tmp_object != this.sel) {
                    this.sel = tmp_object;
                } else {
                    throw this.message.errors.re_select;
                }
            } else {
                throw messages.errors.no_match_selector;
            }
        } else {
            throw this.message.empty_selector;
        }
        return this;
    }
    isSelEmpty() {
        if (this.isNull(this.sel)) {
            throw this.message.empty_selector;
        }
        return this.isNull(this.sel);
    }
    isNull(element) {
        if (element == null) {
            return true;
        }
        return false;
    }
    //istarget
    isTarget(target, element) {
        this.isTargetStatement = false;
        this.checkTarget(target, element);
        return this.isTargetStatement;
    }

    checkTarget(target, element) {
        if (!this.isTargetStatement) {
            if (element != null) {
                if (element == target) {
                    this.isTargetStatement = true;
                    return this.isTargetStatement;
                } else {
                    element.childNodes.forEach((child) => {
                        this.checkTarget(target, child);
                        if (this.isTargetStatement) {
                            return;
                        }
                    });
                }
            }
        }
    }
    //
    get sel() {
        return this.#sel;
    }
    set sel(sel) {
        this.#sel = sel;
    }
    //

    get copy() {
        return this.#copy;
    }
    set copy(copy) {
        this.#copy.push(copy);
    }
    resetCopy() {
        this.#copy = [];
    }
    copyContent(sel = null) {
        if (!this.isNull(sel)) {
            this.select(sel);
        }
        if (!this.isSelEmpty()) {
            this.sel.childNodes.forEach((child) => {
                this.copy = child.cloneNode(true);
            });
        }
        return this;
    }

    copyElement(sel = null) {
        if (!this.isNull(sel)) {
            this.select(sel);
        }
        if (!this.isSelEmpty()) {
            this.copy = this.sel.cloneNode(true);
        }
        return this;
    }
    cutElement(sel = null) {
        this.copyContent(sel);
        this.empty();
        return this;
    }
    cutContent(sel = null) {
        this.copyContent(sel);
        this.empty();
        return this;
    }
    empty() {
        this.html("");
    }
    pasteTo(sel = null) {
        if (!this.isNull(sel)) {
            this.select(sel);
            if (!this.isSelEmpty()) {
                for (let i = 0; i < this.copy.length; i++) {
                    this.sel.append(this.copy[i]);
                }
                this.resetCopy();
            }
        }
    }
    remove() {
        this.sel.remove();
    }
    html(html = null) {
        if (html == null) {
            return this.sel.innerHTML;
        }
        this.sel.innerHTML = html;
    }
    append(struct) {
        this.sel.forEach(sel => {
            sel.append(this.createElementFromStructure(struct));
        });
    }
    //
    before(struct) {
        this.sel.before(this.createElementFromStructure(struct));
    }
    //
    after(struct) {
        this.sel.after(this.createElementFromStructure(struct));
    }
    //
    prepend(struct) {
        this.sel.prepend(this.createElementFromStructure(struct));
    }
    //
    $(selector) {
        return document.querySelectorAll(selector);
    }
    /*

    */
    createElementFromStructure(struct) {
        let that = this;
        try {
            var finalElement = this.createElement(struct);
        } catch (error) {
            return this.createElementFromStructure(this.error(error));
        }

        if (
            Object.hasOwnProperty.call(struct, "html") ||
            struct.html != undefined
        ) {
            for (const key in struct.html) {
                finalElement.append(that.createElementFromStructure(struct.html[key]));
            }
        }
        return finalElement;
    }
    /*
     */
    error(error) {
        return {
            name: "div",
            text: "error:",
            html: {
                error: {
                    name: "span",
                    text: error,
                    attributes: {
                        style: "color:red;font-style:italic;text-decoration:underline",
                    },
                },
            },
        };
    }
    //
    createElement(obj) {
        let that = this;
        if (Object.hasOwnProperty.call(obj,"template")) {
            var element = document.createElement("sailComp");
            element.innerHTML = obj.template;

            return element;
        }
        if (Object.hasOwnProperty.call(obj, "name") || obj.name != undefined) {
            //
            if (obj.name == "#text") {
                return document.createTextNode(obj.text);
            }
            var element = document.createElement(obj.name);
            if (
                (Object.hasOwnProperty.call(obj, "attributes") &&
                    obj.attributes != null) ||
                (obj.attributes != undefined && obj.attributes != null)
            ) {
                //
                for (const key in obj.attributes) {
                    if (Object.hasOwnProperty.call(obj.attributes, key)) {
                        if(!this.isNull(obj.attributes[key])){
                            element.setAttribute(key, obj.attributes[key]);

                        }
                    }
                }
            }
            if (Object.hasOwnProperty.call(obj, "text") || obj.text != undefined) {
                //
                element.innerText = obj.text;
            }
            if (
                Object.hasOwnProperty.call(obj, "events") ||
                obj.events != undefined
            ) {
                //
                for (const event in obj.events) {
                    for (const func in obj.events[event]) {
                        element.addEventListener(event, function (e) {
                            // console.log(key2)
                            // console.log(obj.events[event])
                            if (typeof (obj.events[event][func]) == "function") {
                                obj.events[event][func](element,e);
                            }else{
                                if (typeof (obj.events[event][func]) == "object") {
                                    obj.events[event][func][0](element,e,obj.events[event][func][1]);
                                }
                            }
                            // window[key2](element, obj.events[event][func], e);
                        });
                    }
                }
            }
        } else {
            throw "name undefined";
        }

        return element;
    }
}

export var ParserInstance = new Parser();
