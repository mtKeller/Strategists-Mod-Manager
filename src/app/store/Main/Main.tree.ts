// THIS WILL BECOME A GENERATED FILE AFTER THIS PROJECT
import * as MainActions from './Main.actions';
import * as FileSystemActions from '../FileSystem/FileSystem.actions';
import * as ModManagerActions from '../ModManager/ModManager.actions';
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

export function RemapDirectory(store: Store<any>, mhwDir: string) {
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
    const ActionNodeSetModFolderMap: ActionNode = {
        initAction: new ModManagerActions.SetModFolderMap(),
        successNode: ActionNodeSaveState,
        failureNode: null
    };
    const ActionNodeGetModFolderMap: ActionNode = {
        initAction: new FileSystemActions.GetModFolderMap(),
        successNode: ActionNodeSetModFolderMap,
        failureNode: null
    };
    const ActionNodeRemapSuccess: ActionNode = {
        initAction: new MainActions.SetMhwMappedDir(),
        successNode: ActionNodeGetModFolderMap,
        failureNode: null
    };
    const ActionNodeRemap: ActionNode = {
        initAction: new FileSystemActions.GetDirectories(),
        successNode: ActionNodeRemapSuccess,
        failureNode: null
    };
    const ActionNodeEmit: ActionNode = {
        initAction: new MainActions.DirWatchEmit(),
        successNode: ActionNodeRemap,
        failureNode: null
    };
    const ActionChainParamsRemap: ActionTreeParams = {
        payload: mhwDir,
        actionNode: ActionNodeEmit,
        store: store
    };
    const ActionChainRemapDirs: ActionTree = new ActionTree(ActionChainParamsRemap);
    return ActionChainRemapDirs;
}

export function InitializeApp(store: Store<any>, appState: any) {
      // TIER 12
    const ActionNodeInitModManager: ActionNode = {
        initAction: new MainActions.InitModManager(),
        successNode: null,
        failureNode: null
    };
      // TIER 11
    const ActionNodeInitDirWatch: ActionNode = {
        initAction: new MainActions.InitDirWatch(),
        successNode: ActionNodeInitModManager,
        failureNode: null
    };
    // TIER 10
    const ActionNodeSaveStateSuccess: ActionNode = {
        initAction: new MainActions.SaveStateSuccess(),
        successNode: ActionNodeInitDirWatch,
        failureNode: null
    };
    // TIER 9
    const ActionNodeSaveState: ActionNode = {
        initAction: new MainActions.SaveState(),
        successNode: ActionNodeSaveStateSuccess,
        failureNode: null
    };
    // TIER 7
    const ActionNodeInitSetCurrentDirs: ActionNode = {
        initAction: new MainActions.SetMhwMappedDir(),
        successNode: ActionNodeSaveState,
        failureNode: null
    };
    // TIER 6
    const ActionNodeGetDir: ActionNode = {
        initAction: new FileSystemActions.GetDirectories(),
        successNode: ActionNodeInitSetCurrentDirs,
        failureNode: null
    };
    // TIER 5
    const ActionNodeGetMhwDirPathSuccess: ActionNode = {
        initAction: new MainActions.GetMhwDirectoryPathSuccess(),
        successNode: ActionNodeGetDir,
        failureNode: null
    };
    // TIER 4
    const ActionNodeGetMhwDirPath: ActionNode = {
        initAction: new MainActions.GetMhwDirectoryPath(),
        successNode: ActionNodeGetMhwDirPathSuccess,
        failureNode: null
    };
    const ActionNodeHaltAction: ActionNode = {
        initAction: new MainActions.HaltAction(),
        successNode: ActionNodeGetMhwDirPath
    };
    // TIER 3
    const ActionNodeWriteFileSuccess: ActionNode = {
        initAction: new FileSystemActions.WriteFileSuccess(),
        successNode: ActionNodeHaltAction,
        failureNode: null
    };
    const ActionNodeLoadStateSuccess: ActionNode = {
        initAction: new MainActions.LoadStateSuccess(),
        successNode: ActionNodeInitDirWatch,
        failureNode: ActionNodeHaltAction
    };
    // TIER 2
    const ActionNodeReadFilesSuccess: ActionNode = {
        initAction: new FileSystemActions.ReadFileSuccess(),
        successNode: ActionNodeLoadStateSuccess,
        failureNode: null
    };
    const ActionNodeWriteFile: ActionNode = {
        initAction: new FileSystemActions.WriteFile(),
        successNode: ActionNodeWriteFileSuccess,
        failureNode: null,
        payload: ['appState.json', appState]
    };
    // TIER 1
    const ActionNodeReadFile: ActionNode = {
        initAction: new FileSystemActions.ReadFile(),
        successNode: ActionNodeReadFilesSuccess,
        failureNode: ActionNodeWriteFile
    };
    // TIER 0
    const ActionTreeParam: ActionTreeParams = {
        payload: 'appState.json',
        actionNode: ActionNodeReadFile,
        store: store,
    };
    const InitializationTree: ActionTree = new ActionTree(ActionTreeParam);
    // console.log('INIT_TREE', initializationTree);
    return InitializationTree;
}
