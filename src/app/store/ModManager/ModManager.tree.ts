import * as ModManagerActions from './ModManager.actions';
import {Action, Store} from '@ngrx/store';
import { ActionTree,
    ActionNode,
    ActionTreeParams,
} from '../../model/ActionTree.class';
import { Mod } from './ModManager.state';

export function PrepInstallation(store: Store<any>, mod: Mod, modIndex: number) {
    const ActionNodeCheckAgainstOwnedDict: ActionNode = {
        initAction: new ModManagerActions.VerifyAgainstOwnershipDict(),
        successNode: null,
        payload: null
    };
    const ActionNodeFilterModMap: ActionNode = {
        initAction: new ModManagerActions.FilterModMap(),
        successNode: ActionNodeCheckAgainstOwnedDict,
    };
    const ActionNodeBeginModProcessing: ActionNode = {
        initAction: new ModManagerActions.BeginModProcessing(),
        successNode: ActionNodeFilterModMap,
        payload: mod.archiveNames[modIndex]
    };
    const ActionNodeAddModToProcessingQue: ActionNode = {
        initAction: new ModManagerActions.AddModToProcessingQue(),
        successNode: ActionNodeBeginModProcessing,
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: ActionNodeAddModToProcessingQue,
        payload: {
            mod: mod,
            modIndex: modIndex
        },
        store: store
    };
    const ActionTreePrepInstallation: ActionTree = new ActionTree(ActionTreeParam);
    return ActionTreePrepInstallation;
}

export function Installation() {

    // TIER 1
    // IF ARCHIVE IS UNPACKED
    // TIER 0 CHECK TEMP MAP FILTER TO SEE IF ARCHIVES ARE UNPACKED
    return null;
}
// Return beginning and end
function genBranchUnpackMod () {
    return null;
}

function genUnrar () {
    return null;
}

function genUnzip () {
    return null;
}

function genUn7zip () {
    return null;
}
