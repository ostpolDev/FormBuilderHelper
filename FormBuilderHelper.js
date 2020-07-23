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
        this.addListeners();
    }

    append(selector) {
        document.querySelector(selector).innerHTML += this.buildHtml;
        this.addListeners();
    }

    prepend(selector) {
        let elem = document.querySelector(selector);
        elem.innerHTML = this.buildHtml + elem.innerHTML;
        this.addListeners();
    }

    addListeners() {
        this.#elements.forEach(e => { // Add event listeners
            if (e.cb) {
                document.getElementById(e.id).addEventListener("click", e.cb);
            }
        })
    }

    get buildHtml() {
        let htmlCode = "";
        this.#elements.forEach(e => { // Make elements
            if (e.draw == true) {
                htmlCode += e.code;
            }
        })
        return htmlCode;
    }

    get elements() {
        return this.#elements;
    }
    // label, placeholder, value, info, custom
    addTextField(config) {
        let html = this.#customConfig.text || defaults.text;
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
        this.#elements.push(new HtmlElement(html, id, obj, true))
    }

    addNumberField(config) {
        let html = this.#customConfig.number || defaults.number;
        let id = "formBuilder-"+makeid(8);
        let obj = merge({
            type: "number",
            label: config.label,
            placeholder: config.placeholder,
            value: config.value,
            info: config.info,
            name: config.name,
            min: config.min,
            max: config.max,
            step: config.step || 1,
            id: id
        }, config.custom)
        html = replaceValues(html, obj);
        this.#elements.push(new HtmlElement(html, id, obj, true));
    }

    addCheckboxField(config) {
        let html = this.#customConfig.checkbox || defaults.checkbox;
        let id = "formBuilder-"+makeid(8);
        let obj = merge({
            type: "checkbox",
            label: config.label,
            checked: config.checked == true ? "checked='true'" : "",
            name: config.name,
            id: id
        }, config.custom)
        html = replaceValues(html, obj);
        this.#elements.push(new HtmlElement(html, id, obj, true));
    }

    addRadioField(config) {
        let html = this.#customConfig.radio_pre || defaults.radio_pre;
        let _id = "formBuilder-"+makeid(8);
        let obj = merge({
            type: "radio",
            name: config.name,
            baseLabel: config.label
        }, config.custom)
        if (config.labels && Array.isArray(config.labels)) {
            config.labels.forEach(l => {
                let id = "formBuilder-"+makeid(8);
                let _html = replaceValues(this.#customConfig.radio || defaults.radio, merge({
                    type: "radio",
                    label: l,
                    id: id,
                    name: config.name
                }, config.custom))

                html += _html;

                this.#elements.push(new HtmlElement(_html, id, obj, false));
            })

            html += this.#customConfig.radio_post || defaults.radio_post;
            html = replaceValues(html, obj);

            this.#elements.push(new HtmlElement(html, _id, obj, true));
        } else {
            console.error("[FormBuilder] Could not create radio input: no [labels] given");
        }
    }

    addDropdownField(config) {
        let html = this.#customConfig.dropdown || defaults.dropdown;
        let id = "formBuilder-"+makeid(8);
        let obj = merge({
            name: config.name,
            id: id,
            label: config.label
        }, config.custom);
        let content = "";
        if (config.values && Array.isArray(config.values)) {
            config.values.forEach(v => {
                content += `<option value="${v.value}">${v.name}</option>`;
            })

            obj.content = content;
            html = replaceValues(html, obj);
            this.#elements.push(new HtmlElement(html, id, obj, true));
        } else {
            console.error("[FormBuilder] Could not create dropdown: no [values] given");
        }
    }

    addTextareaField(config) {
        let html = this.#customConfig.textarea || defaults.textarea;
        let id = "formBuilder-"+makeid(8);
        let obj = merge({
            name: config.name,
            id: id,
            label: config.label,
            placeholder: config.placeholder,
            info: config.info,
            value: config.value
        }, config.custom)

        html = replaceValues(html, obj);
        this.#elements.push(new HtmlElement(html, id, obj, true));
    }

    addButton(config, cb) {
        let html = this.#customConfig.button || defaults.button;
        let id = "formBuilder-"+makeid(8);
        let obj = merge({
            name: config.name,
            id: id,
            value: config.value || config.label,
            type: config.type || "submit"
        }, config.custom)
        
        html = replaceValues(html, obj);
        let elem = new HtmlElement(html, id, obj, true);
        if (cb) {
            elem.setCallback(cb)
        }
        this.#elements.push(elem);
    }

    addCustomField(config) {
        let html = this.#customConfig.custom;
        let id = "formBuilder-"+makeid(8);
        let obj = merge({
            id: id
        }, config.custom);
        html = replaceValues(html, config);
        this.#elements.push(new HtmlElement(html, id, obj, true));
    }
}

class HtmlElement {
    code = "";
    id = "";
    data = {};
    draw = true;

    #callback;

    constructor(code, id, data, draw) {
        this.code = code;
        this.id = id;
        this.data = data;
        this.draw = draw;
    }

    setCallback(callback) {
        this.callback = callback;
    }

    get cb() {
        return this.callback;
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
    "text": `<div class="field"><label>{label}</label><input type="{type}" name="{name}" value="{value}" placeholder="{placeholder}" id="{id}"><p class="info">{info}</p></div>`,
    "number": `<div class="field"><label>{label}</label><input type="{type}" name="{name}" value="{value}" placeholder="{placeholder}" id="{id}" min={min} max={max} step={step}><p class="info">{info}</p></div>`,
    "checkbox": `<div class="field"><input type="{type}" name="{name}" id="{id}" {checked}><label for="{id}" class="checkboxLabel">{label}</label></div>`,
    "radio_pre": `<div class="field"><label>{baseLabel}</label>`,
    "radio": `<input type="{type}" name="{name}" id="{id}"><label for="{id}" class="radioLabel">{label}</label>`,
    "radio_post": `</div>`,
    "dropdown": `<div class="field"><label>{label}</label><select name="{name}" id="{id.0}">{content}</select></div>`,
    "textarea": `<div class="field"><label>{label}</label><textarea name="{name}" placeholder="{placeholder}" id="{id}">{value}</textarea><p class="info">{info}</p></div>`,
    "button": `<div class="field"><button id={id} name={name} type={type}>{value}</button></div>`
}