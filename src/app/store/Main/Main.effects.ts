import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import '../../helpers/rxjs-operators';

import * as MainActions from './Main.actions';
import * as FileSystemActions from '../FileSystem/FileSystem.actions';

const { ipcRenderer } = window.require('electron');

@Injectable()
  export class MainEffects {
    constructor(private actions$: Actions, private store: Store<any> ) { }

    @Effect()
        MainInitApp$: Observable<any> = this.actions$
            .ofType(MainActions.INIT_APP)
            .map(action => {
                console.log('Testing action chain');
                return new FileSystemActions.ReadFile({
                    data: 'package.json',
                    nextAction: MainActions.InitAppSuccess
                });
            })
            .catch(err => {
                this.store.dispatch(new MainActions.MainFailed(err));
                return null;
            });
    @Effect()
        MainInitAppSuccess: Observable<any> = this.actions$
            .ofType(MainActions.INIT_APP_SUCCESS)
            .map(action => {
                console.log(action.payload);
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainCloseWindow: Observable<any> = this.actions$
            .ofType(MainActions.CLOSE_WINDOW)
            .map(action => {
                ipcRenderer.send('CLOSE_WINDOW', null);
                return new MainActions.MainSuccess;
            });
}
