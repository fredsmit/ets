import { queryRequiredElement } from "./pageUtils.js";
const inTitle = queryRequiredElement(document.body, "input", "inTitle");
const btnSetTitle = queryRequiredElement(document.body, "button", "btnSetTitle");
console.log(inTitle, btnSetTitle);
btnSetTitle.addEventListener('click', function (ev) {
    const title = inTitle.value;
    window.electronAPI.setTitle(title);
});
