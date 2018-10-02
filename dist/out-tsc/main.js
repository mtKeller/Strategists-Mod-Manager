"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ipc_1 = require("./electronSrc/ipc");
require('events').EventEmitter.prototype._maxListeners = 500;
var win;
function createWindow() {
    win = new electron_1.BrowserWindow({
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
    win.once('ready-to-show', function () {
        win.show();
    });
    var window = ipc_1.initIPC(win, electron_1.app);
    win.on('closed', function () {
        win = null;
        if (window.getChildWindow() !== null) {
            window.nullChildWindow();
        }
    });
}
electron_1.app.on('ready', createWindow);
//# sourceMappingURL=main.js.map