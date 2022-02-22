import { getRequiredHTMLElements } from "./pageUtils.js";
const nodeWindow = window;
const getCurrentWorkingDirectory = nodeWindow.getCurrentWorkingDirectory;
const getNodeConfig = nodeWindow.getNodeConfig;
//type x = Window["electronAPI"];
console.log(window.electronAPI);
// const btnClick = document.getElementById("btnClick");
// const dvDisplay = document.getElementById("dvDisplay");
const { btnClick, dvDisplay } = getRequiredHTMLElements("btnClick", "dvDisplay");
console.log(btnClick, dvDisplay);
btnClick.addEventListener("click", function (ev) {
    console.log(ev.type);
    const cwd = getCurrentWorkingDirectory();
    const div = document.createElement("div");
    div.innerHTML = cwd + "&nbsp;&nbsp;" + Date.now();
    const div2 = document.createElement("code");
    div2.innerText = JSON.stringify(getNodeConfig());
    dvDisplay.append(div);
    dvDisplay.append(div2);
});
// if (btnClick && dvDisplay) {
//     btnClick.addEventListener("click", function (this: HTMLElement, ev: MouseEvent): void {
//         console.log(ev.type);
//         const cwd = getCurrentWorkingDirectory();
//         const div = document.createElement("div");
//         div.innerHTML = cwd + "&nbsp;&nbsp;" + Date.now();
//         dvDisplay.append(div);
//     });
// }
