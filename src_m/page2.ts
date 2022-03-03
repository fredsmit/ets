import type { ElectronApi, IElectronWindow } from "../types/renderer";
const electronWindow: IElectronWindow = window;
const electronApi: ElectronApi = electronWindow.electronApi;

import { getRequiredHTMLElements, queryRequiredElement } from "./pageUtils.js";

const { dv1 } = getRequiredHTMLElements("dv1");
const btnNavigator = queryRequiredElement("button", "btnNavigator");

dv1.addEventListener("contextmenu", function (this: HTMLElement, ev: MouseEvent): void {
    ev.preventDefault();
    console.log(this.innerText);
    electronApi.showContextMenu(this.innerText);
});


// navigator.serial.addEventListener('connect', (e) => {
//     // Connect to `e.target` or add it to a list of available ports.
// });

// navigator.serial.addEventListener('disconnect', (e) => {
//     // Remove `e.target` from the list of available ports.
// });

// navigator.serial.getPorts().then((ports) => {
//     // Initialize the list of available ports with `ports` on page load.
// });

btnNavigator.addEventListener('click', async function (this: HTMLButtonElement, ev: MouseEvent) {
    console.log("window.navigator:", window.navigator);
    console.log("window.navigator:", (window.navigator as any).serial);
    console.log("window.navigator:", (window.navigator as any).usb);

    const usb = (window.navigator as any).usb;

    usb.getDevices().then((devices: any) => {
        devices.forEach((device: any) => {
            console.log(device.productName);      // "Arduino Micro"
            console.log(device.manufacturerName); // "Arduino LLC"
        });
    });

    // @ts-ignore
    const usbDevice: Promise<any> = window.navigator.usb.requestDevice({ filters: [{ vendorId: 32903 }] });
    console.log("usbDevice:", await usbDevice);


});

export { };
