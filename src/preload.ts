/* eslint-disable @typescript-eslint/no-unused-vars */

// preload with contextIsolation enabled
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { myObject, getCwd, getNodeConfig } from "./myApi.js";

contextBridge.exposeInMainWorld('myAPI', myObject);
contextBridge.exposeInMainWorld('getCurrentWorkingDirectory', getCwd);
contextBridge.exposeInMainWorld('getNodeConfig', getNodeConfig);

import type { ElectronMainWorldApi } from '../types/renderer';

const electronMainWorldApi: ElectronMainWorldApi = {
  apiKey: "electronApi",
  api: {
    loadPreferences: () => ipcRenderer.invoke('load-prefs'),
    setTitle: (title: string) => ipcRenderer.send('set-title', title),
    openFile: (...args: unknown[]): Promise<string | null> => ipcRenderer.invoke('dialog:openFile', ...args),
    handleCounter: (listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => {
      ipcRenderer.on('update-counter', listener);
    }
  }
};

contextBridge.exposeInMainWorld(electronMainWorldApi.apiKey, electronMainWorldApi.api);

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", (ev: Event) => {
  console.log("DOMContentLoaded:", ev);

  function replaceText(selector: string, text?: string): void {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text ?? "Unknown";
    }
  }

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

  for (const electronComponent of ["chrome", "node", "electron"]) {
    replaceText(`${electronComponent}-version`, process.versions[electronComponent as keyof NodeJS.ProcessVersions]);
  }

  console.log("process.versions:", process.versions);
  console.log("process.platform:", process.platform); // win32
  console.log("__dirname:", __dirname);
  console.log("__filename:", __filename);

  // for (const entry of Object.entries(process.versions)) {
  //   console.log(entry);
  // }

});

export { };
