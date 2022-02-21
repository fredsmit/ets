import * as process from "process";

const myObject: myObjectType = {
    doAThing: (text: string) => {
        console.log("contextBridge:", text, process.cwd());
        console.log("contextBridge.window:", window);
    }
};

const getCwd: TgetCurrentWorkingDirectory = process.cwd;
const getNodeConfig: NodeWindow["getNodeConfig"] = () => JSON.stringify(process.config, null, 2);

export { myObject, getCwd, getNodeConfig };

