import * as process from "process";

function testUtil(text: string): void {
    //console.log("testUtil.text:", text, process.config);
}

function typeofGlobalThis(): string {
    // [object Window]
    // [object global]
    return Object.prototype.toString.call(globalThis);
}

function isGlobalThisGlobal(): boolean {
    return Object.prototype.toString.call(globalThis).toLowerCase().includes("global");
}

function isGlobalThisWindow(): boolean {
    return Object.prototype.toString.call(globalThis).toLowerCase().includes("window");
}

export {
    typeofGlobalThis, isGlobalThisGlobal, isGlobalThisWindow,
    testUtil
};
