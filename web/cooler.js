import { queryRequiredElement } from "./pageUtils.js";
const inTitle = queryRequiredElement(document.body, "input", "inTitle");
const btnSetTitle = queryRequiredElement(document.body, "button", "btnSetTitle");
console.log(inTitle, btnSetTitle);
btnSetTitle.addEventListener('click', function (ev) {
    const title = inTitle.value;
    window.electronAPI.setTitle(title);
});
// <button id="btnOpenFile" type="button">Open a File</button>
// <span>File path:&nbsp;</span><strong id="dvFilePath"></strong>
const btnOpenFile = queryRequiredElement(document.body, "button", "btnOpenFile");
const dvFilePath = queryRequiredElement(document.body, "strong", "dvFilePath");
let currentFileName;
btnOpenFile.addEventListener('click', async function (ev) {
    const args = currentFileName ? [currentFileName] : [1, 2, 3];
    const fileName = await window.electronAPI.openFile(...args);
    if (fileName) {
        currentFileName = fileName;
        dvFilePath.innerText = fileName;
    }
});
