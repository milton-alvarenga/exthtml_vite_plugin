import compiledContent from "./index.exthtml"

let component = compiledContent()

component.mount(document.getElementById("app"));
window.items = component.capture_state().items;
window.items2 = component.capture_state().items2;

console.log(compiledContent)
