import {app, BrowserWindow, ipcMain, dialog, EventEmitter} from 'electron';
import * as fs from 'mz/fs';
import * as callbackFs from 'fs';
const path = require('path');
const chokidar = require('chokidar');
const archiver = require('archiver');
const { execFile  } = require('child_process');
const request = require('request');
const mkdirp = require('mkdirp');

let mhwDIR = '';
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

ipcMain.on('CLOSE_WINDOW', (event, args) => {
    win.close();
    app.exit();
    event.sender.send('HIT', 'ME');
});

ipcMain.on('READ_FILE', (event, args) => {
    console.log(args);
    fs.readFile(args)
        .then((data) => {
            const parsedData = JSON.parse(data.toString('utf8'));
            if (args === 'appState.json') {
                const tempStore = (parsedData.MainState.mhwDirectoryPath || false);
                if (tempStore) {
                    mhwDIR = tempStore;
                }
            }
            console.log('check', parsedData, mhwDIR);
            event.sender.send('FILE_READ', parsedData);
        })
        .catch(err => {
            console.log('ERROR', err);
            event.sender.send('FILE_READ', false);
        });
});

ipcMain.on('MAKE_PATH', (event, args) => {
    mkdirp(mhwDIR + args);
});

ipcMain.on('WRITE_FILE', (event, args) => {
    console.log('WRITE FILE: ', args);
    callbackFs.writeFile(args[0], JSON.stringify(args[1], null, 2), (err) => {
        console.log('WRITING_FILE', args);
        if (err) {
            console.log('ERROR', err);
            event.sender.send('WROTE_FILE', false);
        } else {
            event.sender.send('WROTE_FILE', true);
        }
    });
});

ipcMain.on('SAVE_STATE', (event, args) => {
    callbackFs.writeFile(args[0], JSON.stringify(args[1], null, 2), (err) => {
        // console.log('WRITING_FILE', args);
        if (err) {
            console.log('ERROR', err);
            event.sender.send('SAVED_STATE', true);
        } else {
            event.sender.send('SAVED_STATE', false);
        }
    });
});

const findDir = function(event) {
    console.log('ENTERED');
    dialog.showOpenDialog({
        properties: ['openDirectory']
        }, (data) => {
        if (data === undefined || data === null) {
            win.close();
            app.exit();
        } else if (data[0].indexOf('Monster Hunter World') > -1) {
            console.log('Index of MHW', data[0].indexOf('Monster Hunter World') > -1);
            mhwDIR = data[0].slice(0, data[0]
                .indexOf('Monster Hunter World') + 20);
            event.sender.send('GOT_MHW_DIR_PATH', mhwDIR);
        } else {
            findDir(event);
        }
    });
};

ipcMain.on('GET_MHW_DIR_PATH', (event, args) => {
    console.log('HIT');
    findDir(event);
});

ipcMain.on('INIT_DIR_WATCH', (event, args) => {
    // console.log('INIT_DIR_WATCH', args);
    const watcher = chokidar.watch(args + '\\nativePC\\', {persistent: true, interval: 100});
    watcher.on('all', (eve, p) => {
        // console.log(event, p);
        event.sender.send('DIR_CHANGED', 'nativePC');
    });
    watcher.on('error', (err) => {
        console.log('watcher error', err);
        event.sender.send('DIR_CHANGED', 'nativePC');
    });
});

function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
    console.log(srcpath);
    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
        .filter(p => fs.statSync(p).isDirectory())
        .filter(name => {
            if (name.indexOf('chunk') <= -1) {
                return true;
            }
            return false;
    });
}

function getDirectoriesRecursive(srcpath) {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

let nativePcExists = false;
let modFolderExists = false;

ipcMain.on('READ_DIR', (event, args) => {
    let newMap = getDirectoriesRecursive(mhwDIR);
    if (!nativePcExists) {
        for (let i = 0; i < newMap.length; i++) {
            if (newMap[i].indexOf('nativePC') > -1) {
                nativePcExists = true;
            }
            if (newMap[i].indexOf('modFolder') > -1) {
                modFolderExists = true;
            }
        }
        if (!nativePcExists || !modFolderExists) {
            mkdirp(mhwDIR + '\\nativePC\\', (err) => {
                mkdirp(mhwDIR + '\\modFolder\\temp\\', (error) => {
                    newMap = getDirectoriesRecursive(mhwDIR);
                    event.sender.send('DIR_READ', newMap);
                });
            });
        }
    } else {
        event.sender.send('DIR_READ', newMap);
    }
    event.sender.send('DIR_READ', newMap);
});


ipcMain.on('CREATE_MOD_DIRS', (event, args) => {
    console.log('CREATING MODDING DIRS');
    mkdirp(mhwDIR + '\\nativePC\\', (err) => {
        mkdirp(mhwDIR + '\\modFolder\\temp\\', (error) => {
            event.sender.send('CREATED_MOD_DIRS', true);
        });
    });
});

const MOD_FOLDER = __dirname.split('\\dist\\out-tsc\\')[0] + '/' + 'mods';

ipcMain.on('ZIP_DIR', (event, args) => {
    try {
        const fileName = args[0];
        const dirPath = args[1];
        const output = fs.createWriteStream(MOD_FOLDER + '/' + fileName + '.zip');
        const archive = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });

        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            event.sender.send('ZIPPED_DIR', true);
        });
        output.on('end', function() {
            console.log('Data has been drained');
        });

        archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
        });

        archive.on('error', function(err) {
            event.sender.send('ZIPPED_FILE', true);
            throw err;
        });

        archive.pipe(output);

        let startDir = '';
        if (typeof dirPath === 'string') {
            const dirPathSplit = dirPath.split('/');
            if (dirPathSplit[dirPathSplit.length - 1] === '') {
                startDir = dirPathSplit[dirPathSplit.length - 2];
            } else {
                startDir = dirPathSplit[dirPathSplit.length - 1];
            }
            archive.directory(dirPath, startDir);
            archive.finalize();
        } else {
            for (let i = 0; i < dirPath.length; i++) {
                const modPathSplit = dirPath[i].split('/');
                if (modPathSplit[modPathSplit.length - 1] === '') {
                    startDir = modPathSplit[dirPath.length - 2];
                } else {
                    startDir = modPathSplit[dirPath.length - 1];
                }
                archive.directory(dirPath, startDir);
                archive.finalize();
            }
        }
    } catch (err) {
        event.sender.send('MOD_ZIPPED', false);
        throw err;
    }
});

ipcMain.on('ZIP_FILES', (event, args) => {
    try {
        const fileName = args[0];
        const filePaths = args[1];
        const output = fs.createWriteStream(MOD_FOLDER + '/' + fileName + '.zip');
        const archive = archiver('zip', {
            zlib: { level: 1 } // Sets the compression level.
        });

        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            event.sender.send('ZIPPED_FILES', true);
        });
        output.on('end', function() {
            console.log('Data has been drained');
        });

        archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
        });

        archive.on('error', function(err) {
            event.sender.send('ZIPPED_FILES', true);
            throw err;
        });

        archive.pipe(output);

        for (let i = 0; i < filePaths; i++) {
            const file = filePaths[i];
            archive.append(fs.createReadStream(file), { name: file.split('Monster Hunter World\\')[1] });
        }
        archive.finalize();
    } catch (err) {
        event.sender.send('ZIPPED_FILES', false);
        throw err;
    }
});

ipcMain.on('EXEC_PROCESS', (event, args) => {
    console.log('Attempting to execute: ', args);
    execFile(args, null, function(err, data) {
        console.log(err);
        console.log(data.toString());
    });
});

function showProgress(received, total) {
    const percentage = (received * 100) / total;
    return percentage;
}

function downloadFile(file_url , targetPath, fileName) {
    // Save variable to know progress
    let received_bytes = 0;
    let total_bytes = 0;

    const req = request({
        method: 'GET',
        uri: file_url
    });

    const out = fs.createWriteStream(targetPath);
    req.pipe(out);

    req.on('response', function ( data ) {
        // Change the total bytes value to get progress later.
        total_bytes = parseInt(data.headers['content-length'], null);
        win.focus();
        win.webContents.send('DOWNLOAD_MANAGER_START', fileName);
    });

    req.on('data', function(chunk) {
        // Update the received bytes
        received_bytes += chunk.length;

        win.webContents.send('DOWNLOAD_MANAGER_UPDATE', [fileName, showProgress(received_bytes, total_bytes)]) ;
    });

    req.on('end', function() {
        console.log('File successfully downloaded');
        win.webContents.send('DOWNLOAD_MANAGER_END', fileName);
    });
}

let childWindow;

ipcMain.on('OPEN_MOD_NEXUS', (event, args) => {
    console.log('ATTEMPTING TO OPEN MOD NEXUS WINDOW');

    const createChildWindow = function() {
        console.log('FIND PATH: ', app.getAppPath());
        childWindow = new BrowserWindow({
            width: 1500,
            height: 900,
            darkTheme: true,
            show: false,
            center: true,
            title: 'Mod Nexus: Monster Hunter World',
            webPreferences : {
                nativeWindowOpen: true,
                nodeIntegration: false
            }
        });
        childWindow.loadURL('https://www.nexusmods.com/monsterhunterworld');
        childWindow.once('ready-to-show', () => {
            childWindow.show();
        });
        childWindow.on('close', () => {
            childWindow = null;
        });
        childWindow.webContents.session.on('will-download', (even, item, webContents) => {
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

