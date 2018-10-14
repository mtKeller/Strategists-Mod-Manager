"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fsForkManager_class_1 = require("./fsForkManager.class");
var _a = require('child_process'), execFile = _a.execFile, fork = _a.fork;
var path = require('path');
var url = require('url');
var fileSystemManager = null;
var mhwDIR = '';
var watchFork = null;
var watchingNative = false;
var watchingModFolder = false;
function initIPC(win, ele) {
    var electron = ele;
    var window = win;
    electron_1.ipcMain.setMaxListeners(50);
    electron_1.ipcMain.on('INIT', function (event) {
        console.log('INIT');
        if (fileSystemManager === null) {
            fileSystemManager = new fsForkManager_class_1.ForkFileSystemManager(fork);
        }
        event.sender.send('INITIALIZED', null);
    });
    // ipcMain.on('EXIT', () => {
    //     console.log('EXIT');
    //     fileSystemManager.kill();
    //     fileSystemManager = null;
    // });
    electron_1.ipcMain.on('CLOSE_WINDOW', function (event, args) {
        console.log('CLOSE_WINDOW');
        window.close();
        fileSystemManager.kill();
        electron_1.app.exit();
        process.exit();
        event.sender.send('HIT', 'ME');
    });
    electron_1.ipcMain.on('MINIMIZE_WINDOW', function (event, args) {
        console.log('MINIMIZE_WINDOW');
        window.minimize();
        event.sender.send('HIT', 'ME');
    });
    electron_1.ipcMain.on('OPEN_DIRECTORY', function (event, args) {
        var success = electron_1.shell.openItem(args);
        if (success) {
            event.sender.send('OPENED_DIRECTORY', true);
        }
        else {
            event.sender.send('OPENED_DIRECTORY', false);
        }
    });
    electron_1.ipcMain.on('READ_FILE', function (event, args) {
        console.log(fileSystemManager);
        fileSystemManager.io({
            type: 'READ_FILE',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'FILE_READ': {
                    if (action.payload[0] === false) {
                        event.sender.send('FILE_READ', false);
                    }
                    else {
                        if (typeof action.payload[1] !== 'boolean' && action.payload[1] !== undefined) {
                            if (mhwDIR === '') {
                                mhwDIR = action.payload[1];
                            }
                        }
                        event.sender.send('FILE_READ', action.payload[0]);
                    }
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('MAKE_PATH', function (event, args) {
        fileSystemManager.io({
            type: 'MAKE_PATH',
            payload: mhwDIR + args
        }, function (action) {
            switch (action.type) {
                case 'MADE_PATH': {
                    event.sender.send('MADE_PATH', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('WRITE_FILE', function (event, args) {
        fileSystemManager.io({
            type: 'WRITE_FILE',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'WROTE_FILE': {
                    if (!action.payload) {
                        event.sender.send('WROTE_FILE', false);
                    }
                    else {
                        event.sender.send('WROTE_FILE', true);
                    }
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('SAVE_STATE', function (event, args) {
        fileSystemManager.io({
            type: 'SAVE_STATE',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'SAVED_STATE': {
                    if (!action.payload) {
                        event.sender.send('SAVED_STATE', false);
                    }
                    else {
                        event.sender.send('SAVED_STATE', true);
                    }
                    break;
                }
                default: { }
            }
        });
    });
    var findDir = function (event) {
        console.log('ENTERED');
        electron_1.dialog.showOpenDialog({
            properties: ['openDirectory']
        }, function (data) {
            if (data === undefined || data === null) {
                window.close();
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
        if (watchFork === null) {
            watchFork = fork('./dist/out-tsc/electronSrc/watchDir.js');
            watchFork.on('message', function (action) {
                // console.log('DIR_CHANGED', action.payload);
                event.sender.send('DIR_CHANGED', action.payload);
            });
        }
        if (!watchingNative) {
            watchFork.send({
                payload: [mhwDIR + '\\nativePC\\', 'nativePC']
            });
            watchingNative = true;
        }
        if (!watchingModFolder) {
            watchFork.send({
                payload: [mhwDIR + '\\modFolder\\', 'modFolder']
            });
            watchingModFolder = true;
        }
    });
    var nativePcExists = false;
    var modFolderExists = false;
    electron_1.ipcMain.on('READ_DIR', function (event, args) {
        fileSystemManager.io({
            type: 'READ_DIR',
            payload: [mhwDIR, nativePcExists, modFolderExists]
        }, function (action) {
            switch (action.type) {
                case 'DIR_READ': {
                    nativePcExists = action.payload[1];
                    modFolderExists = action.payload[2];
                    event.sender.send('DIR_READ', action.payload[0]);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('COPY_MOVE_FILE', function (event, args) {
        fileSystemManager.io({
            type: 'COPY_MOVE_FILE',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'COPY_MOVED_FILE': {
                    event.sender.send('COPY_MOVED_FILE', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('DELETE_FILE', function (event, args) {
        fileSystemManager.io({
            type: 'DELETE_FILE',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'DELETED_FILE': {
                    event.sender.send('DELETED_FILE', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('DELETE_DIRECTORY', function (event, args) {
        fileSystemManager.io({
            type: 'DELETE_DIRECTORY',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'DELETED_DIRECTORY': {
                    event.sender.send('DELETED_DIRECTORY', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('MAP_DIRECTORY', function (event, args) {
        fileSystemManager.io({
            type: 'MAP_DIRECTORY',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'GOT_NATIVE_PC_MAP': {
                    event.sender.send('MAPPED_DIRECTORY', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('MAP_DIRECTORY_THEN_APPEND_PAYLOAD', function (event, args) {
        fileSystemManager.io({
            type: 'MAP_DIRECTORY_THEN_APPEND_PAYLOAD',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'MAPPED_DIRECTORY_NOW_APPEND_PAYLOAD': {
                    event.sender.send('MAPPED_DIRECTORY_NOW_APPEND_PAYLOAD', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('GET_NATIVE_PC_MAP', function (event, args) {
        fileSystemManager.io({
            type: 'GET_NATIVE_PC_MAP',
            payload: mhwDIR
        }, function (action) {
            switch (action.type) {
                case 'GOT_NATIVE_PC_MAP': {
                    event.sender.send('GOT_NATIVE_PC_MAP', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('GET_MOD_FOLDER_MAP', function (event, args) {
        fileSystemManager.io({
            type: 'GET_MOD_FOLDER_MAP',
            payload: mhwDIR
        }, function (action) {
            switch (action.type) {
                case 'GOT_MOD_FOLDER_MAP': {
                    // console.log('CHECK THIS 2', action.payload);
                    event.sender.send('GOT_MOD_FOLDER_MAP', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('CREATE_MOD_DIRS', function (event, args) {
        fileSystemManager.io({
            type: 'CREATE_MOD_DIRS',
            payload: mhwDIR
        }, function (action) {
            switch (action.type) {
                case 'CREATED_MOD_DIRS': {
                    event.sender.send('CREATED_MOD_DIRS', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('ZIP_DIR', function (event, args) {
        fileSystemManager.io({
            type: 'ZIP_DIR',
            payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
        }, function (action) {
            switch (action.type) {
                case 'ZIPPED_DIR': {
                    event.sender.send('ZIPPED_DIR', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('ZIP_FILES', function (event, args) {
        fileSystemManager.io({
            type: 'ZIP_FILES',
            payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
        }, function (action) {
            switch (action.type) {
                case 'ZIPPED_FILES': {
                    event.sender.send('ZIPPED_FILES', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('VIEW_ZIPPED_CONTENTS', function (event, args) {
        fileSystemManager.io({
            type: 'VIEW_ZIPPED_CONTENTS',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'VIEWED_ZIPPED_CONTENTS': {
                    event.sender.send('VIEWED_ZIPPED_CONTENTS', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('VIEW_7ZIPPED_CONTENTS', function (event, args) {
        fileSystemManager.io({
            type: 'VIEW_7ZIPPED_CONTENTS',
            payload: args
        }, function (action) {
            switch (action.type) {
                case 'VIEWED_7ZIPPED_CONTENTS': {
                    event.sender.send('VIEWED_7ZIPPED_CONTENTS', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('UNZIP_FILE', function (event, args) {
        fileSystemManager.io({
            type: 'UNZIP_FILE',
            payload: [args[0], args[1]]
        }, function (action) {
            switch (action.type) {
                case 'UNZIPPED_FILE': {
                    event.sender.send('UNZIPPED_FILE', action.payload);
                    break;
                }
                default: { }
            }
        });
    });
    electron_1.ipcMain.on('EXEC_PROCESS', function (event, args) {
        console.log('Attempting to execute: ', args);
        execFile(args, null, function (err, data) {
            console.log(err);
            console.log(data.toString());
        });
    });
    electron_1.ipcMain.on('UNRAR_FILE', function (event, args) {
        var pathToUnrar = __dirname.split('\\dist\\')[0] + '\\UnRAR.exe';
        // console.log('UNRAR_FILE: ', pathToUnrar, ['x', args[0], args[1]]);
        console.log('UNRAR_FILE', args);
        execFile(pathToUnrar, ['x', args[0], args[1]], function (err, data) {
            console.log('MADE IT INSIDE OF CB');
            if (err) {
                console.log('send false', err);
                event.sender.send('UNRARED_FILE', false);
            }
            else {
                console.log('SEND');
                event.sender.send('UNRARED_FILE', true);
            }
        });
    });
    electron_1.ipcMain.on('UN7ZIP_FILE', function (event, args) {
        var pathToUnrar = __dirname.split('\\dist\\')[0] + '\\7-Zip\\7z.exe';
        // console.log('UNRAR_FILE: ', pathToUnrar, ['x', args[0], args[1]]);
        execFile(pathToUnrar, ['x', args[0], args[1]], function (err, data) {
            console.log('MADE IT INSIDE OF CB');
            if (err) {
                console.log(err);
                event.sender.send('UN7ZIPPED_FILE', false);
            }
            else {
                event.sender.send('UN7ZIPPED_FILE', true);
            }
        });
    });
    var modDetails = null;
    function downloadFile(file_url, targetPath, fileName) {
        fileSystemManager.io({
            type: 'DOWNLOAD_FILE',
            payload: [file_url, targetPath, fileName]
        }, function (action) {
            switch (action.type) {
                case 'DOWNLOAD_MANAGER_START': {
                    window.focus();
                    console.log('MOD DETAILS', modDetails);
                    window.webContents.send('DOWNLOAD_MANAGER_START', [action.payload, modDetails]);
                    break;
                }
                case 'DOWNLOAD_MANAGER_UPDATE': {
                    window.webContents.send('DOWNLOAD_MANAGER_UPDATE', [action.payload[0], action.payload[1]]);
                    break;
                }
                case 'DOWNLOAD_MANAGER_END': {
                    window.webContents.send('DOWNLOAD_MANAGER_END', action.payload);
                    break;
                }
                default: { }
            }
        });
    }
    var childWindow = null;
    electron_1.ipcMain.on('OPEN_MOD_NEXUS', function (event, args) {
        if (childWindow === null) {
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
                    }
                });
                // childWindow.loadURL('https://www.nexusmods.com/monsterhunterworld');
                // console.log(__dirname);
                var pathToIndex = __dirname.split('\\dist\\')[0] + '\\electronSrc\\index.html';
                childWindow.loadURL(url.format({
                    pathname: pathToIndex,
                    protocol: 'file:',
                    slashes: true
                }));
                childWindow.once('ready-to-show', function () {
                    childWindow.show();
                });
                childWindow.on('close', function () {
                    childWindow = null;
                });
                childWindow.webContents.session.on('will-download', function (even, item, webContents) {
                    childWindow.webContents.send('SCRAPE_MOD_DETAILS', null);
                    console.log('HIT');
                    var itemURL = item.getURL();
                    var itemFileName = item.getFilename();
                    item.cancel();
                    electron_1.ipcMain.once('STORE_MOD_DETAILS', function (eve, payload) {
                        console.log('STORE_MOD_DETAILS TRIGGERED');
                        if (payload !== null && payload !== undefined) {
                            console.log('CHECK', payload.modDescription);
                            modDetails = payload;
                            downloadFile(itemURL, mhwDIR + '\\modFolder\\' + itemFileName, itemFileName);
                        }
                    });
                });
            };
            createChildWindow();
        }
        else {
            childWindow.focus();
        }
    });
    electron_1.ipcMain.on('FOUND_MOD_PAGE', function (event, args) {
        // console.log('HIT FOUND MOD PAGE');
        if (childWindow !== null) {
            childWindow.webContents.send('SCRAPE_MOD_DETAILS', args);
        }
    });
    electron_1.ipcMain.on('STORE_MOD_DETAILS', function (event, args) {
        // console.log(args);
        if (args !== null && args !== undefined) {
            modDetails = args;
        }
    });
    return {
        getChildWindow: function () {
            return childWindow;
        },
        nullChildWindow: function () {
            childWindow = null;
        }
    };
}
exports.initIPC = initIPC;
//# sourceMappingURL=ipc.js.map