"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCwd = exports.myObject = void 0;
const process = require("process");
const myObject = {
    doAThing: (text) => {
        console.log("contextBridge:", text, process.cwd());
    }
};
exports.myObject = myObject;
const getCwd = process.cwd;
exports.getCwd = getCwd;
