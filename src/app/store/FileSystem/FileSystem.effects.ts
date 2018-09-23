import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import '../../helpers/rxjs-operators';

import * as FileSystemActions from './FileSystem.actions';

const fs = window.require('mz/fs');
const { ipcRenderer } = window.require('electron');

@Injectable()
  export class FileSystemEffects {
    constructor(private actions$: Actions, private store: Store<any> ) { }

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
                ipcRenderer.send('WRITE_FILE', action.tree.payload);
                ipcRenderer.once('WROTE_FILE', (event, args) => {
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
                ipcRenderer.once('ZIPPED_DIR', (event, args) => {
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
                ipcRenderer.once('ZIPPED_FILES', (event, args) => {
                    if (args === false) {
                        this.store.dispatch(action.tree.failed(args));
                    } else {
                        this.store.dispatch(action.tree.success(args));
                    }
                });
                return new FileSystemActions.FileSystemSuccess;
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
            .ofType(FileSystemActions.GET_NATIVE_PC_MAP)
            .map(action => {
                ipcRenderer.send('GET_MOD_FOLDER_MAP', null);
                ipcRenderer.once('GOT_MOD_FOLDER_MAP', (err, args) => {
                    this.store.dispatch(action.tree.success(args));
                });
                return new FileSystemActions.FileSystemSuccess();
            });
}
