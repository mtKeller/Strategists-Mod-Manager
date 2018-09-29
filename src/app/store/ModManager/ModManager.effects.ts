import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ActionTree,
    ActionNode,
    ActionTreeParams
} from '../../model/ActionTree.class';
import * as ModManagerActions from './ModManager.action';

import { ViewZippedContents } from '../FileSystem/FileSystem.actions';

@Injectable()
  export class ModManagerEffects {
    modFolderMap: Array<string>;
    needsProcessing: Array<string>;
    downloadManagerCurrentFiles: Array<any>;

    constructor(private actions$: Actions, private store: Store<any> ) {
        this.store.select(state => state.ModManagerState.modFolderMap).subscribe(val => {
            if (val) {
                this.modFolderMap = val;
            }
        });
    }
    @Effect()
        ModManagerProcessMod$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_MOD)
            .map(action => {
                console.log('Process MOD: ', action.payload);
                if (action.payload.indexOf('.rar') > -1) {
                    return new ModManagerActions.ProcessRarMod(action.payload);
                } else if (action.payload.indexOf('.zip') > -1) {
                    return new ModManagerActions.ProcessZipMod(action.payload);
                } else if (action.payload.indexOf('.7z') > -1) { // TODO WILL NOT WORK AT THE MOMENT
                    return new ModManagerActions.Process7ZipMod(action.payload);
                } else {
                    return new ModManagerActions.ModManagerSuccess();
                }
            });
    @Effect()
        ModManagerSetNativePcMap$: Observable<any> = this.actions$
            .ofType(ModManagerActions.SET_NATIVE_PC_MAP)
            .map(action => {
                // Insert Processing of direct installed MODS here
                // Generates Anon JSON
                return action.tree.success();
            });
    @Effect()
        ModManagerSetModFolderMap$: Observable<any> = this.actions$
            .ofType(ModManagerActions.SET_MOD_FOLDER_MAP)
            .map(action => {
                // Insert Processing of dragged over MODS here
                // Check against downloadedModDetail and Current MODS
                // Generates Anon JSON
                return action.tree.success();
            });
    @Effect()
        ModManagerSetState$: Observable<any> = this.actions$
            .ofType(ModManagerActions.SET_STATE)
            .map(action => {
                // this.store.dispatch(new ModManagerActions.VerifyMods());
                console.log('CHECK MOD STATE', action.tree.payload);
                return action.tree.success();
            });
}
