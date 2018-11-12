import { ActionController$ } from '../../model/ActionController';
import { Store, select } from '@ngrx/store';
import { interval, Observable } from 'rxjs';
const { ipcRenderer } = window.require('electron');

import { selectIpcActive } from '../Main/Main.selectors';
import { InitApp } from '../Main/Main.actions';
import { Action } from '@ngrx/store';

import * as DownloadManagerActions from './DownloadManager.actions';

export function DMInit$(store: Store<any>) {
    const DMInitController$ = ActionController$(
        store,
        selectIpcActive,
        (obs) => {
            ipcRenderer.on('DOWNLOAD_MANAGER_START', (err, args) => {
                // console.log('CHECK DL', args);
                obs.next(new DownloadManagerActions.AddDownloadItem(args));
            });
            ipcRenderer.on('DOWNLOAD_MANAGER_END', (err, args) => {
                // console.log('CHECK END', args);
                obs.next(new DownloadManagerActions.CompleteDownloadItem(args));
            });
            ipcRenderer.on('DOWNLOAD_MANAGER_UPDATE', (err, args) => {
                // console.log('CHECK UPDATE', args);
                obs.next(new DownloadManagerActions.UpdateDownloadItemProgress(args));
            });
        }
    );
    return DMInitController$;
}
