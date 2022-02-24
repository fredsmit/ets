import type { ElectronApi, IElectronWindow } from "../types/renderer";
const electronWindow: IElectronWindow = window;
const electronApi: ElectronApi = electronWindow.electronApi;

const dvCounter2 = document.getElementById('dvCounter2');

let oldValue = Math.PI;

function counterUpdateListener2(_ev: unknown, value: unknown): void {
    if (dvCounter2 && typeof value === "number") {
        const newValue = oldValue + value;
        oldValue = newValue;
        const div = document.createElement("div");
        div.innerText = String(newValue);
        dvCounter2.append(div);
    }
}

function replaceText(selector: string, text?: string): void {
    const element = document.getElementById(selector);
    if (element) {
        element.innerText = text ?? "Unknown";
    }
}

for (const electronComponent of ["chrome", "node", "electron"]) {
    replaceText(`${electronComponent}-version`, electronApi.versions[electronComponent]);
}

console.log("ipcRenderer:", window);
console.log("APORTS:", (window as any)["APORTS"]);

declare global {
    interface Window {
        readonly APORTS: any;
    }
}

// console.log("APORTS:", window.APORTS);
// console.log("window.electronApi:", window.electronApi);

const ipcRenderer = window.APORTS.ipcRenderer;

setTimeout(() => {
    //ipcRenderer.removeListener('update-counter', counterUpdateListener2);
}, 10000);


ipcRenderer.send('set-title', "@@@ GIANT @@@ TITLE @@@");
//ipcRenderer.on('update-counter', counterUpdateListener2);

electronApi.onUpdateCounter(counterUpdateListener2);

export { };





