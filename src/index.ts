/* eslint-disable @typescript-eslint/no-empty-function */

import { app, BrowserWindow } from 'electron';
import * as path from "path";

import { testUtil } from "./utils.js";

// then() will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then((): void => {

  // console.log("__dirname:", __dirname);
  // console.log("__filename:", __filename);
  // __dirname: C:\Users\Alfredas\ets\win
  // __filename C:\Users\Alfredas\ets\win\index.js

  async function createWindow() {

    testUtil("==> createWindow");

    const preloadJsPath = path.join(__dirname, "preload.js");
    const indexHtmlPath = path.join(__dirname, "../index.html");

    const mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        preload: preloadJsPath,
        nodeIntegration: true,
        zoomFactor: 1.5
      },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(indexHtmlPath);

    // mainWindow.webContents.openDevTools();
  }

  createWindow();

  app.addListener('activate', function (ev: Event, hasVisibleWindows: boolean): void {
    console.log("ev.type:", ev.type, "hasVisibleWindows:", hasVisibleWindows);
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

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

// In this file you can include the rest of your app"s specific main process code.
// You can also put them in separate files and require them here.

export { };
