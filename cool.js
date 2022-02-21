"use strict";
const getCurrentWorkingDirectory = window.getCurrentWorkingDirectory;
const btnClick = document.getElementById("btnClick");
const dvDisplay = document.getElementById("dvDisplay");
console.log(btnClick, dvDisplay);
if (btnClick && dvDisplay) {
    btnClick.addEventListener("click", function (ev) {
        console.log(ev.type);
        const cwd = getCurrentWorkingDirectory();
        const span = document.createElement("span");
        span.textContent = cwd;
        dvDisplay.append(span);
    });
}
