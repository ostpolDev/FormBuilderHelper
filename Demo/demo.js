let builder = new FormBuilder();

builder.addTextField({
    label: "Name",
    placeholder: "Your full name",
    value: "",
    info: "Not shown publicly",
    "name": "name",
    custom: {
        "test": "This is a test"
    }
})

builder.append("#demoForm")

console.log(builder.elements)