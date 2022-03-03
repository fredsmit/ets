const electronWindow = window;
const electronApi = electronWindow.electronApi;
import { getRequiredHTMLElements, queryRequiredElement } from "./pageUtils.js";
const { dv1 } = getRequiredHTMLElements("dv1");
const btnNavigator = queryRequiredElement("button", "btnNavigator");
dv1.addEventListener("contextmenu", function (ev) {
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
btnNavigator.addEventListener('click', async function (ev) {
    console.log("window.navigator:", window.navigator);
    console.log("window.navigator:", window.navigator.serial);
    console.log("window.navigator:", window.navigator.usb);
    const usb = window.navigator.usb;
    usb.getDevices().then((devices) => {
        devices.forEach((device) => {
            console.log(device.productName); // "Arduino Micro"
            console.log(device.manufacturerName); // "Arduino LLC"
        });
    });
    // @ts-ignore
    const usbDevice = window.navigator.usb.requestDevice({ filters: [{ vendorId: 32903 }] });
    console.log("usbDevice:", await usbDevice);
});
