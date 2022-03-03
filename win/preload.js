"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
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
const electron_1 = require("electron");
const myApi_js_1 = require("./myApi.js");
console.log("==> start preload:", window.location);
//console.log(`==> start preload: app.getAppPath: ${app.getAppPath()}`);
console.log("==> start preload:", __dirname);
console.log("==> start preload:", __filename);
console.log("window.isSecureContext:", window.isSecureContext);
const preloadingLocation = window.location;
const allowPreload = preloadingLocation.origin === "file://";
const startPreloadMsg = `==> Start preload: ${Date.now()}`;
console.log(startPreloadMsg);
console.log(`==> Start preload: ipcMain: ${Object.prototype.toString.call(electron_1.ipcMain)}`);
console.log(`==> Start preload: ipcRenderer: ${Object.prototype.toString.call(electron_1.ipcRenderer)}`);
window.addEventListener("load", function (ev) {
    console.log("load:", ev, this.location);
    console.log("load:preloadingLocation:", preloadingLocation);
});
function exposeInMainWorld({ apiKey, api }) {
    if (allowPreload) {
        console.log("exposeInMainWorld:", apiKey);
        electron_1.contextBridge.exposeInMainWorld(apiKey, api);
    }
}
electron_1.contextBridge.exposeInMainWorld('myAPI', myApi_js_1.myObject);
electron_1.contextBridge.exposeInMainWorld('getCurrentWorkingDirectory', myApi_js_1.getCwd);
electron_1.contextBridge.exposeInMainWorld('getNodeConfig', myApi_js_1.getNodeConfig);
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
const versions = Object.fromEntries(Object.entries(globalThis.process.versions)
    .map(entry => [entry[0], entry[1] ?? ""]));
function showContextMenu(...args) {
    console.log("showContextMenu:", args);
    electron_1.ipcRenderer.send('show-context-menu', args);
}
function getWeather() {
    return [
        [
            'sunny',
            'It is nice and sunny outside today. Wear shorts! Go to the beach, or the park, and get an ice cream.'
        ],
        [
            'rainy',
            'Rain is falling outside; take a rain coat and an umbrella, and don\'t stay out for too long.'
        ],
        [
            'snowing',
            'The snow is coming down — it is freezing! Best to stay in with a cup of hot chocolate, or go build a snowman.'
        ],
        [
            'overcast',
            'It isn\'t raining, but the sky is grey and gloomy; it could turn any minute, so take a rain coat just in case.'
        ]
    ];
}
const electronMainWorldApi = {
    apiKey: "electronApi",
    api: {
        versions,
        showContextMenu,
        loadPreferences: () => electron_1.ipcRenderer.invoke('load-prefs'),
        setTitle: (title) => electron_1.ipcRenderer.send('set-title', title),
        openFile: (...args) => electron_1.ipcRenderer.invoke('dialog:openFile', ...args),
        onUpdateCounter: (listener) => {
            electron_1.ipcRenderer.on('update-counter', listener);
        },
        getWeather
    }
};
exposeInMainWorld(electronMainWorldApi);
const testMainWorldApi = {
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
    ipcRenderer: electron_1.ipcRenderer,
    ipcMain: electron_1.ipcMain
};
console.log(`contextBridge.exposeInMainWorld('APORTS', aports);`);
electron_1.contextBridge.exposeInMainWorld('APORTS', aports);
// *** Node.js APIs are available in the preload process. **********************
// *** JavaScript builtins, `window` and `document` are specialized, ***********
// *** which are all invisible to the loaded content. **************************
window.addEventListener("DOMContentLoaded", (ev) => {
    console.log("DOMContentLoaded:", ev);
    console.log(`==> preload:DOMContentLoaded: ipcMain: ${Object.prototype.toString.call(electron_1.ipcMain)}`);
    console.log(`==> preload:DOMContentLoaded: ipcRenderer: ${Object.prototype.toString.call(electron_1.ipcRenderer)}`);
});
