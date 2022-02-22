export interface IElectronAPI {
    loadPreferences: () => Promise<void>;
    setTitle: (title: string) => void;
    openFile: (...args: unknown[]) => Promise<string | null>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
