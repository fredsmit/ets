"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeConfig = exports.getCwd = exports.myObject = void 0;
const process = require("process");
const myObject = {
    doAThing: (text) => {
        console.log("contextBridge:", text, process.cwd());
        console.log("contextBridge.window:", window);
    }
};
exports.myObject = myObject;
const getCwd = process.cwd;
exports.getCwd = getCwd;
const getNodeConfig = () => JSON.stringify(process.config, null, 2);
exports.getNodeConfig = getNodeConfig;
