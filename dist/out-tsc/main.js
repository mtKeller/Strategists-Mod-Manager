"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        darkTheme: true,
        show: false
    });
    win.loadURL('http://localhost:4200');
    win.once('ready-to-show', function () {
        win.show();
    });
}
electron_1.app.on('ready', createWindow);
electron_1.ipcMain.on('CLOSE_WINDOW', function (event, args) {
    console.log('CLOSE_WINDOW');
    win.close();
    event.sender.send('HIT', 'ME');
});
var FunctionLib = /** @class */ (function () {
    function FunctionLib() {
        this.readFile = function () {
            fs.readFile('package.json', function (err, data) {
                if (err) {
                    console.log('Error1', err);
                }
                console.log(data);
            });
        };
    }
    return FunctionLib;
}());
//# sourceMappingURL=main.js.map