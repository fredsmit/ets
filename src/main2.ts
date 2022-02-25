
import {
    app, BrowserWindow, ipcMain, ipcRenderer, dialog,
    HandlerDetails, BrowserWindowConstructorOptions,
    Menu, MenuItem, MenuItemConstructorOptions,
    type WebContents
} from 'electron';

//ipcMain.addListener();
ipcMain.on('show-context-menu', (ev: Electron.IpcMainEvent, ...args: unknown[]) => {
    const webContents: WebContents = ev.sender;
    if (webContents) {
        const template: (MenuItemConstructorOptions | MenuItem)[] = [
            {
                label: 'Menu Item 1',
                click: () => { ev.sender.send('context-menu-command', 'menu-item-1') }
            },
            { type: 'separator' },
            { label: 'Menu Item 2', type: 'checkbox', checked: true },
            { type: 'separator' },
            { label: `Text: ${args[0]}`, type: 'checkbox', checked: false }
        ]

        const menu = Menu.buildFromTemplate(template);
        const browserWindow = BrowserWindow.fromWebContents(webContents);
        if (browserWindow) {
            menu.popup({
                window: browserWindow
            });
        }
    }
});

export { };
