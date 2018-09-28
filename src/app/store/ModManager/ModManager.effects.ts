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
    constructor(private actions$: Actions, private store: Store<any> ) {
        this.store.select(state => state.ModManagerState.modFolderMap).subscribe(val => {
            if (val) {
                this.modFolderMap = val;
                if (val.length > 0) {
                    console.log('DISPATCH VERIFY MODS');
                    this.store.dispatch(new ModManagerActions.VerifyMods());
                }
            }
        });
        this.store.select(state => state.ModManagerState.needsProcessing).subscribe(val => {
            if (val.length > 0) {
                this.needsProcessing = val;
                this.store.dispatch(new ModManagerActions.ProcessMods());
            }
        });
    }
    @Effect()
        ModManagerProcessMods$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_MODS)
            .debounceTime(1000)
            .map(action => {
                // const recursiveActionNode = (lastNode) => {
                // };
                // for (let i = 0; i < this.needsProcessing.length; i++) {

                // }
                console.log('HIT LIST');
                if (this.needsProcessing) {
                    const ActionNodeViewZippedContents: ActionNode = {
                        initAction: new ViewZippedContents(),
                        successNode: null,
                        failureNode: null
                    };
                    const ActionTreeParam: ActionTreeParams = {
                        actionNode: ActionNodeViewZippedContents,
                        payload: this.needsProcessing[0],
                        store: this.store
                    };
                    const ActionTreeList: ActionTree = new ActionTree(ActionTreeParam);
                    ActionTreeList.init();
                    console.log('Zipped List: ', ActionTreeList);
                }
                return new ModManagerActions.ModManagerSuccess();
            });
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
    @Effect()
        ModManagerSetState$: Observable<any> = this.actions$
            .ofType(ModManagerActions.SET_STATE)
            .map(action => {
                // this.store.dispatch(new ModManagerActions.VerifyMods());
                console.log('CHECK MOD STATE', action.tree.payload);
                return action.tree.success();
            });
}
