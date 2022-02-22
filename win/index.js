"use strict";
/* eslint-disable @typescript-eslint/no-empty-function */
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const utils_js_1 = require("./utils.js");
// then() will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(async () => {
    // console.log("__dirname:", __dirname);
    // console.log("__filename:", __filename);
    // __dirname: C:\Users\Alfredas\ets\win
    // __filename C:\Users\Alfredas\ets\win\index.js
    async function createWindow() {
        (0, utils_js_1.testUtil)("==> createWindow");
        const preloadJsPath = path.join(__dirname, "preload.js");
        const indexHtmlPath = path.join(__dirname, "../index.html");
        const mainWindow = new electron_1.BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                preload: preloadJsPath,
                nodeIntegration: true,
                zoomFactor: 1.50
            },
        });
        // and load the index.html of the app.
        mainWindow.loadFile(indexHtmlPath);
        // mainWindow.webContents.openDevTools();
        return mainWindow;
    }
    electron_1.app.addListener('activate', function (ev, hasVisibleWindows) {
        console.log("ev.type:", ev.type, "hasVisibleWindows:", hasVisibleWindows);
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
    const mainWindow = await createWindow();
    electron_1.ipcMain.on('set-title', (ev, ...args) => {
        //console.log("Electron.IpcMainEvent.type:", ev.type, "ev:", ev, "args:", args);
        const webContents = ev.sender;
        //console.log("webContents.getType():", webContents.getType());
        const win = electron_1.BrowserWindow.fromWebContents(webContents);
        if (win) {
            const [title] = args;
            win.setTitle(String(title));
        }
    });
    electron_1.ipcMain.handle('dialog:openFile', getHandler(mainWindow));
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
function getHandler(browserWindow) {
    async function handleFileOpen(ev, ...args) {
        // console.log("ev:", ev);
        args.forEach(arg => {
            console.log("arg:", arg, typeof arg);
        });
        const openDialogOptions = {};
        const openDialog = browserWindow
            ? electron_1.dialog.showOpenDialog(browserWindow, openDialogOptions)
            : electron_1.dialog.showOpenDialog(openDialogOptions);
        const { canceled, filePaths } = await openDialog;
        if (canceled) {
            return null;
        }
        else {
            return filePaths && filePaths.length > 0 ? filePaths[0] : null;
        }
    }
    return handleFileOpen;
}
