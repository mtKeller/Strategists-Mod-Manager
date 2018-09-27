import { app, BrowserWindow } from 'electron';
import { initIPC } from './electronSrc/ipc';
require('events').EventEmitter.prototype._maxListeners = 500;

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        darkTheme: true,
        show: false
    });
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
    win.once('ready-to-show', () => {
        win.show();
    });
    initIPC(win, app);
}

app.on('ready', createWindow);
