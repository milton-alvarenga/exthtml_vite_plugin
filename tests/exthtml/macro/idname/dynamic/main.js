import compiledContent from "./index.exthtml"

let component = compiledContent()

component.mount(document.getElementById("app"));

console.log(compiledContent)
