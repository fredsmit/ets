import { queryRequiredElement } from "./pageUtils.js";
const electronWindow = window;
const electronApi = electronWindow.electronApi;
const inTitle = queryRequiredElement(document.body, "input", "inTitle");
const btnSetTitle = queryRequiredElement(document.body, "button", "btnSetTitle");
console.log(inTitle, btnSetTitle, electronWindow.testApi);
btnSetTitle.addEventListener('click', function (ev) {
    const title = inTitle.value;
    electronApi.setTitle(title);
});
// <button id="btnOpenFile" type="button">Open a File</button>
// <span>File path:&nbsp;</span><strong id="dvFilePath"></strong>
const btnOpenFile = queryRequiredElement(document.body, "button", "btnOpenFile");
const dvFilePath = queryRequiredElement(document.body, "strong", "dvFilePath");
let currentFileName;
btnOpenFile.addEventListener('click', async function (ev) {
    const args = currentFileName ? [currentFileName] : [];
    const fileName = await electronApi.openFile(...args);
    if (fileName) {
        currentFileName = fileName;
        dvFilePath.innerText = fileName;
    }
});
const dvCounter = queryRequiredElement(document.body, "strong", "dvCounter");
electronApi.handleCounter((ev, value) => {
    if (typeof value === "number") {
        const oldValue = Number(dvCounter.innerText);
        const newValue = oldValue + value;
        dvCounter.innerText = String(newValue);
        console.dir(ev);
        //ev.reply('counter-value', newValue);
    }
});
