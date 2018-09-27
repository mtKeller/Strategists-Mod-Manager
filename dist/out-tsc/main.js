"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ipc_1 = require("./electronSrc/ipc");
require('events').EventEmitter.prototype._maxListeners = 100;
var win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        darkTheme: true,
        show: false
    });
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
    win.once('ready-to-show', function () {
        win.show();
    });
    ipc_1.initIPC(win, electron_1.app);
}
electron_1.app.on('ready', createWindow);
//# sourceMappingURL=main.js.map