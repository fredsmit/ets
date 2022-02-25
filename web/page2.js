const electronWindow = window;
const electronApi = electronWindow.electronApi;
import { getRequiredHTMLElements } from "./pageUtils.js";
const { dv1 } = getRequiredHTMLElements("dv1");
dv1.addEventListener("contextmenu", function (ev) {
    ev.preventDefault();
    console.log(this.innerText);
    electronApi.showContextMenu(this.innerText);
});
