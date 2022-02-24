"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUtil = exports.isGlobalThisWindow = exports.isGlobalThisGlobal = exports.typeofGlobalThis = void 0;
function testUtil(text) {
    //console.log("testUtil.text:", text, process.config);
}
exports.testUtil = testUtil;
function typeofGlobalThis() {
    // [object Window]
    // [object global]
    return Object.prototype.toString.call(globalThis);
}
exports.typeofGlobalThis = typeofGlobalThis;
function isGlobalThisGlobal() {
    return Object.prototype.toString.call(globalThis).toLowerCase().includes("global");
}
exports.isGlobalThisGlobal = isGlobalThisGlobal;
function isGlobalThisWindow() {
    return Object.prototype.toString.call(globalThis).toLowerCase().includes("window");
}
exports.isGlobalThisWindow = isGlobalThisWindow;
