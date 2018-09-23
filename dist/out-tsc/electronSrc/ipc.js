"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var _a = require('child_process'), execFile = _a.execFile, fork = _a.fork;
function initIPC(win) {
    var mhwDIR = '';
    electron_1.ipcMain.on('CLOSE_WINDOW', function (event, args) {
        win.close();
        electron_1.app.exit();
        event.sender.send('HIT', 'ME');
    });
    electron_1.ipcMain.on('READ_FILE', function (event, args) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            if (action.payload[0] === false) {
                event.sender.send('FILE_READ', false);
            }
            else {
                if (action.payload[1]) {
                    mhwDIR = action.payload[1];
                }
                event.sender.send('FILE_READ', action.payload[0]);
            }
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'READ_FILE',
            payload: args
        });
    });
    electron_1.ipcMain.on('MAKE_PATH', function (event, args) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            event.sender.send('MADE_PATH', action.payload);
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'MAKE_PATH',
            payload: mhwDIR + args
        });
    });
    electron_1.ipcMain.on('WRITE_FILE', function (event, args) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            if (!action.payload) {
                event.sender.send('WROTE_FILE', false);
            }
            else {
                event.sender.send('WROTE_FILE', true);
            }
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'WRITE_FILE',
            payload: args
        });
    });
    electron_1.ipcMain.on('SAVE_STATE', function (event, args) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            if (!action.payload) {
                event.sender.send('SAVED_STATE', false);
            }
            else {
                event.sender.send('SAVED_STATE', true);
            }
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'SAVE_STATE',
            payload: args
        });
    });
    var findDir = function (event) {
        console.log('ENTERED');
        electron_1.dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (data) {
            if (data === undefined || data === null) {
                win.close();
                electron_1.app.exit();
            }
            else if (data[0].indexOf('Monster Hunter World') > -1) {
                console.log('Index of MHW', data[0].indexOf('Monster Hunter World') > -1);
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
        console.log('HIT');
        findDir(event);
    });
    electron_1.ipcMain.on('INIT_DIR_WATCH', function (event, args) {
        var watchDirNativePc = fork('./dist/out-tsc/watchDir.js');
        watchDirNativePc.on('message', function (action) {
            event.sender.send('DIR_CHANGED', action.payload);
        });
        watchDirNativePc.send({
            payload: [mhwDIR + '\\nativePC\\', 'nativePC']
        });
        var watchDirModFolder = fork('./dist/out-tsc/watchDir.js');
        watchDirNativePc.on('message', function (action) {
            event.sender.send('DIR_CHANGED', action.payload);
        });
        watchDirNativePc.send({
            payload: [mhwDIR + '\\modFolder\\', 'modFolder']
        });
    });
    var nativePcExists = false;
    var modFolderExists = false;
    electron_1.ipcMain.on('READ_DIR', function (event, args) {
        console.log('CHECK: ', mhwDIR);
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            nativePcExists = action.payload[1];
            modFolderExists = action.payload[2];
            event.sender.send('DIR_READ', action.payload[0]);
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'READ_DIR',
            payload: [mhwDIR, nativePcExists, modFolderExists]
        });
    });
    electron_1.ipcMain.on('GET_NATIVE_PC_MAP', function (event, args) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            event.sender.send('GOT_NATIVE_PC_MAP', action.payload);
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'GET_NATIVE_PC_MAP',
            payload: mhwDIR
        });
    });
    electron_1.ipcMain.on('GET_MOD_FOLDER_MAP', function (event, args) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            event.sender.send('GOT_MOD_FOLDER_MAP', action.payload);
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'GET_MOD_FOLDER_MAP',
            payload: mhwDIR
        });
    });
    electron_1.ipcMain.on('CREATE_MOD_DIRS', function (event, args) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            event.sender.send('CREATED_MOD_DIRS', action.payload);
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'CREATE_MOD_DIRS',
            payload: mhwDIR
        });
    });
    electron_1.ipcMain.on('ZIP_DIR', function (event, args) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            event.sender.send('ZIPPED_DIR', action.payload);
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'ZIP_DIR',
            payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
        });
    });
    electron_1.ipcMain.on('ZIP_FILES', function (event, args) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            event.sender.send('ZIPPED_FILES', action.payload);
            fileSystem.kill('SIGINT');
        });
        fileSystem.send({
            type: 'ZIP_FILES',
            payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
        });
    });
    electron_1.ipcMain.on('EXEC_PROCESS', function (event, args) {
        console.log('Attempting to execute: ', args);
        execFile(args, null, function (err, data) {
            console.log(err);
            console.log(data.toString());
        });
    });
    function downloadFile(file_url, targetPath, fileName) {
        var fileSystem = fork('./dist/out-tsc/fileSystem.js');
        fileSystem.on('message', function (action) {
            switch (action.type) {
                case 'DOWNLOAD_MANAGER_START': {
                    win.focus();
                    win.webContents.send('DOWNLOAD_MANAGER_START', fileName);
                    break;
                }
                case 'DOWNLOAD_MANAGER_UPDATE': {
                    win.webContents.send('DOWNLOAD_MANAGER_UPDATE', [action.payload[0], action.payload[1]]);
                    break;
                }
                case 'DOWNLOAD_MANAGER_END': {
                    win.webContents.send('DOWNLOAD_MANAGER_END', action.payload);
                    fileSystem.kill('SIGINT');
                    break;
                }
                default: {
                    console.log('SHIT');
                }
            }
        });
        fileSystem.send({
            type: 'DOWNLOAD_FILE',
            payload: [file_url, targetPath, fileName]
        });
    }
    var childWindow;
    electron_1.ipcMain.on('OPEN_MOD_NEXUS', function (event, args) {
        console.log('ATTEMPTING TO OPEN MOD NEXUS WINDOW');
        var createChildWindow = function () {
            console.log('FIND PATH: ', electron_1.app.getAppPath());
            childWindow = new electron_1.BrowserWindow({
                width: 1500,
                height: 900,
                darkTheme: true,
                show: false,
                center: true,
                title: 'Mod Nexus: Monster Hunter World',
                webPreferences: {
                    nativeWindowOpen: true,
                    nodeIntegration: false
                }
            });
            childWindow.loadURL('https://www.nexusmods.com/monsterhunterworld');
            childWindow.once('ready-to-show', function () {
                childWindow.show();
            });
            childWindow.on('close', function () {
                childWindow = null;
            });
            childWindow.webContents.session.on('will-download', function (even, item, webContents) {
                downloadFile(item.getURL(), mhwDIR + '\\modFolder\\' + item.getFilename(), item.getFilename());
                item.cancel();
            });
        };
        createChildWindow();
    });
}
exports.initIPC = initIPC;
//# sourceMappingURL=ipc.js.map