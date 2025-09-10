import compiledContent from "./var_reactivity.exthtml"

let component = compiledContent()

component.mount(document.getElementById("app"));

console.log(compiledContent)
