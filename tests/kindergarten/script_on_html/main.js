import compiledContent from "./script_on_html.exthtml"

let component = compiledContent()

component.mount(document.getElementById("app"));

console.log(compiledContent)
