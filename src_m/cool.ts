interface RendererWindow {
    getCurrentWorkingDirectory: TgetCurrentWorkingDirectory
}

const getCurrentWorkingDirectory = (window as typeof window & RendererWindow).getCurrentWorkingDirectory;

const btnClick = document.getElementById("btnClick");
const dvDisplay = document.getElementById("dvDisplay");

console.log(btnClick, dvDisplay);
if (btnClick && dvDisplay) {
    btnClick.addEventListener("click", function (this: HTMLElement, ev: MouseEvent): void {
        console.log(ev.type);
        const cwd = getCurrentWorkingDirectory();
        const span = document.createElement("span");
        span.textContent = cwd;
        dvDisplay.append(span);
    });
}


