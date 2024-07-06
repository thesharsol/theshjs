import Component from "./Component.js";
import { childNodes, definePropsFromElement, isset } from "../helpers/index.js";

/**
 * 
 * @param {*} html 
 * @param {*} reg 
 * @param {*} parent 
 * @param {*} is_comp 
 * @returns 
 */
export function htmlToComponent(html,reg, parent = null, is_comp = false) {

    let childs = childNodes(html);
    let comp = null;
    let is_sail_Component = false;
    if (html.nodeName != "#text" && html.hasAttribute("to-sail-component") && isset(reg[html.getAttribute("to-sail-component")])) {
        
        comp = reg[html.getAttribute("to-sail-component")](html);
        is_sail_Component = true;

    } else {
        comp = new Component({
            name: html.nodeName,
            attributes: html.nodeName != "#text" ? definePropsFromElement(html) : null,
            text: html.nodeName == "#text" ? html.nodeValue : null,
        });
    }

    childs.forEach(child => {

        htmlToComponent(child,reg, comp, is_sail_Component);
    });

    if (isset(parent)) {
        if (is_comp && html.nodeName != "#text" && html.hasAttribute("in")) {
            parent.get_child(html.getAttribute("in")).add_child(comp)
        } else {
            if (!is_comp) {
                parent.add_child(comp);
            }

        }
    }
    return comp;
}
