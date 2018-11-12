import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as FileSystemActions from './FileSystem.actions';
import * as FileSystemControllers from './FileSystem.controllers';

const fs = window.require('mz/fs');
const { ipcRenderer } = window.require('electron');

@Injectable()
  export class FileSystemEffects {
    constructor(private actions$: Actions, private store: Store<any> ) { }
    @Effect()
        FileSystemInit$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.INIT),
                switchMap(() => FileSystemControllers.Initialize$(this.store)),
                map(action => {
                    console.log('init: ', action);
                    return action;
                })
            );
    @Effect()
        FileSystemExit$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.EXIT),
                map(action => {
                    ipcRenderer.send('EXIT', null);
                    return new FileSystemActions.FileSystemSuccess();
                })
            );
    @Effect()
        FileSystemReadFile$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.READ_FILE),
                switchMap(action => FileSystemControllers.ReadFile$(this.store, action)),
                map(action => action),
                catchError((err, caught) => {
                    this.store.dispatch(new FileSystemActions.FileSystemFailure(err));
                    return caught;
                })
            );
    @Effect()
        FileSystemReadFileSuccess$ = this.actions$
            .pipe(
                ofType(FileSystemActions.READ_FILE_SUCCESS),
                map(action => action.tree.success())
            );
    @Effect()
        FileSystemWriteFile$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.WRITE_FILE),
                switchMap(action => FileSystemControllers.WriteFile$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemWriteFileSuccess$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.WRITE_FILE_SUCCESS),
                map(action => action.tree.success())
            );
    @Effect()
        FileSystemZipDIR$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.ZIP_DIR),
                switchMap(action => FileSystemControllers.ZipDir$(this.store, action)),
                map(action => action)
            );
    // @Effect()
    //     FileSystemZipFiles$: Observable<any> = this.actions$
    //         .ofType(FileSystemActions.ZIP_DIR)
    //         .map(action => {
    //             ipcRenderer.send('ZIP_FILES', action.tree.payload);
    //             ipcRenderer.once('ZIPPED_FILES', (err, args) => {
    //                 if (args === false) {
    //                     this.store.dispatch(action.tree.failed(args));
    //                 } else {
    //                     this.store.dispatch(action.tree.success(args));
    //                 }
    //             });
    //             return new FileSystemActions.FileSystemSuccess;
    //         });
    @Effect()
        FileSystemViewZippedContents$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.VIEW_ZIPPED_CONTENTS),
                switchMap(action => FileSystemControllers.ViewZippedContents$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemView7ZippedContents$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.VIEW_7ZIPPED_CONTENTS),
                switchMap(action => FileSystemControllers.View7ZippedContents$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemUnzipFile$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.UNZIP_FILE),
                switchMap(action => FileSystemControllers.UnzipFile$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemUnrarFile$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.UNRAR_FILE),
                switchMap(action => FileSystemControllers.UnrarFile$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemUnpackFiles$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.UNPACK_FILES),
                switchMap(action => FileSystemControllers.UnpackFiles$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemCopyMoveFiles$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.COPY_MOVE_FILES),
                switchMap(action => FileSystemControllers.CopyMoveFiles$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemDeleteFiles$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.DELETE_FILES),
                switchMap(action => FileSystemControllers.DeleteFiles$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemGetDirectories$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.GET_DIRECTORIES),
                switchMap(action => FileSystemControllers.GetDirectories$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemExecProcess$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.EXEC_PROCESS),
                switchMap(action => FileSystemControllers.ExecProcess$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemCreateModdingDirectories$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.CREATE_MODDING_DIRECTORIES),
                switchMap(action => FileSystemControllers.CreateModdingDirs$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemMapDirectoryThenAppendPayload$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.MAP_DIRECTORY_THEN_APPEND_PAYLOAD),
                switchMap(action => FileSystemControllers.MapDirectoryThenAppendPayload$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemMapDirectory$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.MAP_DIRECTORY),
                switchMap(action => FileSystemControllers.MapDirectory$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemDeleteDirectory$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.DELETE_DIRECTORY),
                switchMap(action => FileSystemControllers.DeleteDirectory$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemGetNativePcMap$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.GET_NATIVE_PC_MAP),
                switchMap(action => FileSystemControllers.GetNativePcMap$(this.store, action)),
                map(action => action)
            );
    @Effect()
        FileSystemGetModFolderMap$: Observable<any> = this.actions$
            .pipe(
                ofType(FileSystemActions.GET_MOD_FOLDER_MAP),
                switchMap(action => FileSystemControllers.GetModFolderMap$(this.store, action)),
                map(action => action)
            );
}
