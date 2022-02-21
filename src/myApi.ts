import * as process from "process";

const myObject: myObjectType = {
    doAThing: (text: string) => {
        console.log("contextBridge:", text, process.cwd());
    }
};

const getCwd: getCurrentWorkingDirectory = process.cwd;

export { myObject, getCwd };

