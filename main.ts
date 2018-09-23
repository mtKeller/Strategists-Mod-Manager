import {app, BrowserWindow, ipcMain, dialog, EventEmitter} from 'electron';
const { execFile, fork  } = require('child_process');

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
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        if (action.payload[0]) {
            event.sender.send('FILE_READ', false);
        } else {
            if (action.payload[1]) {
                mhwDIR = action.payload[1];
            }
            event.sender.send('FILE_READ', action.payload[0]);
        }
    });
    fileSystem.send({
        type: 'READ_FILE',
        payload: args
    });
});

ipcMain.on('MAKE_PATH', (event, args) => {
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        event.sender.send('MADE_PATH', action.payload);
    });
    fileSystem.send({
        type: 'MAKE_PATH',
        payload: mhwDIR + args
    });
});

ipcMain.on('WRITE_FILE', (event, args) => {
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        if (!action.payload) {
            event.sender.send('WROTE_FILE', false);
        } else {
            event.sender.send('WROTE_FILE', true);
        }
    });
    fileSystem.send({
        type: 'WRITE_FILE',
        payload: args
    });
});

ipcMain.on('SAVE_STATE', (event, args) => {
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        if (!action.payload) {
            event.sender.send('SAVED_STATE', false);
        } else {
            event.sender.send('SAVED_STATE', true);
        }
    });
    fileSystem.send({
        type: 'SAVE_STATE',
        payload: args
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
    const watchDirNativePc = fork('./dist/out-tsc/watchDir.js');
    watchDirNativePc.on('message', (action) => {
        event.sender.send('DIR_CHANGED', action.payload);
    });
    watchDirNativePc.send({
        payload: [mhwDIR + '\\nativePC\\', 'nativePC']
    });

    const watchDirModFolder = fork('watchDir.js');
    watchDirNativePc.on('message', (action) => {
        event.sender.send('DIR_CHANGED', action.payload);
    });
    watchDirNativePc.send({
        payload: [mhwDIR + '\\modFolder\\', 'modFolder']
    });
});

let nativePcExists = false;
let modFolderExists = false;

ipcMain.on('READ_DIR', (event, args) => {
    console.log('CHECK: ', mhwDIR);
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        nativePcExists = action.payload[1];
        modFolderExists = action.payload[2];
        event.sender.send('DIR_READ', action.payload[0]);
    });
    fileSystem.send({
        type: 'READ_DIR',
        payload: [mhwDIR, nativePcExists, modFolderExists]
    });
});

ipcMain.on('GET_NATIVE_PC_MAP', (event, args) => {
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        event.sender.send('GOT_NATIVE_PC_MAP', action.payload);
    });
    fileSystem.send({
        type: 'GET_NATIVE_PC_MAP',
        payload: mhwDIR
    });
});

ipcMain.on('GET_MOD_FOLDER_MAP', (event, args) => {
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        event.sender.send('GOT_MOD_FOLDER_MAP', action.payload);
    });
    fileSystem.send({
        type: 'GET_MOD_FOLDER_MAP',
        payload: mhwDIR
    });
});

ipcMain.on('CREATE_MOD_DIRS', (event, args) => {
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        event.sender.send('CREATED_MOD_DIRS', action.payload);
    });
    fileSystem.send({
        type: 'CREATE_MOD_DIRS',
        payload: mhwDIR
    });
});

ipcMain.on('ZIP_DIR', (event, args) => {
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        event.sender.send('ZIPPED_DIR', action.payload);
    });
    fileSystem.send({
        type: 'ZIP_DIR',
        payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
    });
});

ipcMain.on('ZIP_FILES', (event, args) => {
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        event.sender.send('ZIPPED_FILES', action.payload);
    });
    fileSystem.send({
        type: 'ZIP_FILES',
        payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
    });
});

ipcMain.on('EXEC_PROCESS', (event, args) => {
    console.log('Attempting to execute: ', args);
    execFile(args, null, function(err, data) {
        console.log(err);
        console.log(data.toString());
    });
});

function downloadFile(file_url , targetPath, fileName) {
    const fileSystem = fork('./dist/out-tsc/fileSystem.js');
    fileSystem.on('message', (action) => {
        switch (action.type) {
            case 'DOWNLOAD_MANAGER_START' : {
                win.focus();
                win.webContents.send('DOWNLOAD_MANAGER_START', fileName);
                break;
            }
            case 'DOWNLOAD_MANAGER_UPDATE' : {
                win.webContents.send('DOWNLOAD_MANAGER_UPDATE', [action.payload[0], action.payload[1]]);
                break;
            }
            case 'DOWNLOAD_MANAGER_END' : {
                win.webContents.send('DOWNLOAD_MANAGER_END', action.payload);
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
            downloadFile(item.getURL(), mhwDIR + '\\modFolder\\' + item.getFilename(), item.getFilename());
            item.cancel();
        });
    };

    createChildWindow();
});
