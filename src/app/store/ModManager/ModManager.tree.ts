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
        initAction: new ModManagerActions.PrepDependencies(),
        successNode: ActionNodeEndProcessing
    };
    const ActionNodeCheckAgainstOwnedDict: ActionNode = {
        initAction: new ModManagerActions.VerifyAgainstOwnershipDict(),
        successNode: ActionNodePrepDependencies,
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
        installPaths: Array<any>,
        removePaths: Array<any>,
        gameDir: string) {
    const ActionNodeEndInstallation: ActionNode = {
        initAction: new ModManagerActions.EndInstallation(),
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
    const ActionNodeFilterUnpackedDependencies: ActionNode = {
        initAction: new ModManagerActions.FilterUnpackedDependencies(),
        successNode: ActionNodeUnpackFiles
    };
    // Map temp folder
    const ActionNodeMapTemp: ActionNode = {
        initAction: new FileSystemActions.MapDirectoryThenAppendPayload(),
        successNode: ActionNodeFilterUnpackedDependencies,
        payload: gameDir + '\\modFolder\\temp'
    };
    const ActionNodeBeginInstallation: ActionNode = {
        initAction: new ModManagerActions.BeginModProcessing(),
        successNode: ActionNodeMapTemp
    };
    const ActionNodeAddToInstallationQue: ActionNode = {
        initAction: new ModManagerActions.AddToInstallQue(),
        successNode: ActionNodeBeginInstallation,
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: ActionNodeAddToInstallationQue,
        store: store,
        payload: {
            archiveNames: archiveNames,
            installPaths: installPaths.filter(item => item.path.indexOf('.txt') === -1),
            removePaths: removePaths,
            gameDir: gameDir,
            modMap: null
        }
    };
    const ActionTreeInstallDependencies: ActionTree = new ActionTree(ActionTreeParam);
    console.log(ActionTreeInstallDependencies);
    return ActionTreeInstallDependencies;
}

export function PrepRemoval(
    store: Store<any>,
    mod: Mod,
    modIndexes: Array<number>) {
    const ActionNodeEndProcessing: ActionNode = {
        initAction: new ModManagerActions.ModProcessed(),
        successNode: null
    };
    const ActionNodePrepDependencies: ActionNode = {
        initAction: new ModManagerActions.PrepDependencies(),
        successNode: ActionNodeEndProcessing
    };
    const ActionNodeRemoveFromOwnershipDict: ActionNode = {
        initAction: new ModManagerActions.RemoveModFromOwnershipDict(),
        successNode: ActionNodePrepDependencies,
    };
    const ActionNodeFilterModMap: ActionNode = {
        initAction: new ModManagerActions.FilterModMap(),
        successNode: ActionNodeRemoveFromOwnershipDict,
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
            archiveName: mod.archiveNames[modIndexes[1]],
            modIndexes: modIndexes,
            installPaths: [],
            removePaths: []
        },
        store: store
    };
    const ActionTreePrepRemoval: ActionTree = new ActionTree(ActionTreeParam);
    return ActionTreePrepRemoval;
}
