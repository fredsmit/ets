import type { ElectronApi, IElectronWindow } from "../types/renderer";
const electronWindow: IElectronWindow = window;
const electronApi: ElectronApi = electronWindow.electronApi;

import { getRequiredHTMLElements } from "./pageUtils.js";

const { dv1 } = getRequiredHTMLElements("dv1");

dv1.addEventListener("contextmenu", function (this: HTMLElement, ev: MouseEvent): void {
    ev.preventDefault();
    console.log(this.innerText);
    electronApi.showContextMenu(this.innerText);
});

export { };
