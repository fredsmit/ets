import type { ElectronApi, IElectronWindow } from "../types/renderer";
const electronWindow: IElectronWindow = window;
const electronApi: ElectronApi = electronWindow.electronApi;

import { queryRequiredElement } from "./pageUtils.js"


const inTitle = queryRequiredElement("input", "inTitle");
const btnSetTitle = queryRequiredElement("button", "btnSetTitle");

console.log(inTitle, btnSetTitle, electronWindow.testApi);

btnSetTitle.addEventListener('click', function (this: HTMLButtonElement, ev: MouseEvent): void {
    const title = inTitle.value
    electronApi.setTitle(title);
});

// <button id="btnOpenFile" type="button">Open a File</button>
// <span>File path:&nbsp;</span><strong id="dvFilePath"></strong>

const btnOpenFile = queryRequiredElement("button", "btnOpenFile");
const dvFilePath = queryRequiredElement("strong", "dvFilePath");

let currentFileName: string | null | undefined;

btnOpenFile.addEventListener('click', async function (this: HTMLButtonElement, ev: MouseEvent): Promise<void> {
    const args = currentFileName ? [currentFileName] : [];
    const fileName = await electronApi.openFile(...args);
    if (fileName) {
        console.log("fileName:", window.structuredClone({ currentFileName, fileName }));
        currentFileName = fileName;
        dvFilePath.innerText = fileName;

    }
});

const dvCounter = queryRequiredElement("strong", "dvCounter");

function counterUpdateListener(ev: Electron.IpcRendererEvent, value: unknown): void {
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

export { }

