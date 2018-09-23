import { app, BrowserWindow } from 'electron';
import { initIPC } from './ipc';

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
}

app.on('ready', createWindow);
initIPC(win);
