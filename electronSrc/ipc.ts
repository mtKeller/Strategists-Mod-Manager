import {app, BrowserWindow, ipcMain, dialog, shell} from 'electron';
import {ForkFileSystemManager} from './fsForkManager.class';
const { execFile, fork } = require('child_process');
const path = require('path');
const url = require('url');

let fileSystemManager = null;
let mhwDIR = '';
let watchFork = null;
let watchingNative = false;
let watchingModFolder = false;

export function initIPC(win, ele) {
    const electron = ele;
    const window = win;


    ipcMain.setMaxListeners(50);

    ipcMain.on('INIT', (event) => {
        console.log('INIT');
        if ( fileSystemManager === null) {
            fileSystemManager = new ForkFileSystemManager(fork);
        }
        event.sender.send('INITIALIZED', null);
    });

    // ipcMain.on('EXIT', () => {
    //     console.log('EXIT');
    //     fileSystemManager.kill();
    //     fileSystemManager = null;
    // });

    ipcMain.on('CLOSE_WINDOW', (event, args) => {
        console.log('CLOSE_WINDOW');
        window.close();
        fileSystemManager.kill();
        app.exit();
        process.exit();
        event.sender.send('HIT', 'ME');
    });

    ipcMain.on('MINIMIZE_WINDOW', (event, args) => {
        console.log('MINIMIZE_WINDOW');
        window.minimize();
        event.sender.send('HIT', 'ME');
    });

    ipcMain.on('OPEN_DIRECTORY', (event, args) => {
        const success = shell.openItem(args);
        if (success) {
            event.sender.send('OPENED_DIRECTORY', true);
        } else {
            event.sender.send('OPENED_DIRECTORY', false);
        }
    });

    ipcMain.on('READ_FILE', (event, args) => {
        console.log(fileSystemManager);
        fileSystemManager.io({
                type: 'READ_FILE',
                payload: args
            },
            (action) => {
                switch (action.type) {
                    case 'FILE_READ' : {
                        if (action.payload[0] === false) {
                            event.sender.send('FILE_READ', false);
                        } else {
                            if (typeof action.payload[1]  !== 'boolean' && action.payload[1]  !== undefined) {
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
            }
        );
    });

    ipcMain.on('MAKE_PATH', (event, args) => {
        fileSystemManager.io({
                type: 'MAKE_PATH',
                payload: mhwDIR + args
            },
            (action) => {
                switch (action.type) {
                    case 'MADE_PATH' : {
                        event.sender.send('MADE_PATH', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('WRITE_FILE', (event, args) => {
        fileSystemManager.io({
                type: 'WRITE_FILE',
                payload: args
            },
            (action) => {
                switch (action.type) {
                    case 'WROTE_FILE' : {
                        if (!action.payload) {
                            event.sender.send('WROTE_FILE', false);
                        } else {
                            event.sender.send('WROTE_FILE', true);
                        }
                        break;
                    }
                    default: { }
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
                switch (action.type) {
                    case 'SAVED_STATE' : {
                        if (!action.payload) {
                            event.sender.send('SAVED_STATE', false);
                        } else {
                            event.sender.send('SAVED_STATE', true);
                        }
                        break;
                    }
                    default: { }
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
                window.close();
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
        if (watchFork === null) {
            watchFork = fork('./dist/out-tsc/electronSrc/watchDir.js');
            watchFork.on('message', (action) => {
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

    let nativePcExists = false;
    let modFolderExists = false;

    ipcMain.on('READ_DIR', (event, args) => {
        fileSystemManager.io({
                type: 'READ_DIR',
                payload: [mhwDIR, nativePcExists, modFolderExists]
            },
            (action) => {
                switch (action.type) {
                    case 'DIR_READ' : {
                        nativePcExists = action.payload[1];
                        modFolderExists = action.payload[2];
                        event.sender.send('DIR_READ', action.payload[0]);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('COPY_MOVE_FILE', (event, args) => {
            fileSystemManager.io({
                type: 'COPY_MOVE_FILE',
                payload: args
            },
            (action) => {
                switch (action.type) {
                    case 'COPY_MOVED_FILE' : {
                        event.sender.send('COPY_MOVED_FILE', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('DELETE_FILE', (event, args) => {
            fileSystemManager.io({
                type: 'DELETE_FILE',
                payload: args
            },
            (action) => {
                switch (action.type) {
                    case 'DELETED_FILE' : {
                        event.sender.send('DELETED_FILE', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('DELETE_DIRECTORY', (event, args) => {
            fileSystemManager.io({
                type: 'DELETE_DIRECTORY',
                payload: args
            },
            (action) => {
                switch (action.type) {
                    case 'DELETED_DIRECTORY' : {
                        event.sender.send('DELETED_DIRECTORY', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('MAP_DIRECTORY', (event, args) => {
        fileSystemManager.io({
                type: 'MAP_DIRECTORY',
                payload: args
            },
            (action) => {
                switch (action.type) {
                    case 'GOT_NATIVE_PC_MAP' : {
                        event.sender.send('MAPPED_DIRECTORY', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('MAP_DIRECTORY_THEN_APPEND_PAYLOAD', (event, args) => {
        fileSystemManager.io({
                type: 'MAP_DIRECTORY_THEN_APPEND_PAYLOAD',
                payload: args
            },
            (action) => {
                switch (action.type) {
                    case 'MAPPED_DIRECTORY_NOW_APPEND_PAYLOAD' : {
                        event.sender.send('MAPPED_DIRECTORY_NOW_APPEND_PAYLOAD', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('GET_NATIVE_PC_MAP', (event, args) => {
        fileSystemManager.io({
                type: 'GET_NATIVE_PC_MAP',
                payload: mhwDIR
            },
            (action) => {
                switch (action.type) {
                    case 'GOT_NATIVE_PC_MAP' : {
                        event.sender.send('GOT_NATIVE_PC_MAP', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('GET_MOD_FOLDER_MAP', (event, args) => {
        fileSystemManager.io({
                type: 'GET_MOD_FOLDER_MAP',
                payload: mhwDIR
            },
            (action) => {
                switch (action.type) {
                    case 'GOT_MOD_FOLDER_MAP' : {
                        // console.log('CHECK THIS 2', action.payload);
                        event.sender.send('GOT_MOD_FOLDER_MAP', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('CREATE_MOD_DIRS', (event, args) => {
        fileSystemManager.io({
                type: 'CREATE_MOD_DIRS',
                payload: mhwDIR
            },
            (action) => {
                switch (action.type) {
                    case 'CREATED_MOD_DIRS' : {
                        event.sender.send('CREATED_MOD_DIRS', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('ZIP_DIR', (event, args) => {
        fileSystemManager.io({
                type: 'ZIP_DIR',
                payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
            },
            (action) => {
                switch (action.type) {
                    case 'ZIPPED_DIR' : {
                        event.sender.send('ZIPPED_DIR', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('ZIP_FILES', (event, args) => {
        fileSystemManager.io({
                type: 'ZIP_FILES',
                payload: [args[0], args[1], mhwDIR + '\\modFolder\\']
            },
            (action) => {
                switch (action.type) {
                    case 'ZIPPED_FILES' : {
                        event.sender.send('ZIPPED_FILES', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    });

    ipcMain.on('VIEW_ZIPPED_CONTENTS', (event, args) => {
        fileSystemManager.io({
            type: 'VIEW_ZIPPED_CONTENTS',
            payload: args
        }, (action) => {
            switch (action.type) {
                case 'VIEWED_ZIPPED_CONTENTS' : {
                    event.sender.send('VIEWED_ZIPPED_CONTENTS', action.payload);
                    break;
                }
                default: { }
            }
        });
    });

    ipcMain.on('VIEW_7ZIPPED_CONTENTS', (event, args) => {
        fileSystemManager.io({
            type: 'VIEW_7ZIPPED_CONTENTS',
            payload: args
        }, (action) => {
            switch (action.type) {
                case 'VIEWED_7ZIPPED_CONTENTS' : {
                    event.sender.send('VIEWED_7ZIPPED_CONTENTS', action.payload);
                    break;
                }
                default: { }
            }
        });
    });

    ipcMain.on('UNZIP_FILE', (event, args) => {
        fileSystemManager.io({
                type: 'UNZIP_FILE',
                payload: [args[0], mhwDIR, args[1]]
            },
            (action) => {
                switch (action.type) {
                    case 'UNZIPPED_FILE' : {
                        event.sender.send('UNZIPPED_FILE', action.payload);
                        break;
                    }
                    default: { }
                }
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

    ipcMain.on('UNRAR_FILE', (event, args) => {
        const pathToUnrar = __dirname.split('\\dist\\')[0] + '\\UnRAR.exe';
        // console.log('UNRAR_FILE: ', pathToUnrar, ['x', args[0], args[1]]);
        execFile(pathToUnrar, ['x', args[0], args[1]], function(err, data) {
            console.log('MADE IT INSIDE OF CB');
            if (err) {
                event.sender.send('UNRARED_FILE', false);
            } else {
                event.sender.send('UNRARED_FILE', true);
            }
        });
    });

    ipcMain.on('UN7ZIP_FILE', (event, args) => {
        const pathToUnrar = __dirname.split('\\dist\\')[0] + '\\7-Zip\\7z.exe';
        // console.log('UNRAR_FILE: ', pathToUnrar, ['x', args[0], args[1]]);
        execFile(pathToUnrar, ['x', args[0], args[1]], function(err, data) {
            console.log('MADE IT INSIDE OF CB');
            if (err) {
                event.sender.send('UN7ZIPPED_FILE', false);
            } else {
                event.sender.send('UN7ZIPPED_FILE', true);
            }
        });
    });

    let modDetails = null;

    function downloadFile(file_url , targetPath, fileName) {
        fileSystemManager.io({
                type: 'DOWNLOAD_FILE',
                payload: [file_url, targetPath, fileName]
            },
            (action) => {
                switch (action.type) {
                    case 'DOWNLOAD_MANAGER_START' : {
                        window.focus();
                        console.log('MOD DETAILS', modDetails);
                        window.webContents.send('DOWNLOAD_MANAGER_START', [action.payload, modDetails]);
                        break;
                    }
                    case 'DOWNLOAD_MANAGER_UPDATE' : {
                        window.webContents.send('DOWNLOAD_MANAGER_UPDATE', [action.payload[0], action.payload[1]]);
                        break;
                    }
                    case 'DOWNLOAD_MANAGER_END' : {
                        window.webContents.send('DOWNLOAD_MANAGER_END', action.payload);
                        break;
                    }
                    default: { }
                }
            }
        );
    }

    let childWindow = null;

    ipcMain.on('OPEN_MOD_NEXUS', (event, args) => {
        if (childWindow === null) {
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
                        // nodeIntegration: false
                    }
                });
                // childWindow.loadURL('https://www.nexusmods.com/monsterhunterworld');
                const pathToIndex = __dirname.split('\\dist\\')[0] + '\\electronSrc\\index.html';
                childWindow.loadURL(url.format({
                    pathname: pathToIndex,
                    protocol: 'file:',
                    slashes: true
                }));
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
        } else {
            childWindow.focus();
        }
    });

    ipcMain.on('FOUND_MOD_PAGE', (event, args) => {
        // console.log('HIT FOUND MOD PAGE');
        if (childWindow !== null) {
            childWindow.webContents.send('SCRAPE_MOD_DETAILS', args);
        }
    });


    ipcMain.on('STORE_MOD_DETAILS', (event, args) => {
        // console.log(args);
        if (args !== null && args !== undefined) {
            modDetails = args;
        }
    });

    return {
        getChildWindow : () => {
            return childWindow;
        },
        nullChildWindow : () => {
            childWindow = null;
        }
    };
}
