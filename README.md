# Form Builder Helper
Helps automatically build HTML forms trough javascript.

## Index
- [Quick Demo](#quick-demo)
- [Custom HTML Layouts](#custom-html-layouts)
- [Variables](#variables)
    - [Variable Types](#variable-types)
- [Methods](#methods)
    - [Method Parameters](#method-parameters)
- [Demos](#demos)
---

## Quick Demo

The following JavaScript code

```javascript
let builder = new FormBuilder();

builder.addTextField({
    label: "Name",
    placeholder: "Your full name",
    info: "Not shown publicly",
    name: "name"
})

builder.append("#demoForm")
```

will produce the following HTML output

```html
<div class="field">
    <label>Name</label>
    <input type="text" value="" name="name" placeholder="Your full name" id="formBuilder-ax126xVI">
    <p class="info">Not shown publicly</p>
</div>
```

## Custom HTML Layouts

The HTML configuration for the Form Builder can be changed by calling `builder.config({...})`. This can be used to change the generated html layout.

In this example, the default layout for the Text field is changed

```javascript
let builder = new FormBuilder();

builder.config({
    text: `
        <div class="field">
            <label class="label">{label}</label>
            <div class="control">
                <input type="{type}" value="{value}" placeholder="{placeholder}">
                <p class="help">{info}</p>
            </div>
        </div>`
})

builder.addTextField({
    label: "Name",
    placeholder: "Your full name",
    info: "Not shown publicly"
})

builder.append("#demoForm")

```

The following config will change the HTML output to

```html
<div class="field">
    <label class="label">Name</label>
    <div class="control">
        <input type="text" value="" name="" placeholder="Your full name">
        <p class="help">Not shown publicly</p>
    </div>
</div>
```

These are default types:

Name | Effected | Preferred
--- | --- | ---
text | text | true
number | number | true
checkbox | checkbox | true
radio_pre * | radio | true
radio * | radio | true
radio_post * | radio | true
dropdown | select | true
textarea | textarea | true
button | button | true

\* Radio buttons have to be defined in 3 parts. The container (pre), the actual radio input (radio) and the closing of the container (post)

## Variables

The builder will replace all variable strings surrounded by curly brackets with the corresponding value. Default variables
are `label` `placeholder` `info` `name` and `value`

Additionally, custom values can be passed trough the addField functions wich can be used in the layouts by adding a field called "custom".

Example:

```javascript
let builder = new FormBuilder();

builder.config({
    text: `
        <div class="field">
            <label class="label">{label}</label>
            <div class="control">
                <input class="{class}" type="{type}" value="{value}" placeholder="{placeholder}">
                <p class="help">{info}</p>
            </div>
        </div>`
})

builder.addTextField({
    label: "Name",
    placeholder: "Your full name",
    info: "Not shown publicly",
    custom: {
        class: "red"
    }
})

builder.append("#demoForm")

```

This will generate following HTML code

```html
<div class="field">
    <label class="label">Name</label>
    <div class="control">
        <input class="red" type="text" value="" placeholder="Your full name">
        <p class="help">Not shown publicly</p>
    </div>
</div>
```

## Methods

```javascript

/**
 * Setup and Config
 */

let builder = new FormBuilder(); // Create a new FormBuilder

builder.config({...}) // Used to change the HTML Layouts

/**
 * Creating
 */

builder.addTextField({...}) // Adds a Text Field
builder.addNumberField({...}) // Adds a Number Field
builder.addCheckboxField({...}) // Adds a checkbox group Field
builder.addRadioField({...}) // Adds a Radio group field
builder.addDropdownField({...}) // Adds a dropdown / select field
builder.addTextareaField({...}) // Adds a Textarea

builder.addCustomField({ // Adds a custom field
    layout: String, // Name of HTML layout in config
    ...
})

builder.addButton({...}, callback) // Adds a button. Callback is called when clicked

/**
 * Building
 */

builder.put(selector) // Put the HTML into an element matching the selector
builder.append(selector) // Put the HTML after the content of an element matching
builder.prepend(selector) // Put the HTML before the content of an element matching

/**
 * Properties
 */

builder.buildHtml // Gets the built HTML for the current form
builder.elements // Gets the individual form elements and their data

```

### Method Parameters

```javascript
builder.config({ // Change HTML Layouts
    text: String,
    number: String,
    checkbox: String,
    radio: String,
    dropdown: String,
    textarea: String,
    button: String,
    custom: {
        objectName: String,
        objectName2: String,
        ...
    }
})
```

All "adding methods" parameters correspond with the variables used within their HTML layout,
and can be changed to anything. No parameter is required by default. Only by the given layout.

Only the `type` and `id` variables are controlled by the default create functions.

Here are all the default HTML Layouts:

**Text**
```html
<div class="field">
    <label>{label}</label>
    <input type="{type}" name="{name}" value="{value}" placeholder="{placeholder}" id="{id}">
    <p class="info">{info}</p>
</div>
```

**Number**
```html
<div class="field">
    <label>{label}</label>
    <input type="{type}" name="{name}" value="{value}" placeholder="{placeholder}" id="{id}" min={min} max={max} step={step}>
    <p class="info">{info}</p>
</div>
```

**Checkbox**
```html
<div class="field">
    <input type="{type}" name="{name}" id="{id}", checked="{checked}">
    <label for="{id}">{label}</label>
</div>
```

**Radio**

Radio buttons have to be defined in 3 parts. The container (pre), the actual radio input (radio) and the closing of the container (post)
Radio fields are special because they require a string array named `labels`

e.g.:

```javascript
...
labels: [
    "0 - 30",
    "31 - 60",
    "61 - 100"
]
...
```

```html
<div class="field">
    <input type="{type}" name="{name}" id="{id.0}">
    <label>{label}</label>
</div>
```

**Dropdown**

Dropdown fields are also special because they require an array named `values`. Each value
is an object containing a `name` and `value`.

The HTML template also requires a variable named `content`, wich gets replaced by the options

e.g.:

```javascript
...
values: [
    {name: "Male", value: "male"},
    {name: "Female", value: "female"},
    {name: "Other", value: "other"},
    ...
]
...
```

```html
<div class="field">
    <label>{label}</label>
    <select name="{name}" id="{id.0}">
        {content}
    </select>
</div>
```

**Textarea**
```html
<div class="field">
    <label>{label}</label>
    <input type="{type}" name="{name}" placeholder="{placeholder}" id="{id}">
    {value}
    </textarea>
    <p class="info">{info}</p>
</div>
```

**Button**
```html
<div class="field">
    <button id={id} name={name} type={type}>{value}</button>
</div>
```

## Demos

[Demo Files](https://ostpol.it/)

[Interactive Demo](https://ostpol.it/FormBuilderHelper/demo.html)