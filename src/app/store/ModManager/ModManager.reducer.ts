import { InitializeModManagerState } from './ModManager.state';
import * as ModManagerActions from './ModManager.action';
import {Action} from '@ngrx/store';

export function ModManagerReducer(state = InitializeModManagerState(), action: Action) {
    switch (action.type) {
        case ModManagerActions.VERIFY_MODS: {
            const zipMods = state.modFolderMap.filter((path) => {
                console.log(path);
                if (path.indexOf('.zip') > -1) {
                    return true;
                }
            });
            console.log('CHECK FILTERED LIST', zipMods);
            let needsProcessing;
            if (state.modList.length === 0) {
                needsProcessing = zipMods;
            }
            return {
                ...state,
                loading: true,
                needsProcessing: needsProcessing
            };
        }
        case ModManagerActions.ADD_MOD_FROM_PROCESSING : {
            const MOD = action.payload;
            const newProcessingList = [];
            for (let i = 0; i < state.needsProcessing.length; i++) {
                if (state.needsProcessing[i].indexOf(MOD.name) === -1) {
                    newProcessingList.push(state.needsProcessing[i]);
                }
            }
            return {
                ...state,
                modList: state.modList.push(MOD),
                needsProcessing: newProcessingList
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
        case ModManagerActions.SET_STATE: {
            return {
                ...state,
                modList: action.tree.payload.ModManagerState.modList,
                nativePcMap: action.tree.payload.ModManagerState.nativePcMap,
                modFolderMap: action.tree.payload.ModManagerState.modFolderMap,
                ownedPathDict: action.tree.payload.ModManagerState.ownedPathDict
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
}
