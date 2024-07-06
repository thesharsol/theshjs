import { isset } from "../helpers/index.js";

/**
 *
 */
export default class Component {

    #name = "";
    #attributes = {};
    #events = {};
    #config = {};
    #html = {};
    #text = "";
    #properties = {};
    #template = '';
    constructor(comp = null) {
        if (comp != null) {
            if (Object.hasOwnProperty.call(comp, "name")) {
                this.name = comp.name;
            }
            if (Object.hasOwnProperty.call(comp, "attributes")) {
                this.attributes = comp.attributes;
            }
            if (Object.hasOwnProperty.call(comp, "events")) {
                this.events = comp.events;
            }
            if (Object.hasOwnProperty.call(comp, "html")) {
                this.html = comp.html;
            }
            if (Object.hasOwnProperty.call(comp, "text")) {
                this.text = comp.text;
            }
        }
    }
    set properties(properties) {
        this.#properties = properties;
    }
    set property(property) {
        this.#properties[property.key] = property.value;
    }

    get properties() {
        return this.#properties;
    }
    setAttributesFromProperties(exclude = ['to-sail-component']) {
        for (const propertyKey in this.properties) {
            if (exclude.indexOf(propertyKey) == -1) {
                this.set_attribute(propertyKey, this.properties[propertyKey])
            }
        }
    }
    /**
     *
     * @returns {string}
     */
    get name() {
        return this.#name;
    }
    set name(name) {
        this.#name = name;
    }
    get text() {
        return this.#text;
    }
    set text(text) {
        this.#text = text;
    }
    get attributes() {
        return this.#attributes;
    }
    set attributes(attributes) {
        this.#attributes = attributes;
    }
    get class() {
        return this.attributes["class"];
    }
    set class(clas) {
        this.attributes["class"] = clas;
    }
    get_attribute(attribute) {
        return this.#attributes[attribute];
    }
    set_attribute(attribute, value) {
        value != undefined ?
            this.attributes[attribute] = value : '';
    }
    add_class(value) {
        if (Object.hasOwnProperty.call(this.attributes, "class")) {
            if (!this.attributes["class"].includes(value)) {
                this.attributes["class"] += " " + value;
            }
        } else {
            this.attributes["class"] += " " + value;
        }
    }
    get events() {
        return this.#events;
    }
    set events(events) {
        this.#events = events;
    }
    get_event(event) {
        return this.events[event];
    }
    set_event(event, func, param = null) {
        if (typeof func == "object") {
            this.events[event] = func;
        } else {
            this.events[event] = {};
            this.add_event(event, func, param);
        }
    }
    add_event(event, func, param = null) {
        if (!isset(this.events[event])) {
            this.events[event] = [];
        }
        this.events[event].push(func);

    }
    get html() {
        return this.#html;
    }
    set html(html) {
        this.#html = html;
    }
    get_child(child) {
        return this.html[child];
    }
    has_child(child) {
        return Object.hasOwnProperty.call(this.html, child);
    }
    add_child(child, name = null) {
        let index = "c_" + Object.keys(this.html).length;
        if (name != null) {
            index = name;
        }
        this.html[index] = child;
    }
    last_child() {
        return this.html["c_" + (Object.keys(this.html).length - 1)];
    }
    replace_child(child, new_child) {
        this.html[child.name] = new_child;
    }
    delete_child(child) {
        Reflect.deleteProperty(this.html, child);
    }

}
