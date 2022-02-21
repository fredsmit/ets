"use strict";
/* eslint-disable @typescript-eslint/no-empty-function */
//const { app, BrowserWindow } = await import("electron");
//import { app, BrowserWindow } from "electron";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
//app.setAppPath(appPath || path.dirname(filePath));
const path = require("path");
const utils_js_1 = require("./utils.js");
// then() will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(() => {
    async function createWindow() {
        (0, utils_js_1.testUtil)("==> createWindow");
        // Create the browser window.
        const mainWindow = new electron_1.BrowserWindow({
            height: 720,
            width: 840,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, "preload.js"),
            },
        });
        // __dirname: C:\Users\Alfredas\ets\dist
        // __filename: C:\Users\Alfredas\ets\dist\main.js
        // and load the index.html of the app.
        await mainWindow.loadFile(path.join(__dirname, "index.html"));
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    }
    createWindow();
    electron_1.app.addListener('activate', function (ev, hasVisibleWindows) {
        console.log("ev.type:", ev.type, "hasVisibleWindows:", hasVisibleWindows);
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
}).catch((reason) => {
    console.error("Error:", reason);
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.addListener("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
console.log("__dirname:", __dirname);
console.log("__filename:", __filename);
