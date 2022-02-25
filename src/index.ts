/* eslint-disable @typescript-eslint/no-empty-function */

import type { ElectronApi } from "../types/renderer";
import {
  app, BrowserWindow, ipcMain, ipcRenderer, dialog,
  HandlerDetails, BrowserWindowConstructorOptions,
  Menu, MenuItem, MenuItemConstructorOptions,
  webContents
} from 'electron';
import * as path from "path";

import { testUtil } from "./utils.js";

// then() will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const startAppMsg = `
*** Start app ******************************************************************
`;
console.log(startAppMsg);

app.whenReady().then(async (): Promise<void> => {
  //getPath(name: 'home' | 'appData' | 'userData' | 'cache' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps')

  console.log(`*** app:ready: __dirname: ${__dirname}`);
  console.log(`*** app:ready: __filename: ${__filename}`);

  // __dirname: C:\Users\Alfredas\ets\win
  // __filename C:\Users\Alfredas\ets\win\index.js

  const preloadJsPath = path.join(__dirname, "preload.js");
  const indexHtmlPath = path.join(__dirname, "../index.html");

  async function createWindow(): Promise<BrowserWindow> {

    testUtil("==> createWindow");

    console.log(`*** app.createWindow: preload: ${preloadJsPath}`);
    console.log(`*** app.createWindow: ipcMain: ${Object.prototype.toString.call(ipcMain)}`);
    console.log(`*** app.createWindow: ipcRenderer: ${Object.prototype.toString.call(ipcRenderer)}`);

    const mainWindow = new BrowserWindow({
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

    function windowOpenHandler(details: HandlerDetails): ({
      action: 'deny'
    }) | ({
      action: 'allow',
      overrideBrowserWindowOptions?: BrowserWindowConstructorOptions
    }) {
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
      } else {
        return { action: "deny" };
      }

    }

    mainWindow.webContents.setWindowOpenHandler(windowOpenHandler);

    mainWindow.webContents.addListener("preload-error",
      function (event: Electron.Event, preloadPath: string, error: Error): void {
        console.error("event:", event);
        console.error("preloadPath:", preloadPath);
        console.error("error:", error);
      }
    );

    console.log(`*** app.createWindow: loadFile: ${indexHtmlPath}`);
    mainWindow.loadFile(indexHtmlPath);

    return mainWindow;
  }

  app.addListener('activate', function (ev: Event, hasVisibleWindows: boolean): void {
    console.log("ev.type:", ev.type, "hasVisibleWindows:", hasVisibleWindows);
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  const mainWindow = await createWindow();
  mainWindow.webContents.openDevTools();

  function playWithCounter() {
    const intervalId = setInterval(() => {
      mainWindow.webContents.send('update-counter', 1);
    }, 500);
    setTimeout(() => { clearInterval(intervalId); }, 10000);
  }

  const template: (MenuItemConstructorOptions | MenuItem)[] = [
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
            webContents.getFocusedWebContents().openDevTools();
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
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);

  ipcMain.on('set-title', (ev: Electron.IpcMainEvent, ...args: unknown[]) => {
    //console.log("Electron.IpcMainEvent.type:", ev.type, "ev:", ev, "args:", args);

    const webContents = ev.sender;
    //console.log("webContents.getType():", webContents.getType());


    const win = BrowserWindow.fromWebContents(webContents);
    if (win) {
      const [title] = args;
      win.setTitle(String(title))
    }
  });

  ipcMain.handle('dialog:openFile', getHandler(mainWindow));

}).catch((reason: unknown): void => {
  console.error("Error:", reason);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.addListener("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function getHandler(browserWindow?: BrowserWindow)
  : (ev: Electron.IpcMainInvokeEvent, ...args: unknown[]) => ReturnType<ElectronApi["openFile"]> {

  async function handleFileOpen(ev: Electron.IpcMainInvokeEvent, ...args: unknown[])
    : ReturnType<ElectronApi["openFile"]> {

    // console.log("ev:", ev);
    args.forEach(arg => {
      console.log("arg:", arg, typeof arg);
    });

    const openDialogOptions: Electron.OpenDialogOptions = {};
    const openDialog: Promise<Electron.OpenDialogReturnValue> = browserWindow
      ? dialog.showOpenDialog(browserWindow, openDialogOptions)
      : dialog.showOpenDialog(openDialogOptions);
    const { canceled, filePaths } = await openDialog;
    if (canceled) {
      return null;
    } else {
      return filePaths && filePaths.length > 0 ? filePaths[0] : null;
    }
  }

  return handleFileOpen;
}

// In this file you can include the rest of your app"s specific main process code.
// You can also put them in separate files and require them here.

import "./main2.js";

import { SerialPort } from "serialport";
import type { PortInfo } from '@serialport/bindings-cpp';

const querySerialPorts: Promise<PortInfo[]> = SerialPort.list();
(async () => {
  const serialPorts = await querySerialPorts;
  serialPorts.forEach(portInfo => {
    console.log("serialPort:", portInfo);
    const serialPort = new SerialPort({
      path: 'COM1',
      baudRate: 9600,
    }
    )
    //serialPort.write('ROBOT POWER ON');
    serialPort.open((err: Error | null) => {
      if (err) {
        console.error("Error:", err);
      }
    });
    const res = serialPort.read(10);
    console.log("res:", res);


  });

})();

export { };
