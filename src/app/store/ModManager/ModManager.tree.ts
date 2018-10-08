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
    const ActionNodePrepDependencies: ActionNode = {
        initAction: null,
        successNode: null
    };
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
            modIndexes: modIndexes,
            installPaths: [],
            removePaths: []
        },
        store: store
    };
    const ActionTreePrepInstallation: ActionTree = new ActionTree(ActionTreeParam);
    return ActionTreePrepInstallation;
}

export function PrepDependencies(
        store: Store<any>,
        archiveNames: Array<string>,
        installPaths: Array<string>,
        removePaths: Array<string>,
        gameDir: string) {
    const ActionNodeEndInstallation: ActionNode = {
        initAction: null,
        successNode: null
    };
    const ActionNodeCopyMoveFiles: ActionNode = {
        initAction: new FileSystemActions.CopyMoveFiles(),
        successNode: ActionNodeEndInstallation,
    };
    const ActionNodeDeleteFiles: ActionNode = {
        initAction: new FileSystemActions.DeleteFiles(),
        successNode: ActionNodeCopyMoveFiles,
    };
    const ActionNodeUnpackFiles: ActionNode = {
        initAction: new FileSystemActions.UnpackFiles(),
        successNode: ActionNodeDeleteFiles,
    };
    const ActionNodeFilterPreexisting
    // Map temp folder
    const ActionNodeMapTemp: ActionNode = {
        initAction: new FileSystemActions.MapDirectoryThenAppendPayload(),
        successNode: ActionNodeUnpackFiles,
        payload: gameDir + '\\modFolder\\temp'
    };
    const ActionNodeBeginInstallation: ActionNode = {
        initAction: null,
        successNode: ActionNodeMapTemp
    };
    const ActionNodeAddToInstallationQue: ActionNode = {
        initAction: null,
        successNode: ActionNodeBeginInstallation,
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: ActionNodeAddToInstallationQue,
        store: store,
        payload: {
            archiveNames: archiveNames,
            installPaths: installPaths,
            removePaths: removePaths,
            gameDir: gameDir,
            modMap: null
        }
    };
    const ActionTreeInstallDependencies: ActionTree = new ActionTree(ActionTreeParam);
    return ActionTreeInstallDependencies;
}

export function InstallDependencies() {
    // Loop to start if none dispatch previous tree success
    // Remove archiveName from payload
    // Tier 0 Unpack dir
    const ActionTreeParam: ActionTreeParams = {
        actionNode: null,
        store: null,
        payload: {
            archiveNames: null,
            gameDir: null
        }
    };
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
