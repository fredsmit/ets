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
// This method can only be called before app is ready.
electron_1.app.disableHardwareAcceleration();
electron_1.app.whenReady().then(async () => {
    //getPath(name: 'home' | 'appData' | 'userData' | 'cache' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps')
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
                nodeIntegrationInSubFrames: true,
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
    const template = [
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
        },
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [
                { role: 'quit' }
            ]
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
            ]
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { role: 'close' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = require('electron');
                        await shell.openExternal('https://electronjs.org');
                    }
                }
            ]
        }
    ];
    const menu = electron_1.Menu.buildFromTemplate(template);
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
// In this file you can include the rest of your app"s specific main process code.
// You can also put them in separate files and require them here.
require("./main2.js");
const serialport_1 = require("serialport");
const binding_mock_1 = require("@serialport/binding-mock");
const stream_1 = require("@serialport/stream");
const parser_readline_1 = require("@serialport/parser-readline");
//MockBinding.createPort('/dev/ROBOT', { echo: true, record: true })
const port = new stream_1.SerialPortStream({ binding: binding_mock_1.MockBinding, path: '/dev/ROBOT', baudRate: 14400 });
const querySerialPorts = serialport_1.SerialPort.list();
(async () => {
    // const serialPorts = await querySerialPorts;
    // serialPorts.forEach(portInfo => {
    //   console.log("serialPort:", portInfo);
    // });
    const parser = new parser_readline_1.ReadlineParser();
    port.pipe(parser).on('data', line => {
        console.log(line.toUpperCase());
    });
    port.on('open', () => {
        console.log("open");
        console.log("serialPort.isOpen:", port.isOpen, "port:", port.port, "settings:", port.settings);
        // ...then test by simulating incoming data
        port.emit('data', "Hello, world!\n");
    });
    setInterval(() => {
        const text = 'ROBOT POWER ON';
        port.emit('data', `text: ${Date.now()}\n`);
        port.write(`2text: ${Date.now()}\n`);
    }, 1000);
    // const serialPort = new SerialPort({
    //   path: '/dev/ROBOT',
    //   baudRate: 9600,
    // }, (err: Error | null) => {
    //   if (err) {
    //     console.error("Error:", err);
    //   } else {
    //     console.log("serialPort.isOpen:", serialPort.isOpen, "port:", serialPort.port, "settings:", serialPort.settings);
    //     console.log(serialPort.eventNames());
    //     const res = serialPort.read(10);
    //     console.log("res:", res);
    //   }
    // });
})();
