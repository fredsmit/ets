"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
//ipcMain.addListener();
electron_1.ipcMain.on('show-context-menu', (ev, ...args) => {
    const webContents = ev.sender;
    if (webContents) {
        const template = [
            {
                label: 'Menu Item 1',
                click: () => { ev.sender.send('context-menu-command', 'menu-item-1'); }
            },
            { type: 'separator' },
            { label: 'Menu Item 2', type: 'checkbox', checked: true },
            { type: 'separator' },
            { label: `Text: ${args[0]}`, type: 'checkbox', checked: false }
        ];
        const menu = electron_1.Menu.buildFromTemplate(template);
        const browserWindow = electron_1.BrowserWindow.fromWebContents(webContents);
        if (browserWindow) {
            menu.popup({
                window: browserWindow
            });
        }
    }
});
