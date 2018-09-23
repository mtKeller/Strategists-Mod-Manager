import {app, BrowserWindow, ipcMain, dialog} from 'electron';
import {ForkFileSystemManager} from './fsForkManager.class';
const { execFile, fork } = require('child_process');

export function initIPC(win) {
    let mhwDIR = '';
    const fileSystemManager = new ForkFileSystemManager(fork);

    ipcMain.on('CLOSE_WINDOW', (event, args) => {
        win.close();
        app.exit();
        event.sender.send('HIT', 'ME');
    });

    ipcMain.on('READ_FILE', (event, args) => {
        fileSystemManager.io({
                type: 'READ_FILE',
                payload: args
            },
            (action) => {
                if (action.payload[0] === false) {
                    event.sender.send('FILE_READ', false);
                } else {
                    if (action.payload[1]) {
                        mhwDIR = action.payload[1];
                    }
                    event.sender.send('FILE_READ', action.payload[0]);
                }
            }
        );
    });

    ipcMain.on('MAKE_PATH', (event, args) => {
        fileSystemManager.io({
                type: 'MAKE_PATH',
                payload: mhwDIR + args
            },
            (action) => {
                event.sender.send('MADE_PATH', action.payload);
            }
        );
    });

    ipcMain.on('WRITE_FILE', (event, args) => {
        fileSystemManager.io({
                type: 'WRITE_FILE',
                payload: args
            },
            (action) => {
                if (!action.payload) {
                    event.sender.send('WROTE_FILE', false);
                } else {
                    event.sender.send('WROTE_FILE', true);
                }
            }
        );
    });

    ipcMain.on('SAVE_STATE', (event, args) => {
        fileSystemManager.io({
                type: 'SAVE_STATE',
                payload: args
            },
            (action) => {
                if (!action.payload) {
                    event.sender.send('SAVED_STATE', false);
                } else {
                    event.sender.send('SAVED_STATE', true);
                }
            }
        );
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

        const watchDirModFolder = fork('./dist/out-tsc/watchDir.js');
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
        fileSystemManager.io({
                type: 'READ_DIR',
                payload: [mhwDIR, nativePcExists, modFolderExists]
            },
            (action) => {
                nativePcExists = action.payload[1];
                modFolderExists = action.payload[2];
                event.sender.send('DIR_READ', action.payload[0]);
            }
        );
    });

    ipcMain.on('GET_NATIVE_PC_MAP', (event, args) => {
        fileSystemManager.io({
                type: 'GET_NATIVE_PC_MAP',
                payload: mhwDIR
            },
            (action) => {
                event.sender.send('GOT_NATIVE_PC_MAP', action.payload);
            }
        );
    });

    ipcMain.on('GET_MOD_FOLDER_MAP', (event, args) => {
        fileSystemManager.io({
                type: 'GET_MOD_FOLDER_MAP',
                payload: mhwDIR
            },
            (action) => {
                event.sender.send('GOT_MOD_FOLDER_MAP', action.payload);
            }
        );
    });

    ipcMain.on('CREATE_MOD_DIRS', (event, args) => {
        fileSystemManager.io({
                type: 'CREATE_MOD_DIRS',
                payload: mhwDIR
            },
            (action) => {
                event.sender.send('CREATED_MOD_DIRS', action.payload);
            }
        );
    });

    ipcMain.on('ZIP_DIR', (event, args) => {
        fileSystemManager.io({
                type: 'ZIP_DIR',
                payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
            },
            (action) => {
                event.sender.send('ZIPPED_DIR', action.payload);
            }
        );
    });

    ipcMain.on('ZIP_FILES', (event, args) => {
        fileSystemManager.io({
                type: 'ZIP_FILES',
                payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
            },
            (action) => {
                event.sender.send('ZIPPED_FILES', action.payload);
            }
        );
    });

    ipcMain.on('EXEC_PROCESS', (event, args) => {
        console.log('Attempting to execute: ', args);
        execFile(args, null, function(err, data) {
            console.log(err);
            console.log(data.toString());
        });
    });

    function downloadFile(file_url , targetPath, fileName) {
        fileSystemManager.io({
                type: 'DOWNLOAD_FILE',
                payload: [file_url, targetPath, fileName]
            },
            (action) => {
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
            }
        );
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

}
