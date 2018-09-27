import { InitializeModManagerState } from './ModManager.state';
import * as ModManagerActions from './ModManager.action';
import {Action} from '@ngrx/store';

export function ModManagerReducer(state = InitializeModManagerState(), action: Action) {
    switch (action.type) {
        case ModManagerActions.VERIFY_MODS: {
            const zipMods = state.modFolderMap.filter((path) => {
                console.log(path);
                if (path.indexOf('.zip') <= -1) {
                    return false;
                }
            });
            console.log('CHECK FILTERED LIST', zipMods);
            // for (let i = 0; i < state.modList.length; i++) {
            //     state.modList[i]
            // }
            return {
                ...state,
                loading: true
            };
        }
        case ModManagerActions.SET_MOD_FOLDER_MAP: {
            return {
                ...state,
                modFolderMap: action.tree.payload
            };
        }
        case ModManagerActions.SET_NATIVE_PC_MAP: {
            return {
                ...state,
                nativePcMap: action.tree.payload
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
}
