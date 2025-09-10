import compiledContent from "./input_reactivity_with_event.exthtml"

let component = compiledContent()

component.mount(document.getElementById("app"));

console.log(compiledContent)
