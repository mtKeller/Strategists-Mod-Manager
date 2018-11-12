import * as ModManagerActions from './ModManager.actions';
import * as FileSystemActions from '../FileSystem/FileSystem.actions';
import * as DownloadManagerActions from '../DownloadManager/DownloadManager.actions';
import {Action, Store} from '@ngrx/store';
import { ActionTree,
    ActionNode,
    ActionTreeParams,
} from '../../model/ActionTree.class';
import { Mod } from './ModManager.state';

function replaceAll(str , search, replacement) {
    const target = str;
    return target.split(search).join(replacement);
}

export function Process7ZipMod(
    store: Store<any>,
    action: Action
) {
    const ActionNodeModProcessed: ActionNode = {
        initAction: new ModManagerActions.ModProcessed(),
        successNode: null,
    };
    const ActionNodeDeleteModDetailFromDownload: ActionNode = {
        initAction: new ModManagerActions.RemoveModDetail(),
        successNode: ActionNodeModProcessed,
        payload: action.payload.modArchiveName
    };
    const ActionNodeDeleteDownloadItem: ActionNode = {
        initAction: new DownloadManagerActions.RemoveDownloadItem(),
        successNode: ActionNodeDeleteModDetailFromDownload,
        payload: action.payload.modArchiveName
    };
    // UPDATE PROGRESS TO 100
    const ActionNodeUpdateProgress100: ActionNode = {
        initAction: new ModManagerActions.UpdateProcessingProgress(),
        successNode: ActionNodeDeleteDownloadItem,
        payload: 100
    };
    // Tier 1 Add Payload to Mod list
    const ActionNodeAddModToModList: ActionNode = {
        initAction: new ModManagerActions.AddModToModList(),
        successNode: ActionNodeUpdateProgress100,
    };
    // UPDATE PROGRESS TO 50
    const ActionNodeUpdateProgress50: ActionNode = {
        initAction: new ModManagerActions.UpdateProcessingProgress(),
        successNode: ActionNodeAddModToModList,
        payload: 50
    };
    const ActionNodeView7ZipContents: ActionNode = {
        initAction: new FileSystemActions.View7ZippedContents(),
        successNode: ActionNodeUpdateProgress50,
        payload: action.payload.modArchivePath
    };
    const ActionNodeBeginModProcessing: ActionNode = {
        initAction: new ModManagerActions.BeginModProcessing(),
        successNode: ActionNodeView7ZipContents,
    };
    const ActionNodeAddModToProcessingQue: ActionNode = {
        initAction: new ModManagerActions.AddModToProcessingQue(),
        successNode: ActionNodeBeginModProcessing,
        payload: action.payload.modArchiveName
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: ActionNodeAddModToProcessingQue,
        payload: action.payload,
        store: store
    };
    const ActionTreeProcess7ZipMod: ActionTree = new ActionTree(ActionTreeParam);
    // console.log('PROCESS_NODE_TREE_7ZIP', ActionTreeProcess7ZipMod);
    return ActionTreeProcess7ZipMod;
}

export function ProcessZipMod(
    store: Store<any>,
    action: Action
) {
    const ActionNodeModProcessed: ActionNode = {
        initAction: new ModManagerActions.ModProcessed(),
        successNode: null,
    };
    const ActionNodeDeleteModDetailFromDownload: ActionNode = {
        initAction: new ModManagerActions.RemoveModDetail(),
        successNode: ActionNodeModProcessed,
        payload: action.payload.modArchiveName
    };
    const ActionNodeDeleteDownloadItem: ActionNode = {
        initAction: new DownloadManagerActions.RemoveDownloadItem(),
        successNode: ActionNodeDeleteModDetailFromDownload,
        payload: action.payload.modArchiveName
    };
    // UPDATE PROGRESS TO 100
    const ActionNodeUpdateProgress100: ActionNode = {
        initAction: new ModManagerActions.UpdateProcessingProgress(),
        successNode: ActionNodeDeleteDownloadItem,
        payload: 100
    };
    // Tier 1 Add Payload to Mod list
    const ActionNodeAddModToModList: ActionNode = {
        initAction: new ModManagerActions.AddModToModList(),
        successNode: ActionNodeUpdateProgress100,
    };
    // UPDATE PROGRESS TO 50
    const ActionNodeUpdateProgress50: ActionNode = {
        initAction: new ModManagerActions.UpdateProcessingProgress(),
        successNode: ActionNodeAddModToModList,
        payload: 50
    };
    // Tier 0 get ZIP LIST of Payload add to payload
    const ActionNodeViewZipContents: ActionNode = {
        initAction: new FileSystemActions.ViewZippedContents(),
        successNode: ActionNodeUpdateProgress50,
        payload: action.payload.modArchivePath
    };
    const ActionNodeBeginModProcessing: ActionNode = {
        initAction: new ModManagerActions.BeginModProcessing(),
        successNode: ActionNodeViewZipContents,
    };
    const ActionNodeAddModToProcessingQue: ActionNode = {
        initAction: new ModManagerActions.AddModToProcessingQue(),
        successNode: ActionNodeBeginModProcessing,
        payload: action.payload.modArchiveName
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: ActionNodeAddModToProcessingQue,
        payload: action.payload,
        store: store
    };
    const ActionTreeProcessZipMod: ActionTree = new ActionTree(ActionTreeParam);
    // console.log('PROCESS_NODE_TREE_ZIP', ActionTreeProcessZipMod);
    return ActionTreeProcessZipMod;
}

export function ProcessRarMod(
    store: Store<any>,
    action: Action,
    mhwDIR: string
) {
    const ActionNodeModProcessed: ActionNode = {
        initAction: new ModManagerActions.ModProcessed(),
        successNode: null,
    };
    const ActionNodeDeleteModDetailFromDownload: ActionNode = {
        initAction: new ModManagerActions.RemoveModDetail(),
        successNode: ActionNodeModProcessed,
        payload: action.payload.modArchiveName
    };
    const ActionNodeDeleteDownloadItem: ActionNode = {
        initAction: new DownloadManagerActions.RemoveDownloadItem(),
        successNode: ActionNodeDeleteModDetailFromDownload,
        payload: action.payload.modArchiveName
    };
    const ActionNodeUpdateProgress100: ActionNode = {
        initAction: new ModManagerActions.UpdateProcessingProgress(),
        successNode: ActionNodeDeleteDownloadItem,
        payload: 100
    };
    // PROGRESS
    const ActionNodeDeleteDir: ActionNode = {
        initAction: new FileSystemActions.DeleteDirectory(),
        successNode: ActionNodeUpdateProgress100,
        payload: mhwDIR + `\\modFolder\\temp\\${action.payload.modArchiveName.split('.')[0]}\\`
    };
    // TIER 3 DELETE OWN DIR
    const ActionNodeUpdateProgress75: ActionNode = {
        initAction: new ModManagerActions.UpdateProcessingProgress(),
        successNode: ActionNodeDeleteDir,
        payload: 75
    };
    // UPDATE PROGRESS TO 100
    const ActionNodeAddModToModList: ActionNode = {
        initAction: new ModManagerActions.AddModToModList(),
        successNode: ActionNodeUpdateProgress75,
    };
    // TIER 2 ADD MAP TO PAYLOAD THEN ADD MOD TO MOD LIST
    // UPDATE PROGRESS TO 66
    const ActionNodeUpdateProgress50: ActionNode = {
        initAction: new ModManagerActions.UpdateProcessingProgress(),
        successNode: ActionNodeAddModToModList,
        payload: 50
    };
    // Tier 1 MAP OWN DIR
    const ActionNodeMapDirectory: ActionNode = {
        initAction: new FileSystemActions.MapDirectoryThenAppendPayload(),
        successNode: ActionNodeUpdateProgress50,
        payload: mhwDIR + `\\modFolder\\temp\\${action.payload.modArchiveName.split('.')[0]}\\`
    };
    // UPDATE PROGRESS TO 33
    const ActionNodeUpdateProgress25: ActionNode = {
        initAction: new ModManagerActions.UpdateProcessingProgress(),
        successNode: ActionNodeMapDirectory,
        payload: 25
    };
    // Tier 0 UNRAR INTO OWN DIR IN TEMP
    const ActionNodeUnRarFile: ActionNode = {
        initAction: new FileSystemActions.UnrarFile(),
        successNode: ActionNodeUpdateProgress25,
        failureNode: null,
        payload: [replaceAll(action.payload.modArchivePath, '/', '\\'),
            mhwDIR + `\\modFolder\\temp\\${action.payload.modArchiveName.split('.')[0]}\\`]
    };
    const ActionNodeBeginModProcessing: ActionNode = {
        initAction: new ModManagerActions.BeginModProcessing(),
        successNode: ActionNodeUnRarFile,
    };
    const ActionNodeAddModToProcessingQue: ActionNode = {
        initAction: new ModManagerActions.AddModToProcessingQue(),
        successNode: ActionNodeBeginModProcessing,
        payload: action.payload.modArchiveName
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: ActionNodeAddModToProcessingQue,
        payload: action.payload,
        store: store
    };
    const ActionTreeProcessRarMod: ActionTree = new ActionTree(ActionTreeParam);
    return ActionTreeProcessRarMod;
}

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

export function UpdateInstallationsViaModRemoval(store) {
    const ActionNodeBeginInstallation: ActionNode = {
        initAction: new ModManagerActions.BeginModProcessing(),
        successNode: null
    };
    const ActionNodeAddToInstallationQue: ActionNode = {
        initAction: new ModManagerActions.AddToInstallQue(),
        successNode: ActionNodeBeginInstallation,
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: null,
        payload: null,
        store: store
    };
    const ActionTreeUpdateInstallations: ActionTree = new ActionTree(ActionTreeParam);
    return ActionTreeUpdateInstallations;
}

function ContinueCascadeBranch(END_NODE: ActionNode): ActionNode {
    const ActionNodeContinueDeletionCascade: ActionNode = {
        initAction: new ModManagerActions.ContinueDeletionCascade(),
        successNode: END_NODE
    };
    const ActionNodeModIsInstalled: ActionNode = {
        initAction: null,
        successNode: null,
        failureNode: null
    };

    return ActionNodeModIsInstalled;
}

function ModIsInstalledBranch(END_NODE): ActionNode {
    const ActionNodeModIsInstalled: ActionNode = {
        initAction: null,
        successNode: null,
        failureNode: null
    };

    return ActionNodeModIsInstalled;
}

export function prepRemovalFromLoadOrder() {
    // DO THIS SHIT AFTER THE TWO CONTROL STRUCTURES ARE ADDED
}

export function deleteModCascade(store, mod: Mod) {
    const ActionNodeEndProcessing: ActionNode = {
        initAction: new ModManagerActions.ModProcessed(),
        successNode: null
    };
    const ActionNodeUpdateOwnershipDict: ActionNode = {
        initAction: null,
        successNode: null
    };
    const ActionNodeUpdateLoadOrderAndAppendNewModIndexes: ActionNode = {
        initAction: null,
        successNode: null
    };
    const ActionNodeRemoveModFromModList: ActionNode = {
        initAction: null,
        successNode: null,
    };
    const ActionNodeContinueDeletionCascadeC: ActionNode = {
        initAction: new ModManagerActions.ContinueDeletionCascade, // BRANCH
        successNode: ContinueCascadeBranch(ActionNodeRemoveModFromModList), // IF MOD HAS NO CHILDREN
        failureNode: ActionNodeRemoveModFromModList,
        // IF MOD STILL HAS CHILDREN
    };
    const ActionNodePrepDeletion: ActionNode = {
        initAction: new ModManagerActions.PrepDeletion(),
        successNode: null, // If INSTALLED
        failureNode: ActionNodeContinueDeletionCascadeC // IF NOT INSTALLED
    };
    const ActionNodeBeginProcessing: ActionNode = {
        initAction: new ModManagerActions.BeginModProcessing(),
        successNode: ActionNodePrepDeletion,
    };
    const ActionNodeAddToProcessingQue: ActionNode = {
        initAction: new ModManagerActions.AddModToProcessingQue(),
        successNode: ActionNodeBeginProcessing,
    };
    const ActionTreeParam: ActionTreeParams = {
        actionNode: null,
        payload: null,
        store: store
    };
    const ActionTreeDeletionCascade: ActionTree = new ActionTree(ActionTreeParam);
    return ActionTreeDeletionCascade;
}
