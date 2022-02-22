export interface IElectronAPI {
    loadPreferences: () => Promise<void>,
    setTitle: (title: string) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
