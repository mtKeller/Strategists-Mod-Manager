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
import { ActionTree,
         ActionNode,
         ActionTreeParams,
         END_OF_ACTION_TREE_PATH,
         ACTION_CHAIN_FAILED
} from '../../model/ActionTree.class';

const { ipcRenderer } = window.require('electron');

@Injectable()
  export class MainEffects {
    storedState: any = null;
    mainState: any = null;
    appState: any = null;
    constructor(private actions$: Actions, private store: Store<any> ) {
        this.store.select(state => state.MainState.storedState).subscribe(val => {
            this.storedState = val;
        });
        this.store.select(state => state.MainState).subscribe(val => {
            this.mainState = val;
        });
        this.store.select(state => state).subscribe(val => {
            this.appState = val;
        });
    }

    @Effect()
        MainInitApp$: Observable<any> = this.actions$
            .ofType(MainActions.INIT_APP)
            .map(action => {
                // TIER 9
                const ActionNodeInitMods: ActionNode = {
                    initAction: new MainActions.InitModManager(),
                    successNode: null,
                    failureNode: null
                };
                // TIER 8
                const ActionNodeInitDirWatch: ActionNode = {
                    initAction: new MainActions.InitDirWatch(),
                    successNode: ActionNodeInitMods,
                    failureNode: null
                };
                // TIER 7
                const ActionNodeInitSetCurrentDirs: ActionNode = {
                    initAction: new MainActions.SetMhwMappedDir(),
                    successNode: ActionNodeInitDirWatch,
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
                const actionChainParams: ActionTreeParams = {
                    payload: 'appState.json',
                    actionNode: ActionNodeReadFile,
                    store: this.store,
                };
                const initializationChain: ActionTree = new ActionTree(actionChainParams);
                console.log(initializationChain);
                initializationChain.init();
                return new MainActions.MainSuccess;
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
        MainOpenModNexus$: Observable<any> = this.actions$
            .ofType(MainActions.OPEN_MOD_NEXUS)
            .map(action => {
                ipcRenderer.send('OPEN_MOD_NEXUS', null);
                return new MainActions.MainSuccess();
            });
    @Effect()
        MainCloseWindow: Observable<any> = this.actions$
            .ofType(MainActions.CLOSE_WINDOW)
            .map(action => {
                ipcRenderer.send('CLOSE_WINDOW', null);
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainLoadStateSuccess$: Observable<any> = this.actions$
            .ofType(MainActions.LOAD_STATE_SUCCESS)
            .map(action => {
                console.log(this.mainState.mhwDirectoryPath === null, this.mainState.mhwDirectoryPath, action.tree.payload);
                if (this.mainState.mhwDirectoryPath === null) {
                    this.store.dispatch(action.tree.failed());
                } else {
                    console.log('dispatch', this.mainState.mhwDirectoryPath);
                    this.store.dispatch(action.tree.success(this.mainState.mhwDirectoryPath));
                }
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainSaveState$: Observable<any> = this.actions$
            .ofType(MainActions.SAVE_STATE)
            .map(action => {
                ipcRenderer.send('SAVE_STATE', ['appState.json', this.appState] );
                ipcRenderer.once('SAVE_STATE', (err, args) => {
                    console.log('SAVED_STATE: ', args);
                });
                return new MainActions.MainSuccess();
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
                return action.tree.success(action.tree.payload + '/nativePC/');
            });
    @Effect()
        MainDirWatchInit$: Observable<any> = this.actions$
            .ofType(MainActions.INIT_DIR_WATCH)
            .map(action => {
                ipcRenderer.send('INIT_DIR_WATCH', this.mainState.mhwDirectoryPath);
                ipcRenderer.on('DIR_CHANGED', (err, args) => {
                    // if (args === 'nativePC') {
                    //     console.log('CHANGE TO NATIVEPC');
                    // } else if (args === 'modFolder') {
                    //     console.log('CHANGE TO MODFOLDER');
                    // }
                    const ActionNodeRemapSuccess: ActionNode = {
                        initAction: new MainActions.SetMhwMappedDir(),
                        successNode: null,
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
                    initAction: new FileSystemActions.WriteFile(),
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
                    payload: this.mainState.mhwDirectoryPath + '\\mods\\',
                    store: this.store
                };
                const ActionChainInitModManager: ActionTree = new ActionTree(ActionChainParam);
                ActionChainInitModManager.init();
                return new MainActions.MainSuccess();
            });
    @Effect()
        MainDirWatchEmit$: Observable<any> = this.actions$
            .ofType(MainActions.DIR_WATCH_EMIT)
            .debounceTime(500)
            .flatMap(action => {
                this.store.dispatch(action.tree.success());
                return empty();
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
                console.log(action.tree);
                return new MainActions.MainSuccess;
            });
    @Effect()
        ActionChainFailed$: Observable<any> = this.actions$
            .ofType(ACTION_CHAIN_FAILED)
            .map(action => {
                console.log('CHAIN PASS', action);
                return new MainActions.MainFailed(action.tree);
            });
}
