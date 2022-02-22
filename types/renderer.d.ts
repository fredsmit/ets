import type { IpcRendererEvent } from 'electron';

export type MainWorldApiKeys = "electronApi" | "testApi";

export type MainWorldApi<TApiKey extends MainWorldApiKeys, TApi = unknown> = {
    apiKey: TApiKey;
    api: TApi;
}

export type ElectronApi = {
    loadPreferences: () => Promise<void>;
    setTitle: (title: string) => void;
    openFile: (...args: unknown[]) => Promise<string | null>;
    handleCounter: (listener: (ev: IpcRendererEvent, ...args: unknown[]) => void) => void;
}

export type ElectronMainWorldApi = MainWorldApi<"electronApi", ElectronApi>;

declare global {
    interface Window {
        electronApi: ElectronMainWorldApi["api"];
    }
}
