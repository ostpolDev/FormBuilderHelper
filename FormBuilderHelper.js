/**
 * Form Builder Helper
 * ostpol | 2020
 * https://ostpol.it/FormBuilderHelper
 */

class FormBuilder {
    #customConfig = {};
    #elements = [];

    constructor() {
        
    }

    config(config) {
        this.#customConfig = config;
    }

    put(selector) {
        document.querySelector(selector).innerHTML = this.buildHtml;
    }

    append(selector) {
        document.querySelector(selector).innerHTML += this.buildHtml;
    }

    prepend(selector) {
        let elem = document.querySelector(selector);
        elem.innerHTML = this.buildHtml + elem.innerHTML;
    }

    get buildHtml() {
        let htmlCode = "";
        this.#elements.forEach(e => {
            htmlCode += e.code;
        })
        return htmlCode;
    }

    get elements() {
        return this.#elements;
    }
    // label, placeholder, value, info, custom
    addTextField(config) {
        let html = this.#customConfig.text || this.#customConfig.general || defaults.general;
        let id = "formBuilder-"+makeid(8)
        let obj = merge({
            type: "text",
            label: config.label,
            placeholder: config.placeholder,
            value: config.value,
            info: config.info,
            name: config.name,
            id: id
        }, config.custom);
        html = replaceValues(html, obj)
        this.#elements.push(new HtmlElement(html, id, obj))
    }
}

class HtmlElement {
    code = "";
    id = "";
    data = {}

    constructor(code, id, data) {
        this.code = code;
        this.id = id;
        this.data = data;
    }
}

function replaceValues(string, replacements) {
    let re = /{([^}]+)}/g;

    let matches = string.match(re);
    if (matches) {
        matches.forEach(match => {
            match = match.replace(/[\{\}]/g, '').trim();
            let replacement = "";
            if (replacements[match]) {
                replacement = replacements[match];
            }

            string = string.replace(new RegExp("{"+match+"}", "g"), replacement);
        })
    }

    return string;
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function merge(a, b) {
    if (b == undefined) {
        return a;
    }

    Object.keys(b).forEach(k => {
        a[k] = b[k];
    })
    return a;
}

let defaults = {
    "general": `<div class="field"><label>{label}</label><input type="{type}" name="{name}" value="{value}" placeholder="{placeholder}" id="{id}"><p class="info">{info}</p></div>`
}