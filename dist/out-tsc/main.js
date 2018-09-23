"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var ipc_1 = require("./electronSrc/ipc");
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
}
electron_1.app.on('ready', createWindow);
ipc_1.initIPC(win);
//# sourceMappingURL=main.js.map