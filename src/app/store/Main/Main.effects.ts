import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, filter, catchError, debounceTime } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';

import { InitializeApp } from './Main.tree';
import { InitializeDirectoryWatchers } from './Main.controllers';
import * as MainActions from './Main.actions';
import * as MainSelectors from './Main.selectors';
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
        this.store.pipe(
            select(MainSelectors.selectMainState)
        ).subscribe(val => this.mainState = val);
        this.store.pipe(
            select(MainSelectors.selectAppState)
        ).subscribe(val => this.appState = val);
        // this.store.select(state => state.ModManagerState.downloadedModDetail).subscribe(val => {
        //     console.log('READY TO PROCESS', val);
        // });
    }

    @Effect()
        MainInitApp$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.INIT_APP),
                map(() => {
                    console.log('INIT APP RAN');
                    const InitializationTree = InitializeApp(this.store, this.appState);
                    console.log(InitializationTree);
                    return InitializationTree.begin();
                }),
                catchError(err => {
                    this.store.dispatch(new MainActions.MainFailed(err));
                    return null;
                })
            );
    @Effect()
        MainInitAppSuccess: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.INIT_APP_SUCCESS),
                map(() => new MainActions.MainSuccess())
            );
    // STILL NEEDS WORK
    @Effect()
        MainPlay$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.PLAY),
                map(action => {
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
                })
            );
    @Effect()
        MainOpenMhwDirectory$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.OPEN_MHW_DIRECTORY),
                map(action => {
                    console.log(ipcRenderer.on('test', () => {}));
                    ipcRenderer.send('OPEN_DIRECTORY', this.mainState.mhwDirectoryPath);
                    ipcRenderer.once('OPENED_DIRECTORY', (err, args) => {
                        console.log('OPENED DIR', args);
                    });
                    return new MainActions.MainSuccess();
                })
            );
    @Effect()
        MainOpenModNexus$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.OPEN_MOD_NEXUS),
                map(action => {
                    ipcRenderer.send('OPEN_MOD_NEXUS', null);
                    return new MainActions.MainSuccess();
                })
            );
    @Effect()
        MainCloseWindow$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.CLOSE_WINDOW),
                map(action => {
                    ipcRenderer.send('CLOSE_WINDOW', null);
                    return new MainActions.MainSuccess;
                })
            );
    @Effect()
        MainMinimizeWindow$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.MINIMIZE_WINDOW),
                map(action => {
                    ipcRenderer.send('MINIMIZE_WINDOW', null);
                    return new MainActions.MainSuccess;
                })
            );
    @Effect()
        MainLoadStateSuccess$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.LOAD_STATE_SUCCESS),
                map(action => {
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
                })
            );
    @Effect()
        MainSaveState$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.SAVE_STATE),
                debounceTime(5000),
                map(action => {
                    ipcRenderer.send('SAVE_STATE', ['appState.json', this.appState] );
                    ipcRenderer.once('SAVED_STATE', (err, args) => {
                        console.log('SAVED_STATE: ', args);
                        this.store.dispatch(action.tree.success());
                    });
                    return new MainActions.MainSuccess();
                })
            );
    @Effect()
        MainSaveStateSuccess$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.SAVE_STATE_SUCCESS),
                map(action => action.tree.success())
            );
    @Effect()
        MainGetMhwDirectoryPath$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.GET_MHW_DIRECTORY_PATH),
                map(action => {
                    ipcRenderer.send('GET_MHW_DIR_PATH', null);
                    ipcRenderer.once('GOT_MHW_DIR_PATH', (err, args) => {
                        console.log(args);
                        this.store.dispatch(action.tree.success(args));
                    });
                    return new MainActions.MainSuccess;
                })
            );
    @Effect()
        MainGetMhwDirectoryPathSuccess$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.GET_MHW_DIRECTORY_PATH_SUCCESS),
                map(action => action.tree.success(action.tree.payload + '\\nativePC\\'))
            );
    @Effect()
        MainDirWatchInit$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.INIT_DIR_WATCH),
                map(action => {
                    InitializeDirectoryWatchers(this.store, this.mainState.mhwDirectoryPath);
                    return action.tree.success();
                })
            );
    @Effect()
        MainInitModManager$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.INIT_MOD_MANAGER),
                map(action => {
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
                })
            );
    @Effect()
        MainDirWatchEmit$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.DIR_WATCH_EMIT),
                debounceTime(3000),
                map(action => action.tree.success())
            );
    @Effect()
        MainSetMhwMappedDir$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.SET_MHW_MAPPED_DIR),
                map(action => {
                    if (action.tree.payload === false) {
                        return action.tree.failed();
                    } else {
                        return action.tree.success();
                    }
                })
            );
    @Effect()
        MainFailed$: Observable<any> = this.actions$
            .pipe(
                ofType(MainActions.MAIN_FAILED),
                map(action => {
                    if (action.tree) {
                        console.log('MAIN_FAILED', action.tree);
                    } else {
                        console.log('MAIN_FAILED');
                    }
                    return new MainActions.MainSuccess;
                })
            );
    @Effect()
        EndOfActionChain$: Observable<any> = this.actions$
            .pipe(
                ofType(END_OF_ACTION_TREE_PATH),
                map(action => new MainActions.MainSuccess())
            );
    @Effect()
        ActionChainFailed$: Observable<any> = this.actions$
            .pipe(
                ofType(ACTION_CHAIN_FAILED),
                map(action => {
                    console.log('CHAIN FAILED', action);
                    return new MainActions.MainFailed(action.tree);
                })
            );
}
