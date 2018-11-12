import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, debounceTime } from 'rxjs/operators';

import * as DownloadManagerActions from './DownloadManager.actions';
import * as DownloadManagerControllers from './DownloadManager.controllers';
import { AddModDetailFromDownload, ProcessModByName } from '../ModManager/ModManager.actions';
import { SaveStateTree } from '../Main/Main.tree';
import { empty } from 'rxjs';

const { ipcRenderer } = window.require('electron');

@Injectable()
  export class DownloadManagerEffects {
    DownloadManager$;
    constructor(private actions$: Actions, private store: Store<any> ) { }

    @Effect()
        DownloadManagerInit$: Observable<any> = this.actions$
            .pipe(
                ofType(DownloadManagerActions.INIT_DOWNLOAD_MANAGER),
                map(action => {
                    this.DownloadManager$ = DownloadManagerControllers.DMInit$(this.store);
                    this.DownloadManager$.subscribe(val => this.store.dispatch(val));
                    return action.tree.success();
                })
            );
    @Effect()
        DownloadManagerAddDownloadItem$: Observable<any> = this.actions$
            .pipe(
                ofType(DownloadManagerActions.ADD_DOWNLOAD_ITEM),
                debounceTime(500),
                map(action => new AddModDetailFromDownload(action.payload))
            );
    @Effect()
        DownloadManagerCompleteDownloadItem$: Observable<any> = this.actions$
            .pipe(
                ofType(DownloadManagerActions.COMPLETE_DOWNLOAD_ITEM),
                debounceTime(500),
                map(action => {
                    if (action.payload !== null) {
                        return new ProcessModByName(action.payload);
                    }
                    return new DownloadManagerActions.DownloadManagerSuccess();
                })
            );
    @Effect()
        DownloadManagerRemoveItem$: Observable<any> = this.actions$
            .pipe(
                ofType(DownloadManagerActions.REMOVE_DOWNLOAD_ITEM),
                map(action => {
                    const saveStateTree = SaveStateTree(this.store);
                    saveStateTree.init();
                    if (action.tree) {
                        return action.tree.success();
                    } else {
                        return new DownloadManagerActions.DownloadManagerSuccess;
                    }
                })
            );
    @Effect()
        DownloadManagerSetState$: Observable<any> = this.actions$
            .pipe(
                ofType(DownloadManagerActions.SET_STATE),
                map(action => action.tree.success())
            );
    @Effect()
        DownloadManagerUpdateDownloadItemProcessingProgress$ = this.actions$
            .pipe(
                ofType(DownloadManagerActions.UPDATE_DOWNLOAD_ITEM_PROCESSING_PROGRESS),
                map(action => action.tree.success())
            );
}
