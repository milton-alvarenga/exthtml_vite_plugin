import compiledContent from "./object_reactivity.exthtml"

let component = compiledContent()

component.mount(document.getElementById("app"));

console.log(compiledContent)
