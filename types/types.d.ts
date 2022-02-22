
type myObjectType = {
    doAThing: (text: string) => void;
}

type TgetCurrentWorkingDirectory = () => string;

type NodeWindow = {
    getCurrentWorkingDirectory: TgetCurrentWorkingDirectory;
    myAPI: myObjectType;
    getNodeConfig: () => unknown; //Readonly<Record<string, unknown>>;
}
