import { app, BrowserWindow } from 'electron';
import { initIPC } from './electronSrc/ipc';
require('events').EventEmitter.prototype._maxListeners = 500;

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 700,
        darkTheme: true,
        resizable: false,
        show: false,
        titleBarStyle: 'hidden',
        frame: false,
        alwaysOnTop: true
    });
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
    win.once('ready-to-show', () => {
        win.show();
    });
    const window = initIPC(win, app);

    win.on('closed', () => {
        win = null;
        if (window.getChildWindow() !== null) {
            window.nullChildWindow();
        }
    });
}

app.on('ready', createWindow);
