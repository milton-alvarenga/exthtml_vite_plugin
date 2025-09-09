import compiledContent from "./var_modified_but_could_be_reseted.exthtml"

let component = compiledContent()

component.mount(document.getElementById("app"));

console.log(compiledContent)
