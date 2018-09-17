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
                ipcRenderer.send('READ_FILE', action.chain.payload);
                ipcRenderer.once('FILE_READ', (event, args) => {
                    if (args === false) {
                        this.store.dispatch(action.chain.failed(args));
                    } else {
                        this.store.dispatch(action.chain.success(args));
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
                this.store.dispatch(action.chain.success());
                return new FileSystemActions.FileSystemSuccess;
            });
    @Effect()
        FileSystemWriteFile$: Observable<any> = this.actions$
            .ofType(FileSystemActions.WRITE_FILE)
            .map(action => {
                ipcRenderer.send('WRITE_FILE', action.chain.payload);
                ipcRenderer.once('WROTE_FILE', (event, args) => {
                    if (args === false) {
                        this.store.dispatch(action.chain.failed(args));
                    } else {
                        this.store.dispatch(action.chain.success(args));
                    }
                });
                return new FileSystemActions.FileSystemSuccess;
            });
    @Effect()
        FileSystemGetDirectories$: Observable<any> = this.actions$
            .ofType(FileSystemActions.GET_DIRECTORIES)
            .map(action => {
                console.log('HIT');
                ipcRenderer.send('READ_DIR', action.chain.payload);
                ipcRenderer.once('DIR_READ', (err, args) => {
                    this.store.dispatch(action.chain.success(args));
                });
                return new FileSystemActions.FileSystemSuccess();
            });
}
