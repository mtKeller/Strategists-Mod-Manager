import * as ModManagerActions from './ModManager.actions';
import * as FileSystemActions from '../FileSystem/FileSystem.actions';
import {Action, Store} from '@ngrx/store';
import { ActionTree,
    ActionNode,
    ActionTreeParams,
} from '../../model/ActionTree.class';
import { Mod } from './ModManager.state';

export function PrepInstallation(
    store: Store<any>,
    mod: Mod,
    modIndexes: Array<number>,
    loadOrderPos: number
) {
    const ActionNodeEndProcessing: ActionNode = {
        initAction: new ModManagerActions.ModProcessed(),
        successNode: null
    };
    // const ActionNodePrepDependencies: ActionNode = {
    //     initAction: null,
    //     successNode: null
    // };
    const ActionNodeCheckAgainstOwnedDict: ActionNode = {
        initAction: new ModManagerActions.VerifyAgainstOwnershipDict(),
        successNode: ActionNodeEndProcessing,
    };
    const ActionNodeFilterModMap: ActionNode = {
        initAction: new ModManagerActions.FilterModMap(),
        successNode: ActionNodeCheckAgainstOwnedDict,
    };
    const ActionNodeBeginModProcessing: ActionNode = {
        initAction: new ModManagerActions.BeginModProcessing(),
        successNode: ActionNodeFilterModMap,
        payload: mod.archiveNames[modIndexes[1]]
    };
    const ActionNodeAddModToProcessingQue: ActionNode = {
        initAction: new ModManagerActions.AddModToProcessingQue(),
        successNode: ActionNodeBeginModProcessing,
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: ActionNodeAddModToProcessingQue,
        payload: {
            mod: mod,
            loadOrderPos: loadOrderPos,
            archiveName: mod.archiveNames[modIndexes[1]],
            modIndexes: modIndexes
        },
        store: store
    };
    const ActionTreePrepInstallation: ActionTree = new ActionTree(ActionTreeParam);
    return ActionTreePrepInstallation;
}

export function PrepDependencies(store: Store<any>, mods: Array<Mod>) {
    // Then repeat
    // Else Unpack Mod
    // If Mod archive is unpacked exit
    // Check if Mod archive is unpacked
    const ActionNodeVerifyArchiveFolders: ActionNode = {
        initAction: null,
        successNode: null,
        failureNode: null
    };
    // Map temp folder
    const ActionNodeMapTemp: ActionNode = {
        initAction: new FileSystemActions.MapDirectoryThenAppendPayload(),
        successNode: null
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: ActionNodeMapTemp,
        store: store,
        payload: {
            mods
        }
    };
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
