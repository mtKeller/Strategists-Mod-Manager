import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import '../../helpers/rxjs-operators';

import * as FileSystemActions from './FileSystem.actions';

const fs = window.require('mz/fs');

@Injectable()
  export class FileSystemEffects {
    constructor(private actions$: Actions, private store: Store<any> ) { }

    @Effect()
        FileSystemReadFile$: Observable<any> = this.actions$
            .ofType(FileSystemActions.READ_FILE)
            .map(action => {
                console.log(action.type);
                fs.readFile(action.payload.data)
                    .then(data => {
                        if (action.payload.nextAction) {
                            this.store.dispatch(new action.payload.nextAction(data));
                        } else {
                            this.store.dispatch(new FileSystemActions.ReadFileSuccess(data.toString()));
                        }
                    });
                return new FileSystemActions.FileSystemSuccess;
            })
            .catch(err => {
                this.store.dispatch(new FileSystemActions.FileSystemFailure(err));
                return null;
            });
    @Effect()
        FileSystemRenameFile$: Observable<any> = this.actions$
            .ofType(FileSystemActions.READ_FILE)
            .map(action => {
                console.log(action.type);
                fs.readFile(action.payload)
                    .then(data => {
                        this.store.dispatch(new FileSystemActions.ReadFileSuccess(data.toString()));
                        console.log('File System Success', data.toString());
                    });
                return new FileSystemActions.FileSystemSuccess;
            })
            .catch(err => {
                this.store.dispatch(new FileSystemActions.FileSystemFailure(err));
                return null;
            });
}
