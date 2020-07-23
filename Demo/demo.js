let builder = new FormBuilder();

builder.addTextField({
    label: "Name",
    placeholder: "Your first name",
    value: "",
    info: "Not shown publicly",
    name: "name"
})

builder.addTextField({
    label: "Last Name",
    placeholder: "Your last name",
    info: "Also not shown publicly",
    name: "lastName"
})

builder.addNumberField({
    label: "Age",
    placeholder: "Please enter your age",
    info: "You must be at least 13 and 130 at most",
    value: 13,
    min: 13,
    max: 130
})

builder.addNumberField({ // This is to show the step functionality
    label: "Pi",
    placeholder: Math.PI.toString(),
    info: "Please enter pi up to 4 decimal places",
    min: 0,
    max: 5,
    step: 0.0001
})

builder.addRadioField({
    name: "gender",
    labels: [
        "Male", "Female", "Other"
    ],
    label: "Gender"
})

builder.addDropdownField({
    label: "Choose a language",
    name: "language",
    values: [
        {"name": "English", "value": "en"},
        {"name": "Deutsch", "value": "de"},
        {"name": "한국어", "value": "ko"},
        {"name": "日本人", "value": "jp"},
        {"name": "中文", "value": "cn"},
    ]
})

builder.addTextareaField({
    label: "About",
    placeholder: "Write something about yourself...",
    info: "This is optional",
    name: "about"
})

builder.addCheckboxField({
    label: "I agree to the Terms and Conditions",
    name: "agree"
})

builder.addButton({
    label: "Click Me",
    name: "submit",
    type: "submit"
}, clickButton)

builder.append("#demoForm")

console.log("Resulted elements:",builder.elements)

function clickButton() {
    alert("You clicked me!")
}