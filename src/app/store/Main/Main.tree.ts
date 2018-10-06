// THIS WILL BECOME A GENERATED FILE AFTER THIS PROJECT
import * as MainActions from './Main.actions';
import {Action, Store} from '@ngrx/store';
import { ActionTree,
    ActionNode,
    ActionTreeParams,
} from '../../model/ActionTree.class';

export function SaveStateTree(store: Store<any>) {
    const ActionNodeSaveStateSuccess: ActionNode = {
        initAction: new MainActions.SaveStateSuccess(),
        successNode: null,
        failureNode: null
    };
    const ActionNodeSaveState: ActionNode = {
        initAction: new MainActions.SaveState(),
        successNode: ActionNodeSaveStateSuccess,
        failureNode: null
    };
    const ActionTreeParam: ActionTreeParams = {
        payload: null,
        actionNode: ActionNodeSaveState,
        store: store
    };
    const ActionTreeSaveState: ActionTree = new ActionTree(ActionTreeParam);

    return ActionTreeSaveState;
}

