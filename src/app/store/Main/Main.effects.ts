import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/Observable/empty';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import '../../helpers/rxjs-operators';

import * as MainActions from './Main.actions';
import * as FileSystemActions from '../FileSystem/FileSystem.actions';
import * as DownloadManagerActions from '../DownloadManager/DownloadManager.actions';
import * as ModManagerActions from '../ModManager/ModManager.actions';

import { ActionTree,
         ActionNode,
         ActionTreeParams,
         END_OF_ACTION_TREE_PATH,
         ACTION_CHAIN_FAILED
} from '../../model/ActionTree.class';

const { ipcRenderer } = window.require('electron');

@Injectable()
  export class MainEffects {
    mainState: any = null;
    appState: any = null;
    constructor(private actions$: Actions, private store: Store<any> ) {
        this.store.select(state => state.MainState).subscribe(val => {
            this.mainState = val;
        });
        this.store.select(state => state).subscribe(val => {
            this.appState = val;
        });
        // this.store.select(state => state.ModManagerState.downloadedModDetail).subscribe(val => {
        //     console.log('READY TO PROCESS', val);
        // });
    }

    @Effect()
        MainInitApp$: Observable<any> = this.actions$
            .ofType(MainActions.INIT_APP)
            .map(action => {
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
                // TIER 3
                const ActionNodeWriteFileSuccess: ActionNode = {
                    initAction: new FileSystemActions.WriteFileSuccess(),
                    successNode: ActionNodeGetMhwDirPath,
                    failureNode: null
                };
                const ActionNodeLoadStateSuccess: ActionNode = {
                    initAction: new MainActions.LoadStateSuccess(),
                    successNode: ActionNodeInitDirWatch,
                    failureNode: ActionNodeGetMhwDirPath
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
                    payload: ['appState.json', this.appState]
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
                    store: this.store,
                };
                const initializationTree: ActionTree = new ActionTree(ActionTreeParam);
                console.log('INIT_TREE', initializationTree);
                return initializationTree.begin();
            })
            .catch(err => {
                this.store.dispatch(new MainActions.MainFailed(err));
                return null;
            });
    @Effect()
        MainInitAppSuccess: Observable<any> = this.actions$
            .ofType(MainActions.INIT_APP_SUCCESS)
            .map(action => {
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainPlay$: Observable<any> = this.actions$
            .ofType(MainActions.PLAY)
            .map(action => {
                const ActionNodeExecProcessMhw: ActionNode = {
                    initAction: new FileSystemActions.ExecProcess(),
                    successNode: null,
                    failureNode: null
                };
                const ActionChainParam: ActionTreeParams = {
                    actionNode: ActionNodeExecProcessMhw,
                    payload: this.mainState.mhwDirectoryPath + '\\MonsterHunterWorld.exe',
                    store: this.store
                };
                const ActionChainExecMhw: ActionTree = new ActionTree(ActionChainParam);
                ActionChainExecMhw.init();
                return new MainActions.MainSuccess();
            });
    @Effect()
        MainOpenMhwDirectory$: Observable<any> = this.actions$
            .ofType(MainActions.OPEN_MHW_DIRECTORY)
            .map(action => {
                console.log(ipcRenderer.on('test', () => {}));
                ipcRenderer.send('OPEN_DIRECTORY', this.mainState.mhwDirectoryPath);
                ipcRenderer.once('OPENED_DIRECTORY', (err, args) => {
                    console.log('OPENED DIR', args);
                });
                return new MainActions.MainSuccess();
            });
    @Effect()
        MainOpenModNexus$: Observable<any> = this.actions$
            .ofType(MainActions.OPEN_MOD_NEXUS)
            .map(action => {
                ipcRenderer.send('OPEN_MOD_NEXUS', null);
                return new MainActions.MainSuccess();
            });
    @Effect()
        MainCloseWindow$: Observable<any> = this.actions$
            .ofType(MainActions.CLOSE_WINDOW)
            .map(action => {
                ipcRenderer.send('CLOSE_WINDOW', null);
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainMinimizeWindow$: Observable<any> = this.actions$
            .ofType(MainActions.MINIMIZE_WINDOW)
            .map(action => {
                ipcRenderer.send('MINIMIZE_WINDOW', null);
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainLoadStateSuccess$: Observable<any> = this.actions$
            .ofType(MainActions.LOAD_STATE_SUCCESS)
            .map(action => {
                // console.log(this.mainState.mhwDirectoryPath === null, this.mainState.mhwDirectoryPath, action.tree.payload,
                //     action.tree.currentNode);
                if (this.mainState.mhwDirectoryPath === null) {
                    this.store.dispatch(action.tree.failed());
                } else {
                    const ActionNodeDownloadManagerSetState: ActionNode = {
                        initAction: new DownloadManagerActions.SetState(),
                        successNode: null,
                        failureNode: null
                    };
                    const ActionNodeModManagerSetState: ActionNode = {
                        initAction: new ModManagerActions.SetState(),
                        successNode: ActionNodeDownloadManagerSetState,
                        failureNode: null
                    };
                    const ActionTreeParam: ActionTreeParams = {
                        actionNode: ActionNodeModManagerSetState,
                        payload: action.tree.payload,
                        store: this.store
                    };
                    const ActionTreeSetState: ActionTree = new ActionTree(ActionTreeParam);
                    ActionTreeSetState.init();
                    this.store.dispatch(action.tree.success(this.mainState.mhwDirectoryPath));
                }
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainSaveState$: Observable<any> = this.actions$
            .ofType(MainActions.SAVE_STATE)
            .debounceTime(1000)
            .map(action => {
                ipcRenderer.send('SAVE_STATE', ['appState.json', this.appState] );
                ipcRenderer.once('SAVED_STATE', (err, args) => {
                    console.log('SAVED_STATE: ', args);
                    this.store.dispatch(action.tree.success());
                });
                return new MainActions.MainSuccess();
            });
    @Effect()
        MainSaveStateSuccess$: Observable<any> = this.actions$
            .ofType(MainActions.SAVE_STATE_SUCCESS)
            .map(action => {
                return action.tree.success();
            });
    @Effect()
        MainGetMhwDirectoryPath$: Observable<any> = this.actions$
            .ofType(MainActions.GET_MHW_DIRECTORY_PATH)
            .map(action => {
                ipcRenderer.send('GET_MHW_DIR_PATH', null);
                ipcRenderer.once('GOT_MHW_DIR_PATH', (err, args) => {
                    console.log(args);
                    this.store.dispatch(action.tree.success(args));
                });
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainGetMhwDirectoryPathSuccess$: Observable<any> = this.actions$
            .ofType(MainActions.GET_MHW_DIRECTORY_PATH_SUCCESS)
            .map(action => {
                return action.tree.success(action.tree.payload + '\\nativePC\\');
            });
    @Effect()
        MainDirWatchInit$: Observable<any> = this.actions$
            .ofType(MainActions.INIT_DIR_WATCH)
            .map(action => {
                // console.log('DIRS ARE WATCHED');
                ipcRenderer.send('INIT_DIR_WATCH', this.mainState.mhwDirectoryPath);
                ipcRenderer.on('DIR_CHANGED', (err, args) => {
                    // console.log('PING');
                    if (args === 'nativePC') {
                        console.log('hit');
                        // const ActionNodeSaveStateSuccess: ActionNode = {
                        //     initAction: new MainActions.SaveStateSuccess(),
                        //     successNode: null,
                        //     failureNode: null
                        // };
                        // const ActionNodeSaveState: ActionNode = {
                        //     initAction: new MainActions.SaveState(),
                        //     successNode: ActionNodeSaveStateSuccess,
                        //     failureNode: null
                        // };
                        // const ActionNodeSetNativePcMap: ActionNode = {
                        //     initAction: new ModManagerActions.SetNativePcMap(),
                        //     successNode: ActionNodeSaveState,
                        //     failureNode: null
                        // };
                        // const ActionNodeGetNativePcMap: ActionNode = {
                        //     initAction: new FileSystemActions.GetNativePcMap(),
                        //     successNode: ActionNodeSetNativePcMap,
                        //     failureNode: null
                        // };
                        // const ActionNodeRemapSuccess: ActionNode = {
                        //     initAction: new MainActions.SetMhwMappedDir(),
                        //     successNode: ActionNodeGetNativePcMap,
                        //     failureNode: null
                        // };
                        // const ActionNodeRemap: ActionNode = {
                        //     initAction: new FileSystemActions.GetDirectories(),
                        //     successNode: ActionNodeRemapSuccess,
                        //     failureNode: null
                        // };
                        // const ActionNodeEmit: ActionNode = {
                        //     initAction: new MainActions.DirWatchEmit(),
                        //     successNode: ActionNodeRemap,
                        //     failureNode: null
                        // };
                        // const ActionChainParamsRemap: ActionTreeParams = {
                        //     payload: this.mainState.mhwDirectory,
                        //     actionNode: ActionNodeEmit,
                        //     store: this.store
                        // };
                        // const ActionChainRemapDirs: ActionTree = new ActionTree(ActionChainParamsRemap);
                        // ActionChainRemapDirs.init();
                    } else if (args === 'modFolder') {
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
                            payload: this.mainState.mhwDirectory,
                            actionNode: ActionNodeEmit,
                            store: this.store
                        };
                        const ActionChainRemapDirs: ActionTree = new ActionTree(ActionChainParamsRemap);
                        ActionChainRemapDirs.init();
                    }
                });
                return action.tree.success();
            });
    @Effect()
        MainInitModManager$: Observable<any> = this.actions$
            .ofType(MainActions.INIT_MOD_MANAGER)
            .map(action => {
                const ActionNodeInitDownloadManager: ActionNode = {
                    initAction: new DownloadManagerActions.InitDownloadManager(),
                    successNode: null,
                    failureNode: null
                };
                const ActionNodeCreateModDirectorySuccess: ActionNode = {
                    initAction: new FileSystemActions.WriteFileSuccess(),
                    successNode: ActionNodeInitDownloadManager,
                    failureNode: null
                };
                const ActionNodeCreateModDirectory: ActionNode = {
                    initAction: new FileSystemActions.CreateModdingDirectories(),
                    successNode: ActionNodeCreateModDirectorySuccess,
                    failureNode: null
                };
                const ActionNodeVerifyModDirectory: ActionNode = {
                    initAction: new FileSystemActions.ReadFile(),
                    successNode: ActionNodeInitDownloadManager,
                    failureNode: ActionNodeCreateModDirectory
                };
                const ActionChainParam: ActionTreeParams = {
                    actionNode: ActionNodeVerifyModDirectory,
                    payload: this.mainState.mhwDirectoryPath + '\\modFolder\\',
                    store: this.store
                };
                const ActionChainInitModManager: ActionTree = new ActionTree(ActionChainParam);
                console.log('MANAGER LOOP', ActionChainInitModManager);
                ActionChainInitModManager.init();
                return action.tree.success();
            });
    @Effect()
        MainDirWatchEmit$: Observable<any> = this.actions$
            .ofType(MainActions.DIR_WATCH_EMIT)
            .debounceTime(1000)
            .map(action => {
                return action.tree.success();
            });
    @Effect()
        MainSetMhwMappedDir$: Observable<any> = this.actions$
            .ofType(MainActions.SET_MHW_MAPPED_DIR)
            .map(action => {
                if (action.tree.payload === false) {
                    return action.tree.failed();
                } else {
                    return action.tree.success();
                }
            });
    @Effect()
        MainFailed$: Observable<any> = this.actions$
            .ofType(MainActions.MAIN_FAILED)
            .map(action => {
                if (action.tree) {
                    console.log('MAIN_FAILED', action.tree);
                } else {
                    console.log('MAIN_FAILED');
                }
                return new MainActions.MainSuccess;
            });
    @Effect()
        EndOfActionChain$: Observable<any> = this.actions$
            .ofType(END_OF_ACTION_TREE_PATH)
            .map(action => {
                // console.log(action.tree);
                return new MainActions.MainSuccess;
            });
    @Effect()
        ActionChainFailed$: Observable<any> = this.actions$
            .ofType(ACTION_CHAIN_FAILED)
            .map(action => {
                console.log('CHAIN FAILED', action);
                return new MainActions.MainFailed(action.tree);
            });
}
