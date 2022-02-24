/* eslint-disable @typescript-eslint/no-unused-vars */

// preload with contextIsolation enabled
import { contextBridge, ipcMain, ipcRenderer, IpcRendererEvent } from 'electron';
import { myObject, getCwd, getNodeConfig } from "./myApi.js";

import type { ElectronMainWorldApi, MainWorldApi } from '../types/renderer';

function exposeInMainWorld({ apiKey, api }: MainWorldApi): void {
  contextBridge.exposeInMainWorld(apiKey, api);
}

contextBridge.exposeInMainWorld('myAPI', myObject);
contextBridge.exposeInMainWorld('getCurrentWorkingDirectory', getCwd);
contextBridge.exposeInMainWorld('getNodeConfig', getNodeConfig);

const versions = Object.fromEntries(
  Object.entries(globalThis.process.versions)
    .map<[string, string]>(entry => [entry[0], entry[1] ?? ""])
);

const electronMainWorldApi: ElectronMainWorldApi = {
  apiKey: "electronApi",
  api: {
    versions,
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
contextBridge.exposeInMainWorld('APORTS', aports);

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", (ev: Event) => {
  console.log("DOMContentLoaded:", ev);
  // console.log("preload::ipcMain:", ipcMain); // undefined
  // console.log("preload::ipcRenderer:", ipcRenderer);

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

  console.log("process.versions:", process.versions);
  console.log("process.platform:", process.platform); // win32
  console.log("__dirname:", __dirname);
  console.log("__filename:", __filename);

  // for (const entry of Object.entries(process.versions)) {
  //   console.log(entry);
  // }

});

export { };
