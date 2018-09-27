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

@Injectable()
  export class ModManagerEffects {
    modFolderMap: Array<string>;
    constructor(private actions$: Actions, private store: Store<any> ) {
        this.store.select(state => state.ModManagerState.modFolderMap).subscribe(val => {
            this.modFolderMap = val;
            console.log('SHOULD DIPSATCH');
            this.store.dispatch(new ModManagerActions.VerifyMods());
        });
    }
    @Effect()
        ModManagerSetNativePcMap$: Observable<any> = this.actions$
            .ofType(ModManagerActions.SET_NATIVE_PC_MAP)
            .map(action => {
                return action.tree.success();
            });
    @Effect()
        ModManagerSetModFolderMap$: Observable<any> = this.actions$
            .ofType(ModManagerActions.SET_MOD_FOLDER_MAP)
            .map(action => {
                return action.tree.success();
            });
}
