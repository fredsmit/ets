import type { IpcRendererEvent } from 'electron';

export type MainWorldApiKeys = "electronApi" | "testApi";

export type MainWorldApi<TApiKey extends MainWorldApiKeys = MainWorldApiKeys, TApi = unknown> = {
    apiKey: TApiKey;
    api: TApi;
}

export type ElectronApi = {
    loadPreferences: () => Promise<void>;
    setTitle: (title: string) => void;
    openFile: (...args: unknown[]) => Promise<string | null>;
    onUpdateCounter: (listener: (ev: IpcRendererEvent, ...args: unknown[]) => void) => void;
}

export type ElectronMainWorldApi = MainWorldApi<"electronApi", ElectronApi>;

declare global {
    interface Window {
        readonly electronApi: ElectronMainWorldApi["api"];
        readonly testApi?: unknown;
        structuredClone<T>(value: T, options?: { transfer?: Transferable[]; }): T;
    }
}

export type IElectronWindow = Pick<Window, MainWorldApiKeys>;

