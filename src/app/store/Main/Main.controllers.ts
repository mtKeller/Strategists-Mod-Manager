import { ActionController$ } from '../../model/ActionController';
import { Store, select } from '@ngrx/store';
import { interval, Observable } from 'rxjs';
const { ipcRenderer } = window.require('electron');

import * as MainSelectors from './Main.selectors';
import { RemapDirectory } from './Main.tree';

export function InitializeDirectoryWatchers(store: Store<any>, mhwDir: string) {
    const WatcherController$: Observable<any> = ActionController$(
        store,
        MainSelectors.selectWatchingMhwDirectory,
        (obs) => {
            const RemapDirectoryTree = RemapDirectory(store, mhwDir);

            let watchingMhwDir;
            store.pipe(
                select(MainSelectors.selectWatchingMhwDirectory)
            ).subscribe(val => watchingMhwDir = val);

            ipcRenderer.send('INIT_DIR_WATCH', mhwDir);
            ipcRenderer.on('DIR_CHANGED', (err, args) => {
                // console.log('PING');
                if (args === 'nativePC' && watchingMhwDir) {
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
                } else if (args === 'modFolder' && watchingMhwDir) {
                    obs.next(RemapDirectoryTree);
                }
            });
        }
    );
    return WatcherController$.subscribe(val => {
        console.log(val);
        store.dispatch(val.success());
    });
}
