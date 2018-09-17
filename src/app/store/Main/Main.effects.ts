import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import '../../helpers/rxjs-operators';

import * as MainActions from './Main.actions';
import * as FileSystemActions from '../FileSystem/FileSystem.actions';
import { ActionChain,
         ActionNode,
         ActionChainParams,
         END_OF_ACTION_CHAIN,
         ACTION_CHAIN_FAILED
} from '../../model/ActionChain.class';

const { ipcRenderer } = window.require('electron');

@Injectable()
  export class MainEffects {
    storedState: any = null;
    mainState: any = null;
    constructor(private actions$: Actions, private store: Store<any> ) {
        this.store.select(state => state.MainState.storedState).subscribe(val => {
            this.storedState = val;
        });
        this.store.select(state => state.MainState).subscribe(val => {
            this.mainState = val;
        });
    }

    @Effect()
        MainInitApp$: Observable<any> = this.actions$
            .ofType(MainActions.INIT_APP)
            .map(action => {
                console.log('Testing action chain');
                // TIER 8
                const ActionNodeInitDirWatch: ActionNode = {
                    initAction: new MainActions.InitDirWatch(),
                    successAction: null,
                    failedAction: null
                };
                // TIER 7
                const ActionNodeInitSetCurrentDirs: ActionNode = {
                    initAction: new MainActions.SetMhwMappedDir(),
                    successAction: ActionNodeInitDirWatch,
                    failedAction: null
                };
                // TIER 6
                const ActionNodeGetDir: ActionNode = {
                    initAction: new FileSystemActions.GetDirectories(),
                    successAction: ActionNodeInitSetCurrentDirs,
                    failedAction: null
                };
                // TIER 5
                const ActionNodeGetMhwDirPathSuccess: ActionNode = {
                    initAction: new MainActions.GetMhwDirectoryPathSuccess(),
                    successAction: ActionNodeGetDir,
                    failedAction: null
                };
                // TIER 4
                const ActionNodeGetMhwDirPath: ActionNode = {
                    initAction: new MainActions.GetMhwDirectoryPath(),
                    successAction: ActionNodeGetMhwDirPathSuccess,
                    failedAction: null
                };
                // TIER 3
                const ActionNodeWriteFileSuccess: ActionNode = {
                    initAction: new FileSystemActions.WriteFileSuccess(),
                    successAction: null,
                    failedAction: null
                };
                const ActionNodeLoadStateSuccess: ActionNode = {
                    initAction: new MainActions.LoadStateSuccess(),
                    successAction: null,
                    failedAction: ActionNodeGetMhwDirPath
                };
                // TIER 2
                const ActionNodeReadFilesSuccess: ActionNode = {
                    initAction: new FileSystemActions.ReadFileSuccess(),
                    successAction: ActionNodeLoadStateSuccess,
                    failedAction: null
                };
                const ActionNodeWriteFile: ActionNode = {
                    initAction: new FileSystemActions.WriteFile(),
                    successAction: ActionNodeWriteFileSuccess,
                    failedAction: null
                };
                // TIER 1
                const ActionNodeReadFile: ActionNode = {
                    initAction: new FileSystemActions.ReadFile(),
                    successAction: ActionNodeReadFilesSuccess,
                    failedAction: ActionNodeWriteFile
                };
                // TIER 0
                const actionChainParams: ActionChainParams = {
                    payload: 'appState.json',
                    actionNode: ActionNodeReadFile,
                    store: this.store,
                };
                const initializationChain = new ActionChain(actionChainParams);
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
                if (this.storedState.mhwDirectory === undefined) {
                    this.store.dispatch(action.chain.failed());
                } else {
                    this.store.dispatch(action.chain.success());
                }
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainGetMhwDirectoryPath$: Observable<any> = this.actions$
            .ofType(MainActions.GET_MHW_DIRECTORY_PATH)
            .map(action => {
                ipcRenderer.send('GET_MHW_DIR_PATH', null);
                ipcRenderer.once('GOT_MHW_DIR_PATH', (err, args) => {
                    console.log(args);
                    this.store.dispatch(action.chain.success(args));
                });
                return new MainActions.MainSuccess;
            });
    @Effect()
        MainGetMhwDirectoryPathSuccess$: Observable<any> = this.actions$
            .ofType(MainActions.GET_MHW_DIRECTORY_PATH_SUCCESS)
            .map(action => {
                return action.chain.success(action.chain.payload + '/nativePC/');
            });
    @Effect()
        MainDirWatchInit$: Observable<any> = this.actions$
            .ofType(MainActions.INIT_DIR_WATCH)
            .map(action => {
                ipcRenderer.send('INIT_DIR_WATCH', null);
                ipcRenderer.on('DIR_CHANGED', (err, args) => {
                    // if (args === 'nativePC') {
                    //     console.log('CHANGE TO NATIVEPC');
                    // } else if (args === 'modFolder') {
                    //     console.log('CHANGE TO MODFOLDER');
                    // }
                    const ActionNodeRemapSuccess: ActionNode = {
                        initAction: new FileSystemActions.GetDirectoriesSuccess(),
                        successAction: null,
                        failedAction: null
                    };
                    const ActionNodeRemap: ActionNode = {
                        initAction: new FileSystemActions.GetDirectories(),
                        successAction: ActionNodeRemapSuccess,
                        failedAction: null
                    };
                    const ActionNodeEmit: ActionNode = {
                        initAction: new MainActions.DirWatchEmit(),
                        successAction: ActionNodeRemap,
                        failedAction: null
                    };
                    const ActionChainParamsRemap: ActionChainParams = {
                        payload: this.mainState.mhwDirectory,
                        actionNode: ActionNodeEmit,
                        store: this.store
                    };
                    const ActionChainRemapDirs: ActionChain = new ActionChain(ActionChainParamsRemap);
                    ActionChainRemapDirs.init();
                });
                return new MainActions.MainSuccess();
            });
    @Effect()
        MainDirWatchEmit$: Observable<any> = this.actions$
            .ofType(MainActions.DIR_WATCH_EMIT)
            .debounceTime(500)
            .map(action => {
                console.log('changes_counted');
                return action.chain.success();
            });
    @Effect()
    @Effect()
        MainSetMhwMappedDir$: Observable<any> = this.actions$
            .ofType(MainActions.SET_MHW_MAPPED_DIR)
            .map(action => {
                if (action.chain.payload === false) {
                    return action.chain.failed();
                } else {
                    return action.chain.success();
                }
            });
        MainFailed$: Observable<any> = this.actions$
            .ofType(MainActions.MAIN_FAILED)
            .map(action => {
                if (action.chain) {
                    console.log('MAIN_FAILED', action.chain.toString());
                } else {
                    console.log('MAIN_FAILED');
                }
                return new MainActions.MainSuccess;
            });
    @Effect()
        EndOfActionChain$: Observable<any> = this.actions$
            .ofType(END_OF_ACTION_CHAIN)
            .map(action => {
                console.log(action.chain);
                return new MainActions.MainSuccess;
            });
    @Effect()
        ActionChainFailed$: Observable<any> = this.actions$
            .ofType(ACTION_CHAIN_FAILED)
            .map(action => {
                console.log('CHAIN PASS', action);
                return new MainActions.MainFailed(action.chain);
            });
}
