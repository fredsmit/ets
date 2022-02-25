/* eslint-disable @typescript-eslint/no-unused-vars */

// *****************************************************************************
// *** preload with contextIsolation enabled ***********************************
// *****************************************************************************
// *** Node.js APIs are available in the preload process. **********************
// *** It has the same sandbox as a Chrome extension. **************************
// *** The context that the `preload` script runs in will only have access *****
// *** to its own dedicated `document` and `window` globals, as well as its ****
// *** own set of JavaScript builtins (`Array`, `Object`, `JSON`, etc.), *******
// *** which are all invisible to the loaded content. The Electron API *********
// *** will only be available in the `preload` script and not the loaded page. *
// *****************************************************************************

import { contextBridge, ipcMain, ipcRenderer, IpcRendererEvent } from 'electron';
import { myObject, getCwd, getNodeConfig } from "./myApi.js";

import type { ElectronMainWorldApi, MainWorldApi } from '../types/renderer';

console.log("==> start preload:", window.location);
//console.log(`==> start preload: app.getAppPath: ${app.getAppPath()}`);

console.log("==> start preload:", __dirname);
console.log("==> start preload:", __filename);
const preloadingLocation = window.location;
const allowPreload = preloadingLocation.origin === "file://";

const startPreloadMsg = `==> Start preload: ${Date.now()}`;
console.log(startPreloadMsg);
console.log(`==> Start preload: ipcMain: ${Object.prototype.toString.call(ipcMain)}`);
console.log(`==> Start preload: ipcRenderer: ${Object.prototype.toString.call(ipcRenderer)}`);

window.addEventListener("load", function (this: Window, ev: Event): void {
  console.log("load:", ev, this.location);
  console.log("load:preloadingLocation:", preloadingLocation);
});

function exposeInMainWorld({ apiKey, api }: MainWorldApi): void {
  if (allowPreload) {
    console.log("exposeInMainWorld:", apiKey);
    contextBridge.exposeInMainWorld(apiKey, api);
  }
}

contextBridge.exposeInMainWorld('myAPI', myObject);
contextBridge.exposeInMainWorld('getCurrentWorkingDirectory', getCwd);
contextBridge.exposeInMainWorld('getNodeConfig', getNodeConfig);

//  ares: "1.17.2"
//* brotli: "1.0.9"
//  chrome: "98.0.4758.82"
//  electron: "17.0.1"
//* icu: "70.1"
//* llhttp: "6.0.4"
//  modules: "101"
//* napi: "8"
//* nghttp2: "1.45.1"
//  node: "16.13.0"
//  openssl: "1.1.1"
//* unicode: "14.0"
//  uv: "1.42.0"
//  v8: "9.8.177.9-electron.0"
//  zlib: "1.2.11"
//  http_parser: ?

const versions = Object.fromEntries(
  Object.entries(globalThis.process.versions)
    .map<[string, string]>(entry => [entry[0], entry[1] ?? ""])
);


function showContextMenu(...args: unknown[]): void {
  console.log("showContextMenu:", args);
  ipcRenderer.send('show-context-menu', args);
}

const electronMainWorldApi: ElectronMainWorldApi = {
  apiKey: "electronApi",
  api: {
    versions,
    showContextMenu,
    loadPreferences: () => ipcRenderer.invoke('load-prefs'),
    setTitle: (title: string) => ipcRenderer.send('set-title', title),
    openFile: (...args: unknown[]): Promise<string | null> => ipcRenderer.invoke('dialog:openFile', ...args),
    onUpdateCounter: (listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
      ipcRenderer.on('update-counter', listener);
    }
  }
};

exposeInMainWorld(electronMainWorldApi);

const testMainWorldApi: MainWorldApi<"testApi"> = {
  apiKey: "testApi",
  api: Date.now()
};

exposeInMainWorld(testMainWorldApi);

const messageChannel = new MessageChannel();
const aports = {
  port1: window.structuredClone(messageChannel.port1, { transfer: [messageChannel.port1] }),
  port2: window.structuredClone(messageChannel.port2, { transfer: [messageChannel.port2] }),
  id1: "p1",
  id2: "p2",
  ipcRenderer,
  ipcMain
};
console.log(`contextBridge.exposeInMainWorld('APORTS', aports);`);

contextBridge.exposeInMainWorld('APORTS', aports);

// *** Node.js APIs are available in the preload process. **********************
// *** JavaScript builtins, `window` and `document` are specialized, ***********
// *** which are all invisible to the loaded content. **************************
window.addEventListener("DOMContentLoaded", (ev: Event) => {
  console.log("DOMContentLoaded:", ev);
  console.log(`==> preload:DOMContentLoaded: ipcMain: ${Object.prototype.toString.call(ipcMain)}`);

  console.log(`==> preload:DOMContentLoaded: ipcRenderer: ${Object.prototype.toString.call(ipcRenderer)}`);
});


export { };
