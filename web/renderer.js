"use strict";
/* eslint-disable no-var */
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
// function renderer_testUtil(text: string): void {
//     console.log("renderer_testUtil.text:", text);
// }
console.log("KUKU.document:", document);
const myObject = window.myAPI;
console.log("myObject:", myObject);
myObject.doAThing("myKUKU");
//import type { } from "../types/renderer";
//console.log(window.electronApi);
//import { ipcRenderer, ipcMain } from 'electron';
//console.log("ipcRenderer:", ipcRenderer, "ipcMain:", ipcMain);
