import { queryRequiredElement } from "./pageUtils.js"
import { } from "../types/renderer";

const inTitle = queryRequiredElement(document.body, "input", "inTitle");
const btnSetTitle = queryRequiredElement(document.body, "button", "btnSetTitle");

console.log(inTitle, btnSetTitle);

btnSetTitle.addEventListener('click', function (this: HTMLButtonElement, ev: MouseEvent): void {
    const title = inTitle.value
    window.electronAPI.setTitle(title);
});

export { }
