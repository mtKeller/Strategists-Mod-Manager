import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import '../../helpers/rxjs-operators';
import * as FileSystemActions from './FileSystem.actions';
import { InitApp } from '../Main/Main.actions';
import { Observer } from 'rx';

const fs = window.require('mz/fs');
const { ipcRenderer } = window.require('electron');

@Injectable()
  export class FileSystemEffects {
    constructor(private actions$: Actions, private store: Store<any> ) { }
    @Effect()
        FileSystemInit$: Observable<any> = this.actions$
            .ofType(FileSystemActions.INIT)
            .map(action => {
                ipcRenderer.send('INIT', null);
                ipcRenderer.once('INITIALIZED', (err, args) => {
                     this.store.dispatch(new InitApp());
                });
                return new FileSystemActions.FileSystemSuccess();
            });
            @Effect()
    FileSystemExit$: Observable<any> = this.actions$
        .ofType(FileSystemActions.EXIT)
        .map(action => {
            ipcRenderer.send('EXIT', null);
            return new FileSystemActions.FileSystemSuccess();
        });
    @Effect()
        FileSystemReadFile$: Observable<any> = this.actions$
            .ofType(FileSystemActions.READ_FILE)
            .map(action => {
                ipcRenderer.send('READ_FILE', action.tree.payload);
                ipcRenderer.once('FILE_READ', (event, args) => {
                    console.log('CHECK ARGS: ', args);
                    if (args === false) {
                        this.store.dispatch(action.tree.failed(args));
                    } else {
                        this.store.dispatch(action.tree.success(args));
                    }
                });
                return new FileSystemActions.FileSystemSuccess;
            })
            .catch((err, caught) => {
                this.store.dispatch(new FileSystemActions.FileSystemFailure(err));
                return caught;
            });
    @Effect()
        FileSystemReadFileSuccess$ = this.actions$
            .ofType(FileSystemActions.READ_FILE_SUCCESS)
            .map(action => {
                this.store.dispatch(action.tree.success());
                return new FileSystemActions.FileSystemSuccess;
            });
    @Effect()
        FileSystemWriteFile$: Observable<any> = this.actions$
            .ofType(FileSystemActions.WRITE_FILE)
            .map(action => {
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
                        this.store.dispatch(action.tree.failed(args));
                    } else {
                        this.store.dispatch(action.tree.success(args));
                    }
                });
                return new FileSystemActions.FileSystemSuccess;
            });
    @Effect()
        FileSystemWriteFileSuccess$: Observable<any> = this.actions$
            .ofType(FileSystemActions.WRITE_FILE_SUCCESS)
            .map(action => {
                return action.tree.success();
            });
    @Effect()
        FileSystemZipDIR$: Observable<any> = this.actions$
            .ofType(FileSystemActions.ZIP_DIR)
            .map(action => {
                ipcRenderer.send('ZIP_DIR', action.tree.payload);
                ipcRenderer.once('ZIPPED_DIR', (err, args) => {
                    if (args === false) {
                        this.store.dispatch(action.tree.failed(args));
                    } else {
                        this.store.dispatch(action.tree.success(args));
                    }
                });
                return new FileSystemActions.FileSystemSuccess;
            });
    @Effect()
        FileSystemZipFiles$: Observable<any> = this.actions$
            .ofType(FileSystemActions.ZIP_DIR)
            .map(action => {
                ipcRenderer.send('ZIP_FILES', action.tree.payload);
                ipcRenderer.once('ZIPPED_FILES', (err, args) => {
                    if (args === false) {
                        this.store.dispatch(action.tree.failed(args));
                    } else {
                        this.store.dispatch(action.tree.success(args));
                    }
                });
                return new FileSystemActions.FileSystemSuccess;
            });
    @Effect()
        FileSystemViewZippedContents$: Observable<any> = this.actions$
            .ofType(FileSystemActions.VIEW_ZIPPED_CONTENTS)
            .map(action => {
                console.log('TREE HIT', action.tree.payload);
                ipcRenderer.send('VIEW_ZIPPED_CONTENTS', action.tree.payload);
                ipcRenderer.once('VIEWED_ZIPPED_CONTENTS', (err, args) => {
                    console.log('LIST', args);
                    this.store.dispatch(action.tree.success());
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemUnzipFile$: Observable<any> = this.actions$
            .ofType(FileSystemActions.UNZIP_FILE)
            .map(action => {
                // payload is path to file[0] and name of file[1]
                ipcRenderer.send('UNZIP_FILE', action.payload);
                ipcRenderer.once('UNZIPPED_FILE', (err, args) => {
                    if (args === false) {
                        this.store.dispatch(action.tree.failed());
                    } else {
                        this.store.dispatch(action.tree.success(args));
                    }
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemUnrarFile$: Observable<any> = this.actions$
            .ofType(FileSystemActions.UNRAR_FILE)
            .map(action => {
                let payload;
                if (action.payload) {
                    payload = action.payload;
                } else {
                    payload = action.tree.payload;
                }
                console.log('UNRAR ACTION', action);
                ipcRenderer.send('UNRAR_FILE', payload);
                ipcRenderer.once('UNRARED_FILE', (err, args) => {
                    console.log('UNRARED_FILE', args);
                    if (args === false) {
                        this.store.dispatch(action.tree.failed());
                    } else {
                        this.store.dispatch(action.tree.success());
                    }
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemGetDirectories$: Observable<any> = this.actions$
            .ofType(FileSystemActions.GET_DIRECTORIES)
            .map(action => {
                console.log('HIT');
                console.log(action.tree.payload);
                ipcRenderer.send('READ_DIR', action.tree.payload);
                ipcRenderer.once('DIR_READ', (err, args) => {
                    console.log('ONCE');
                    this.store.dispatch(action.tree.success(args));
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemExecProcess$: Observable<any> = this.actions$
            .ofType(FileSystemActions.EXEC_PROCESS)
            .map(action => {
                ipcRenderer.send('EXEC_PROCESS', action.tree.payload);
                ipcRenderer.once('EXECUTED_PROCESS', (err, args) => {
                    console.log('EXECUTED_PROCESS: ', args);
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemCreateModdingDirectories$: Observable<any> = this.actions$
            .ofType(FileSystemActions.CREATE_MODDING_DIRECTORIES)
            .map(action => {
                ipcRenderer.send('CREATE_MOD_DIRS', null);
                ipcRenderer.once('CREATED_MOD_DIRS', (err, args) => {
                    this.store.dispatch(action.tree.success());
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemMapDirectoryThenAppendPayload$: Observable<any> = this.actions$
            .ofType(FileSystemActions.MAP_DIRECTORY_THEN_APPEND_PAYLOAD)
            .map(action => {
                let payload;
                if (action.payload) {
                    payload = action.payload;
                } else {
                    payload = action.tree.payload;
                }
                ipcRenderer.send('MAP_DIRECTORY_THEN_APPEND_PAYLOAD', payload);
                ipcRenderer.once('MAPPED_DIRECTORY_NOW_APPEND_PAYLOAD', (err, args) => {
                    console.log('MAPPED', args);
                    this.store.dispatch(action.tree.success({
                        ...action.tree.payload,
                        modMap: args
                    }));
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemMapDirectory$: Observable<any> = this.actions$
            .ofType(FileSystemActions.MAP_DIRECTORY)
            .map(action => {
                ipcRenderer.send('MAP_DIRECTORY', action.tree.payload);
                ipcRenderer.once('MAPPED_DIRECTORY', (err, args) => {
                    this.store.dispatch(action.tree.success());
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemDeleteDirectory$: Observable<any> = this.actions$
            .ofType(FileSystemActions.DELETE_DIRECTORY)
            .map(action => {
                let payload;
                if (action.payload) {
                    payload = action.payload;
                } else {
                    payload = action.tree.payload;
                }
                ipcRenderer.send('DELETE_DIRECTORY', payload);
                ipcRenderer.once('DELETED_DIRECTORY', (err, args) => {
                    console.log('DELETED_DIRECTORY', args);
                    this.store.dispatch(action.tree.success());
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemGetNativePcMap$: Observable<any> = this.actions$
            .ofType(FileSystemActions.GET_NATIVE_PC_MAP)
            .map(action => {
                ipcRenderer.send('GET_NATIVE_PC_MAP', null);
                ipcRenderer.once('GOT_NATIVE_PC_MAP', (err, args) => {
                    this.store.dispatch(action.tree.success(args));
                });
                return new FileSystemActions.FileSystemSuccess();
            });
    @Effect()
        FileSystemGetModFolderMap$: Observable<any> = this.actions$
            .ofType(FileSystemActions.GET_MOD_FOLDER_MAP)
            .map(action => {
                ipcRenderer.send('GET_MOD_FOLDER_MAP', null);
                ipcRenderer.once('GOT_MOD_FOLDER_MAP', (err, args) => {
                    console.log('MOD_FOLDER_MAP', args);
                    this.store.dispatch(action.tree.success(args));
                });
                return new FileSystemActions.FileSystemSuccess();
            });
}
