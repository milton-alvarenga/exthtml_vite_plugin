import compiledContent from "./button_reactive.exthtml"

let component = compiledContent()

component.mount(document.getElementById("app"));

console.log(compiledContent)
