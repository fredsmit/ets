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
        console.log("fileName:", window.structuredClone({ currentFileName, fileName }));
        currentFileName = fileName;
        dvFilePath.innerText = fileName;
    }
});
const dvCounter = queryRequiredElement(document.body, "strong", "dvCounter");
function counterUpdateListener(ev, value) {
    if (typeof value === "number") {
        const oldValue = Number(dvCounter.innerText);
        const newValue = oldValue + value;
        dvCounter.innerText = String(newValue);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // ev.reply('counter-value', newValue);
    }
}
electronApi.onUpdateCounter(counterUpdateListener);
