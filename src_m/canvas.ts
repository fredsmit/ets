// import type { ElectronApi, IElectronWindow } from "../types/renderer";
// const electronWindow: IElectronWindow = window;
// const electronApi: ElectronApi = electronWindow.electronApi;

import { queryRequiredElement } from "./pageUtils.js";

const btnPaint = queryRequiredElement('button', "btnPaint");
const canvas = queryRequiredElement('canvas', "canvas1");
const ctx = (() => {
    const ctx = canvas.getContext('2d');
    if (ctx === null)
        throw Error("2d drawing context not available.");
    return ctx;
})();

const WIDTH = document.documentElement.clientWidth;
const HEIGHT = document.documentElement.clientHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;

function random(n: number) {
    return Math.floor(Math.random() * n);
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        ctx.arc(random(WIDTH), random(HEIGHT), random(50), 0, 2 * Math.PI);
        ctx.fill();
    }
}

btnPaint.addEventListener('click', draw);

export { };
