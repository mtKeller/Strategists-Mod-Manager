import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import '../../helpers/rxjs-operators';

import * as DownloadManagerActions from './DownloadManager.actions';
import { SaveStateTree } from '../Main/Main.tree';
import { empty } from '../../../../node_modules/rxjs';

const { ipcRenderer } = window.require('electron');

@Injectable()
  export class DownloadManagerEffects {
    constructor(private actions$: Actions, private store: Store<any> ) { }

    @Effect()
        DownloadManagerInit$: Observable<any> = this.actions$
            .ofType(DownloadManagerActions.INIT_DOWNLOAD_MANAGER)
            .map(action => {
                ipcRenderer.on('DOWNLOAD_MANAGER_START', (err, args) => {
                    console.log('CHECK DL', args);
                    this.store.dispatch(new DownloadManagerActions.AddDownloadItem(args));
                });
                ipcRenderer.on('DOWNLOAD_MANAGER_END', (err, args) => {
                    console.log('CHECK END', args);
                    this.store.dispatch(new DownloadManagerActions.CompleteDownloadItem(args));
                });
                ipcRenderer.on('DOWNLOAD_MANAGER_UPDATE', (err, args) => {
                    console.log('CHECK UPDATE', args);
                    this.store.dispatch(new DownloadManagerActions.UpdateDownloadItemProgress(args));
                });
                return action.tree.success();
            });
    @Effect()
        DownloadManagerRemoveItem$: Observable<any> = this.actions$
            .ofType(DownloadManagerActions.REMOVE_DOWNLOAD_ITEM)
            .map(action => {
                const saveStateTree = SaveStateTree(this.store);
                saveStateTree.init();
                return new DownloadManagerActions.DownloadManagerSuccess;
            });
    @Effect()
        DownloadManagerSetState$: Observable<any> = this.actions$
            .ofType(DownloadManagerActions.SET_STATE)
            .map(action => {
                return action.tree.success();
            });
}
