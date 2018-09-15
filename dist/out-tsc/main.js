"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("mz/fs");
var callbackFs = require("fs");
var path = require('path');
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
var mhwDIR = '';
electron_1.app.on('ready', createWindow);
electron_1.ipcMain.on('CLOSE_WINDOW', function (event, args) {
    win.close();
    electron_1.app.exit();
    event.sender.send('HIT', 'ME');
});
electron_1.ipcMain.on('READ_FILE', function (event, args) {
    fs.readFile(args)
        .then(function (data) {
        event.sender.send('FILE_READ', data);
    })
        .catch(function (err) {
        console.log('ERROR', err);
        event.sender.send('FILE_READ', false);
    });
});
electron_1.ipcMain.on('WRITE_FILE', function (event, args) {
    if (args.indexOf('.json') > -1) {
        callbackFs.writeFile(args, null, function (err) {
            console.log('WRITING_FILE', args);
            if (err) {
                console.log('ERROR', err);
                event.sender.send('WROTE_FILE', true);
            }
            else {
                event.sender.send('WROTE_FILE', false);
            }
        });
    }
});
var findDir = function (event) {
    console.log('ENTERED');
    electron_1.dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function (data) {
        console.log('Index of MHW', data[0].indexOf('Monster Hunter World') > -1);
        if (data === undefined) {
            win.close();
            electron_1.app.exit();
        }
        else if (data[0].indexOf('Monster Hunter World') > -1) {
            mhwDIR = data[0].slice(0, data[0]
                .indexOf('Monster Hunter World') + 20);
            event.sender.send('GOT_MHW_DIR_PATH', mhwDIR);
        }
        else {
            findDir(event);
        }
    });
};
electron_1.ipcMain.on('GET_MHW_DIR_PATH', function (event, args) {
    console.log("HIT");
    findDir(event);
});
function flatten(lists) {
    return lists.reduce(function (a, b) { return a.concat(b); }, []);
}
function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .map(function (file) { return path.join(srcpath, file); })
        .filter(function (p) { return fs.statSync(p).isDirectory(); })
        .filter(function (name) {
        if (name.indexOf('chunk') <= -1) {
            console.log(name);
            return true;
        }
        return false;
    });
}
function getDirectoriesRecursive(srcpath) {
    return [srcpath].concat(flatten(getDirectories(srcpath).map(getDirectoriesRecursive)));
}
electron_1.ipcMain.on('READ_DIR', function (event, args) {
    var newMap = getDirectoriesRecursive(mhwDIR);
    event.sender.send('DIR_READ', newMap);
});
//# sourceMappingURL=main.js.map