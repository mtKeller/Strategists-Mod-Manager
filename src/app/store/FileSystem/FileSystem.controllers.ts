import { ActionController$ } from '../../model/ActionController';
import { Store, select } from '@ngrx/store';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const { ipcRenderer } = window.require('electron');

import { selectIpcActive } from '../Main/Main.selectors';
import { InitApp } from '../Main/Main.actions';
import { Action } from '@ngrx/store';

import * as FileSystemActions from './FileSystem.actions';

export function Initialize$(store: Store<any>) {
    const InitializationController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('INIT', null);
            ipcRenderer.once('INITIALIZED', (err, args) => {
                console.log('INITIALIZED', obs);
                obs.next(new InitApp());
                obs.complete();
            });
        }
    );
    return InitializationController$;
}

export function ReadFile$(store: Store<any>, action: Action) {
    const ReadFileController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('READ_FILE', action.tree.payload);
            ipcRenderer.once('FILE_READ', (event, args) => {
                // console.log('CHECK ARGS: ', args);
                if (args === false) {
                    obs.next(action.tree.failed(args));
                } else {
                    obs.next(action.tree.success(args));
                }
                obs.complete();
            });
        }
    );
    return ReadFileController$;
}

export function WriteFile$(store: Store<any>, action: Action) {
    const WriteFileController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            let payload;
            if (action.payload) {
                payload = action.payload;
            } else {
                payload = action.tree.payload;
            }
            ipcRenderer.send('WRITE_FILE', payload);
            ipcRenderer.once('WROTE_FILE', (err, args) => {
                console.log('Check in on args: ', args);
                if (args === false) {
                    obs.next(action.tree.failed(args));
                } else {
                    obs.next(action.tree.success(args));
                }
                obs.complete();
            });
        }
    );
    return WriteFileController$;
}

export function ZipDir$(store: Store<any>, action) {
    const ZipDirController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('ZIP_DIR', action.tree.payload);
            ipcRenderer.once('ZIPPED_DIR', (err, args) => {
                if (args === false) {
                    obs.next(action.tree.failed(args));
                } else {
                    obs.next(action.tree.success(args));
                }
                obs.complete();
            });
        }
    );
    return ZipDirController$;
}

export function ViewZippedContents$(store: Store<any>, action) {
    const ViewZippedContentsController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            let payload;
            if (action.payload) {
                payload = action.payload;
            } else {
                payload = action.tree.payload;
            }
            // console.log('TREE HIT PAYLOAD', action.tree.payload);
            // console.log('TREE HIT', payload);
            ipcRenderer.send('VIEW_ZIPPED_CONTENTS', payload);
            ipcRenderer.once('VIEWED_ZIPPED_CONTENTS', (err, args) => {
                // console.log('LIST', args);
                obs.next(action.tree.success({
                    ...action.tree.payload,
                    modMap: args
                }));
                obs.complete();
            });
        }
    );

    return ViewZippedContentsController$;
}

export function View7ZippedContents$(store: Store<any>, action) {
    const View7ZippedContentsController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            let payload;
            if (action.payload) {
                payload = action.payload;
            } else {
                payload = action.tree.payload;
            }
            // console.log('TREE HIT PAYLOAD', action.tree.payload);
            // console.log('TREE HIT', payload);
            ipcRenderer.send('VIEW_7ZIPPED_CONTENTS', payload);
            ipcRenderer.once('VIEWED_7ZIPPED_CONTENTS', (err, args) => {
                // console.log('LIST', args);
                obs.next(action.tree.success({
                    ...action.tree.payload,
                    modMap: args
                }));
                obs.complete();
            });
        }
    );

    return View7ZippedContentsController$;
}

export function UnzipFile$(store: Store<any>, action) {
    const UnzipFileController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('UNZIP_FILE', action.payload);
            ipcRenderer.once('UNZIPPED_FILE', (err, args) => {
                if (args === false) {
                    obs.next(action.tree.failed());
                } else {
                    obs.next(action.tree.success(args));
                }
                obs.complete();
            });
        }
    );
    return UnzipFileController$;
}

export function UnrarFile$(store: Store<any>, action) {
    const UnrarFileController$ = ActionController$(
        store, selectIpcActive,
        (obs) => {
            let payload;
            if (action.payload) {
                payload = action.payload;
            } else {
                payload = action.tree.payload;
            }
            console.log('UNRAR ACTION', action);
            ipcRenderer.send('UNRAR_FILE', payload);
            ipcRenderer.once('UNRARED_FILE', (err, args) => {
                // console.log('UNRARED_FILE', args);
                if (args === false) {
                    obs.next(action.tree.failed());
                } else {
                    obs.next(action.tree.success());
                }
                obs.complete();
            });
        }
    );
    return UnrarFileController$;
}

export function UnpackFiles$(store: Store<any>, action: Action) {
    const UnpackFileController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            function filterArchiveName(arr, name) {
                return arr.filter(item => item !== name);
            }
            const gameDir = action.tree.payload.gameDir;
            const archiveName = action.tree.payload.archiveNames[0];
            if (action.tree.payload.archiveNames.length !== 0) {
                if (archiveName.indexOf('.zip') > -1) {
                    console.log('UNZIP', [gameDir, archiveName]);
                    ipcRenderer.send('UNZIP_FILE', [gameDir, archiveName]);
                    ipcRenderer.once('UNZIPPED_FILE', (err, args) => {
                        if (args === false) {
                            obs.next(action.tree.failed());
                        } else {
                            const newAction = new FileSystemActions.UnpackFiles();
                            action.tree.payload = {
                                ...action.tree.payload,
                                archiveNames: filterArchiveName(action.tree.payload.archiveNames, archiveName)
                            };
                            newAction.tree = action.tree;
                            obs.next(newAction);
                        }
                        obs.complete();
                    });
                } else if (archiveName.indexOf('.rar') > - 1) {
                    ipcRenderer.send('UNRAR_FILE', [
                        gameDir + '\\modFolder\\' + archiveName,
                        (gameDir + '\\modFolder\\temp\\' + archiveName.split('.')[0] + '\\')
                    ]);
                    ipcRenderer.once('UNRARED_FILE', (err, args) => {
                        // console.log('UNRARED_FILE', args);
                        if (args === false) {
                            obs.next(action.tree.failed());
                        } else {
                            const newAction = new FileSystemActions.UnpackFiles();
                            action.tree.payload = {
                                ...action.tree.payload,
                                archiveNames: filterArchiveName(action.tree.payload.archiveNames, archiveName)
                            };
                            newAction.tree = action.tree;
                            obs.next(newAction);
                        }
                        obs.complete();
                    });
                } else if (archiveName.indexOf('.7z') > -1) {
                    ipcRenderer.send('UN7ZIP_FILE', [
                        gameDir + '\\modFolder\\' + archiveName,
                        '-o' + gameDir + '\\modFolder\\temp\\' + archiveName.split('.')[0]
                    ]);
                    ipcRenderer.once('UN7ZIPPED_FILE', (err, args) => {
                        // console.log('UNRARED_FILE', args);
                        if (args === false) {
                            obs.next(action.tree.failed());
                        } else {
                            const newAction = new FileSystemActions.UnpackFiles();
                            action.tree.payload = {
                                ...action.tree.payload,
                                archiveNames: filterArchiveName(action.tree.payload.archiveNames, archiveName)
                            };
                            newAction.tree = action.tree;
                            obs.next(newAction);
                        }
                        obs.complete();
                    });
                }
            } else {
                obs.next(action.tree.success());
                obs.complete();
            }
        }
    );
    return UnpackFileController$;
}

export function CopyMoveFiles$(store: Store<any>, action: Action) {
    const CopyMoveFilesController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            function filterPathName(arr, name) {
                return arr.filter(item => item.path !== name);
            }
            if (action.tree.payload.installPaths.length !== 0) {
                const gameDir = action.tree.payload.gameDir;
                const destinationPath = gameDir + '\\' + (action.tree.payload.installPaths[0].path
                    .substring(0, action.tree.payload.installPaths[0].path.lastIndexOf('\\')));
                const sourcePath = action.tree.payload.gameDir + '\\' +
                    `modFolder\\temp\\${action.tree.payload.installPaths[0].owner.split('.')[0]}\\` +
                    action.tree.payload.installPaths[0].path;
                const fileName = action.tree.payload.installPaths[0].path.split('\\').pop();
                console.log('source', sourcePath, 'src', action.tree.payload.installPaths[0].path,
                    action.tree.payload.installPaths[0].path.lastIndexOf('\\'));
                console.log('dest', destinationPath);
                console.log('fileName', fileName);
                ipcRenderer.send('COPY_MOVE_FILE', [sourcePath, destinationPath, fileName]);
                ipcRenderer.once('COPY_MOVED_FILE', (err, args) => {
                    console.log('MOVED_FILE', args);
                    if (args === false) {
                        obs.next(action.tree.failed());
                    } else {
                        const newAction = new FileSystemActions.CopyMoveFiles();
                        action.tree.payload = {
                            ...action.tree.payload,
                            installPaths: filterPathName(action.tree.payload.installPaths, action.tree.payload.installPaths[0].path)
                        };
                        newAction.tree = action.tree;
                        obs.next(newAction);
                    }
                    obs.complete();
                });
            } else {
                obs.next(action.tree.success());
                obs.complete();
            }
        }
    );
    return CopyMoveFilesController$;
}

export function DeleteFiles$(store: Store<any>, action: Action) {
    const DeleteFilesController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            function filterPathName(arr, name) {
                return arr.filter(item => item.path !== name);
            }
            if (action.tree.payload.removePaths.length !== 0) {
                const targetFile = action.tree.payload.gameDir + '\\' + action.tree.payload.removePaths[0].path;
                ipcRenderer.send('DELETE_FILE', targetFile);
                ipcRenderer.once('DELETED_FILE', (err, args) => {
                    if (args === false) {
                        obs.next(action.tree.failed());
                    } else {
                        const newAction = new FileSystemActions.DeleteFiles();
                        action.tree.payload = {
                            ...action.tree.payload,
                            removePaths: filterPathName(action.tree.payload.removePaths, action.tree.payload.removePaths[0].path)
                        };
                        newAction.tree = action.tree;
                        obs.next(newAction);
                    }
                    obs.complete();
                });
            } else {
                obs.next(action.tree.success());
                obs.complete();
            }
        }
    );
    return DeleteFilesController$;
}

export function GetDirectories$(store: Store<any>, action: Action) {
    const GetDirectoriesController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('READ_DIR', action.tree.payload);
            ipcRenderer.once('DIR_READ', (err, args) => {
                // console.log('ONCE');
                obs.next(action.tree.success(args));
                obs.complete();
            });
        }
    );
    return GetDirectoriesController$;
}

export function ExecProcess$(store: Store<any>, action: Action) {
    const ExecProcessController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('EXEC_PROCESS', action.tree.payload);
            ipcRenderer.once('EXECUTED_PROCESS', (err, args) => {
                obs.next(new FileSystemActions.FileSystemSuccess());
                obs.complete();
            });
        }
    );
    return ExecProcessController$;
}

export function CreateModdingDirs$(store: Store<any>, action: Action) {
    const CreateModdingDirsController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('CREATE_MOD_DIRS', null);
            ipcRenderer.once('CREATED_MOD_DIRS', (err, args) => {
                obs.next(action.tree.success());
                obs.complete();
            });
        }
    );
    return CreateModdingDirsController$;
}

export function MapDirectoryThenAppendPayload$(store: Store<any>, action: Action) {
    const MapDirectoryThenAppendPayloadController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            let payload;
            if (action.payload) {
                payload = action.payload;
            } else {
                payload = action.tree.payload;
            }
            ipcRenderer.send('MAP_DIRECTORY_THEN_APPEND_PAYLOAD', payload);
            ipcRenderer.once('MAPPED_DIRECTORY_NOW_APPEND_PAYLOAD', (err, args) => {
                // console.log('MAPPED', args);
                obs.next(action.tree.success({
                    ...action.tree.payload,
                    modMap: args
                }));
                obs.complete();
            });
        }
    );
    return MapDirectoryThenAppendPayloadController$;
}

export function MapDirectory$(store: Store<any>, action: Action) {
    const MapDirectoryController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('MAP_DIRECTORY', action.tree.payload);
            ipcRenderer.once('MAPPED_DIRECTORY', (err, args) => {
                obs.next(action.tree.success());
                obs.complete();
            });
        }
    );
    return MapDirectoryController$;
}

export function DeleteDirectory$(store: Store<any>, action: Action) {
    const DeleteDirectoryController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            let payload;
            if (action.payload) {
                payload = action.payload;
            } else {
                payload = action.tree.payload;
            }
            ipcRenderer.send('DELETE_DIRECTORY', payload);
            ipcRenderer.once('DELETED_DIRECTORY', (err, args) => {
                // console.log('DELETED_DIRECTORY', args);
                obs.next(action.tree.success());
                obs.complete();
            });
        }
    );
    return DeleteDirectoryController$;
}

export function GetNativePcMap$(store: Store<any>, action: Action) {
    const GetNativePcMapController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('GET_NATIVE_PC_MAP', null);
            ipcRenderer.once('GOT_NATIVE_PC_MAP', (err, args) => {
                obs.next(action.tree.success(args));
                obs.complete();
            });
        }
    );
    return GetNativePcMapController$;
}

export function GetModFolderMap$(store: Store<any>, action: Action) {
    const GetModFolderMapController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.send('GET_MOD_FOLDER_MAP', null);
            ipcRenderer.once('GOT_MOD_FOLDER_MAP', (err, args) => {
                // console.log('MOD_FOLDER_MAP', args);
                obs.next(action.tree.success(args));
                obs.complete();
            });
        }
    );
    return GetModFolderMapController$;
}
