"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("mz/fs");
var callbackFs = require("fs");
var path = require('path');
var chokidar = require('chokidar');
var archiver = require('archiver');
var _a = require('child_process'), execFile = _a.execFile, spawn = _a.spawn;
var request = require('request');
var mkdirp = require('mkdirp');
var glob = require('glob');
var mhwDIR = '';
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
electron_1.ipcMain.on('CLOSE_WINDOW', function (event, args) {
    win.close();
    electron_1.app.exit();
    event.sender.send('HIT', 'ME');
});
electron_1.ipcMain.on('READ_FILE', function (event, args) {
    console.log(args);
    fs.readFile(args)
        .then(function (data) {
        var parsedData = JSON.parse(data.toString('utf8'));
        if (args === 'appState.json') {
            var tempStore = (parsedData.MainState.mhwDirectoryPath || false);
            if (tempStore) {
                mhwDIR = tempStore;
            }
        }
        console.log('check', parsedData, mhwDIR);
        event.sender.send('FILE_READ', parsedData);
    })
        .catch(function (err) {
        console.log('ERROR', err);
        event.sender.send('FILE_READ', false);
    });
});
electron_1.ipcMain.on('MAKE_PATH', function (event, args) {
    mkdirp(mhwDIR + args);
});
electron_1.ipcMain.on('WRITE_FILE', function (event, args) {
    console.log('WRITE FILE: ', args);
    callbackFs.writeFile(args[0], JSON.stringify(args[1], null, 2), function (err) {
        console.log('WRITING_FILE', args);
        if (err) {
            console.log('ERROR', err);
            event.sender.send('WROTE_FILE', false);
        }
        else {
            event.sender.send('WROTE_FILE', true);
        }
    });
});
electron_1.ipcMain.on('SAVE_STATE', function (event, args) {
    callbackFs.writeFile(args[0], JSON.stringify(args[1], null, 2), function (err) {
        // console.log('WRITING_FILE', args);
        if (err) {
            console.log('ERROR', err);
            event.sender.send('SAVED_STATE', true);
        }
        else {
            event.sender.send('SAVED_STATE', false);
        }
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
    // console.log('INIT_DIR_WATCH', args);
    var watcher = chokidar.watch(args + '\\nativePC\\', { persistent: true, interval: 100 });
    watcher.on('all', function (eve, p) {
        // console.log(event, p);
        event.sender.send('DIR_CHANGED', 'nativePC');
    });
    watcher.on('error', function (err) {
        console.log('watcher error', err);
        event.sender.send('DIR_CHANGED', 'nativePC');
    });
});
function flatten(lists) {
    return lists.reduce(function (a, b) { return a.concat(b); }, []);
}
function getDirectories(srcpath) {
    console.log(srcpath);
    return fs.readdirSync(srcpath)
        .map(function (file) { return path.join(srcpath, file); })
        .filter(function (p) { return fs.statSync(p).isDirectory(); })
        .filter(function (name) {
        if (name.indexOf('chunk') <= -1) {
            return true;
        }
        return false;
    });
}
function getDirectoriesRecursive(srcpath) {
    return [srcpath].concat(flatten(getDirectories(srcpath).map(getDirectoriesRecursive)));
}
var nativePcExists = false;
var modFolderExists = false;
electron_1.ipcMain.on('READ_DIR', function (event, args) {
    var newMap = getDirectoriesRecursive(mhwDIR);
    if (!nativePcExists) {
        for (var i = 0; i < newMap.length; i++) {
            if (newMap[i].indexOf('nativePC') > -1) {
                nativePcExists = true;
            }
            if (newMap[i].indexOf('modFolder') > -1) {
                modFolderExists = true;
            }
        }
        if (!nativePcExists || !modFolderExists) {
            mkdirp(mhwDIR + '\\nativePC\\', function (err) {
                mkdirp(mhwDIR + '\\modFolder\\temp\\', function (error) {
                    newMap = getDirectoriesRecursive(mhwDIR);
                    event.sender.send('DIR_READ', newMap);
                });
            });
        }
    }
    event.sender.send('DIR_READ', newMap);
});
function getDirContents(src, cb) {
    glob(src + '/**/*', cb);
}
electron_1.ipcMain.on('GET_NATIVE_PC_MAP', function (event, args) {
    getDirContents(mhwDIR + '\\nativePC\\', function (er, files) {
        event.sender.send('GOT_NATIVE_PC_MAP', files);
    });
});
electron_1.ipcMain.on('GET_MOD_FOLDER_MAP', function (event, args) {
    getDirContents(mhwDIR + '\\modFolder\\', function (er, files) {
        event.sender.send('GOT_MOD_FOLDER_MAP', files);
    });
});
electron_1.ipcMain.on('CREATE_MOD_DIRS', function (event, args) {
    console.log('CREATING MODDING DIRS');
    mkdirp(mhwDIR + '\\nativePC\\', function (err) {
        mkdirp(mhwDIR + '\\modFolder\\temp\\', function (error) {
            event.sender.send('CREATED_MOD_DIRS', true);
        });
    });
});
var MOD_FOLDER = __dirname.split('\\dist\\out-tsc\\')[0] + '/' + 'mods';
electron_1.ipcMain.on('ZIP_DIR', function (event, args) {
    try {
        var fileName = args[0];
        var dirPath = args[1];
        var output = fs.createWriteStream(MOD_FOLDER + '/' + fileName + '.zip');
        var archive_1 = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });
        output.on('close', function () {
            console.log(archive_1.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            event.sender.send('ZIPPED_DIR', true);
        });
        output.on('end', function () {
            console.log('Data has been drained');
        });
        archive_1.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            }
            else {
                // throw error
                throw err;
            }
        });
        archive_1.on('error', function (err) {
            event.sender.send('ZIPPED_FILE', true);
            throw err;
        });
        archive_1.pipe(output);
        var startDir = '';
        if (typeof dirPath === 'string') {
            var dirPathSplit = dirPath.split('/');
            if (dirPathSplit[dirPathSplit.length - 1] === '') {
                startDir = dirPathSplit[dirPathSplit.length - 2];
            }
            else {
                startDir = dirPathSplit[dirPathSplit.length - 1];
            }
            archive_1.directory(dirPath, startDir);
            archive_1.finalize();
        }
        else {
            for (var i = 0; i < dirPath.length; i++) {
                var modPathSplit = dirPath[i].split('/');
                if (modPathSplit[modPathSplit.length - 1] === '') {
                    startDir = modPathSplit[dirPath.length - 2];
                }
                else {
                    startDir = modPathSplit[dirPath.length - 1];
                }
                archive_1.directory(dirPath, startDir);
                archive_1.finalize();
            }
        }
    }
    catch (err) {
        event.sender.send('MOD_ZIPPED', false);
        throw err;
    }
});
electron_1.ipcMain.on('ZIP_FILES', function (event, args) {
    try {
        var fileName = args[0];
        var filePaths = args[1];
        var output = fs.createWriteStream(MOD_FOLDER + '/' + fileName + '.zip');
        var archive_2 = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });
        output.on('close', function () {
            console.log(archive_2.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            event.sender.send('ZIPPED_FILES', true);
        });
        output.on('end', function () {
            console.log('Data has been drained');
        });
        archive_2.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            }
            else {
                // throw error
                throw err;
            }
        });
        archive_2.on('error', function (err) {
            event.sender.send('ZIPPED_FILES', true);
            throw err;
        });
        archive_2.pipe(output);
        for (var i = 0; i < filePaths; i++) {
            var file = filePaths[i];
            archive_2.append(fs.createReadStream(file), { name: file.split('Monster Hunter World\\')[1] });
        }
        archive_2.finalize();
    }
    catch (err) {
        event.sender.send('ZIPPED_FILES', false);
        throw err;
    }
});
electron_1.ipcMain.on('EXEC_PROCESS', function (event, args) {
    console.log('Attempting to execute: ', args);
    execFile(args, null, function (err, data) {
        console.log(err);
        console.log(data.toString());
    });
});
function showProgress(received, total) {
    var percentage = (received * 100) / total;
    return percentage;
}
function downloadFile(file_url, targetPath, fileName) {
    // Save variable to know progress
    var received_bytes = 0;
    var total_bytes = 0;
    var req = request({
        method: 'GET',
        uri: file_url
    });
    var out = fs.createWriteStream(targetPath);
    req.pipe(out);
    req.on('response', function (data) {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length'], null);
        win.focus();
        win.webContents.send('DOWNLOAD_MANAGER_START', fileName);
    });
    req.on('data', function (chunk) {
        // Update the received bytes
        received_bytes += chunk.length;
        win.webContents.send('DOWNLOAD_MANAGER_UPDATE', [fileName, showProgress(received_bytes, total_bytes)]);
    });
    req.on('end', function () {
        console.log('File successfully downloaded');
        win.webContents.send('DOWNLOAD_MANAGER_END', fileName);
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
            // item.setSavePath('./mods/');
            // item.on('updated', (eve, state) => {
            //     if (state === 'interrupted') {
            //       console.log('Download is interrupted but can be resumed');
            //     } else if (state === 'progressing') {
            //       if (item.isPaused()) {
            //         console.log('Download is paused');
            //       } else {
            //         console.log(`Received bytes: ${item.getReceivedBytes()}`);
            //       }
            //     }
            // });
            // item.once('done', (eve, state) => {
            // if (state === 'completed') {
            //     console.log('Download successfully');
            // } else {
            //     console.log(`Download failed: ${state}`);
            // }
            // });
            downloadFile(item.getURL(), mhwDIR + '\\modFolder\\' + item.getFilename(), item.getFilename());
            item.cancel();
        });
    };
    createChildWindow();
});
//# sourceMappingURL=main.1.js.map