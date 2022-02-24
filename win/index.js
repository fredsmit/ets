"use strict";
/* eslint-disable @typescript-eslint/no-empty-function */
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const utils_js_1 = require("./utils.js");
// then() will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
const startAppMsg = `
*** Start app ******************************************************************
`;
console.log(startAppMsg);
electron_1.app.whenReady().then(async () => {
    console.log(`*** app:ready: __dirname: ${__dirname}`);
    console.log(`*** app:ready: __filename: ${__filename}`);
    // __dirname: C:\Users\Alfredas\ets\win
    // __filename C:\Users\Alfredas\ets\win\index.js
    const preloadJsPath = path.join(__dirname, "preload.js");
    const indexHtmlPath = path.join(__dirname, "../index.html");
    async function createWindow() {
        (0, utils_js_1.testUtil)("==> createWindow");
        console.log(`*** app.createWindow: preload: ${preloadJsPath}`);
        console.log(`*** app.createWindow: ipcMain: ${Object.prototype.toString.call(electron_1.ipcMain)}`);
        console.log(`*** app.createWindow: ipcRenderer: ${Object.prototype.toString.call(electron_1.ipcRenderer)}`);
        const mainWindow = new electron_1.BrowserWindow({
            width: 1400,
            height: 840,
            webPreferences: {
                // DEFAULT: contextIsolation: true
                nodeIntegration: true,
                preload: preloadJsPath,
                zoomFactor: 1.50
            },
        });
        function windowOpenHandler(details) {
            //console.log("==> windowOpenHandler.details:", details);
            const url = new URL(details.url);
            if (url.protocol === "file:" && details.frameName === "dialog-2") {
                return {
                    action: "allow",
                    overrideBrowserWindowOptions: {
                        parent: mainWindow,
                        modal: true
                    }
                };
            }
            else {
                return { action: "deny" };
            }
        }
        mainWindow.webContents.setWindowOpenHandler(windowOpenHandler);
        mainWindow.webContents.addListener("preload-error", function (event, preloadPath, error) {
            console.error("event:", event);
            console.error("preloadPath:", preloadPath);
            console.error("error:", error);
        });
        console.log(`*** app.createWindow: loadFile: ${indexHtmlPath}`);
        mainWindow.loadFile(indexHtmlPath);
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
    mainWindow.webContents.openDevTools();
    function playWithCounter() {
        const intervalId = setInterval(() => {
            mainWindow.webContents.send('update-counter', 1);
        }, 500);
        setTimeout(() => { clearInterval(intervalId); }, 10000);
    }
    const menu = electron_1.Menu.buildFromTemplate([
        {
            label: "Counter",
            submenu: [
                {
                    click: () => mainWindow.webContents.send('update-counter', 1),
                    label: 'Increment',
                },
                {
                    click: () => mainWindow.webContents.send('update-counter', -1),
                    label: 'Decrement',
                },
                {
                    click: () => playWithCounter(),
                    label: 'Play',
                },
                {
                    click: () => {
                        mainWindow.webContents.loadURL(indexHtmlPath);
                    },
                    label: '==> Home',
                },
                {
                    click: () => {
                        electron_1.webContents.getFocusedWebContents().openDevTools();
                    },
                    label: '==> Open Dev Tools',
                }
            ]
        }
    ]);
    electron_1.Menu.setApplicationMenu(menu);
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
