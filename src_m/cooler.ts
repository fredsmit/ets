import { queryRequiredElement } from "./pageUtils.js"
import type { } from "../types/renderer";

const inTitle = queryRequiredElement(document.body, "input", "inTitle");
const btnSetTitle = queryRequiredElement(document.body, "button", "btnSetTitle");

console.log(inTitle, btnSetTitle);

btnSetTitle.addEventListener('click', function (this: HTMLButtonElement, ev: MouseEvent): void {
    const title = inTitle.value
    window.electronAPI.setTitle(title);
});

// <button id="btnOpenFile" type="button">Open a File</button>
// <span>File path:&nbsp;</span><strong id="dvFilePath"></strong>

const btnOpenFile = queryRequiredElement(document.body, "button", "btnOpenFile");
const dvFilePath = queryRequiredElement(document.body, "strong", "dvFilePath");

let currentFileName: string | null | undefined;

btnOpenFile.addEventListener('click', async function (this: HTMLButtonElement, ev: MouseEvent): Promise<void> {
    const args = currentFileName ? [currentFileName] : [];
    const fileName = await window.electronAPI.openFile(...args);
    if (fileName) {
        currentFileName = fileName;
        dvFilePath.innerText = fileName;
    }
});

export { }
