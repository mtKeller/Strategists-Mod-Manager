import { InitializeModManagerState, Mod } from './ModManager.state';
import * as ModManagerActions from './ModManager.actions';
import {Action} from '@ngrx/store';

export function ModManagerReducer(state = InitializeModManagerState(), action: Action) {
    switch (action.type) {
        case ModManagerActions.VERIFY_MODS: {
            const zipMods = state.modFolderMap.filter((path) => {
                // console.log(path);
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
        case ModManagerActions.BEGIN_MOD_PROCESSING : {
            console.log('BEGIN MOD PROCESSING', action.tree.payload);
            const newProcessingQue = [];
            let target;
            for (let i = 1; i < state.processingQue.length; i++) {
                if (action.tree.payload.modArchiveName !== state.processingQue[i].modArchiveName) {
                    newProcessingQue.push(state.processingQue[i]);
                } else {
                    target = state.processingQue[i];
                }
            }
            return {
                ...state,
                modProcessing: true,
                processingQue: newProcessingQue,
                processingTarget: target
            };
        }
        case ModManagerActions.UPDATE_PROCESSING_PROGRESS : {
            return {
                ...state
            };
        }
        case ModManagerActions.MOD_PROCESSED : {
            // const newProcessingQue = [];
            // for (let i = 0; i < state.processingQue.length; i++) {
            //     if(state.processingQue[i].archi)
            //     newProcessingQue.push(state.processingQue[i]);
            // }
            return {
                ...state,
                modProcessing: false
            };
        }
        case ModManagerActions.ADD_MOD_TO_PROCESSING_QUE : {
            const newProcessingQue = [];
            if (state.processingQue.length === 0) {
                return {
                    ...state,
                    processingQue: [action]
                };
            } else {
                for (let i = 0;  i < state.processingQue.length; i++) {
                    if (state.processingQue[i].payload !== action.payload) {
                        newProcessingQue.push(action);
                    }
                }
                return {
                    ...state,
                    processingQue: newProcessingQue
                };
            }
        }
        case ModManagerActions.ADD_MOD_TO_MOD_LIST : {
            let MOD;
            if (action.payload) {
                MOD = action.payload;
            } else {
                MOD = action.tree.payload;
            }
            let modExists = false;
            for (let i = 0; i < state.modList.length; i++) {
                if (MOD.modTitle === state.modList[i].name) {
                    let modPathExists;
                    for (let j = 0; j < state.modList[i].archivePaths.length; j++) {
                        if (state.modList[i].archiveNames[j] === MOD.modArchiveName) {
                            modPathExists = true;
                            break;
                        }
                    }
                    if (!modPathExists) {
                        const archiveNames = state.modList[i].archiveNames;
                        archiveNames.push(MOD.modArchiveName);

                        const archivePaths = state.modList[i].archivePaths;
                        archivePaths.push(MOD.modArchivePath);

                        const archiveMaps = state.modList[i].archiveMaps;
                        archiveMaps.push(MOD.modMap);

                        const enabled = state.modList[i].enabled;
                        enabled.push(false);

                        const mutatedMOD = {
                            name: state.modList[i].name,
                            authorLink: state.modList[i].authorLink,
                            authorName: state.modList[i].authorName,
                            url: state.modList[i].url,
                            publishDate: state.modList[i].publishDate,
                            updateDate: state.modList[i].updateDate,
                            archiveNames: archiveNames,
                            archivePaths: archivePaths,
                            archiveMaps: archiveMaps,
                            pictures: state.modList[i].pictures,
                            thumbs: state.modList[i].thumbs,
                            enabled: enabled,
                        };
                        const newModList = [];
                        for (let j = 0; j < state.modList.length; j++) {
                            if (mutatedMOD.name === state.modList[j].name) {
                                newModList.push(mutatedMOD);
                            } else {
                                newModList.push(state.modList[j]);
                            }
                        }
                        return {
                            ...state,
                            modList : newModList
                        };
                    }
                    modExists = true;
                    break;
                }
            }
            if (!modExists) {
                const mutatedMOD: Mod = {
                    name: MOD.modTitle,
                    authorLink: MOD.authorLink,
                    authorName: MOD.authorName,
                    url: MOD.modUrl,
                    publishDate: MOD.modPublishDate,
                    updateDate: MOD.modUpdateDate,
                    archiveNames: [ MOD.modArchiveName ],
                    archivePaths: [ MOD.modArchivePath ],
                    archiveMaps: [ MOD.modMap ],
                    pictures: MOD.modPictures,
                    thumbs: MOD.modThumbs,
                    enabled: [ false ],
                };
                const modList = state.modList;
                modList.push(mutatedMOD);
                return {
                    ...state,
                    modList: modList
                };
            }
            return {
                ...state
            };
        }
        case ModManagerActions.ADD_MOD_DETAIL_FROM_DOWNLOAD : {
            const modDetail = action.payload[1];
            modDetail['modArchiveName'] = action.payload[0];
            console.log('CHECK', modDetail.modArchiveName, modDetail, action);
            const modPictures = [];
            for (let i = 0; i < modDetail.modThumbs.length; i++) {
                modPictures.push(modDetail.modThumbs[i].replace('/thumbnails/', '/'));
            }
            modDetail['modPictures'] = modPictures;
            // console.log('MOD DETAIL', modDetail);
            let newState = {
                ...state
            };
            if (state.downloadedModDetail.length < 1) {
                newState = {
                    ...state,
                    downloadedModDetail: [
                        modDetail
                    ]
                };
            } else {
                let exists = false;
                for (let i = 0; i < state.downloadedModDetail.length; i++) {
                    if (modDetail.modArchiveName === state.downloadedModDetail[i].modArchiveName) {
                        exists = true;
                    }
                }
                if (!exists) {
                    const newEntry = state.downloadedModDetail;
                    newEntry.push(modDetail);
                    newState = {
                        ...state,
                        downloadedModDetail: newEntry
                    };
                }
            }
            return newState;
        }
        case ModManagerActions.REMOVE_MOD_DETAIL : {
            const newDownloadedModDetail = [];
            // console.log('REMOVE_MOD_DETAIL', action.payload);
            for (let i = 0; i < state.downloadedModDetail.length; i++) {
                if (action.payload !== state.downloadedModDetail[i].modArchiveName) {
                    newDownloadedModDetail.push(state.downloadedModDetail[i].modArchiveName);
                }
            }
            return {
                ...state,
                downloadedModDetail: newDownloadedModDetail
            };
        }
        case ModManagerActions.INSERT_TO_FRONT_OF_LOAD_ORDER : {
            console.log(action.tree.payload);
            if (action.tree.payload[0] !== undefined || action.tree.payload[1] !== undefined) {
                let modExists = false;
                for (let i = 0; i < state.loadOrder.length; i++) {
                    if (action.tree.payload[0] === state.loadOrder[i][0] && action.tree.payload[1] === state.loadOrder[i][1]) {
                        modExists = true;
                    }
                }
                if (!modExists) {
                    const newLoadOrder = [action.tree.payload];
                    for (let i = 0; i < state.loadOrder.length; i++) {
                        newLoadOrder.push(state.loadOrder[i]);
                    }
                    return {
                        ...state,
                        loadOrder: newLoadOrder
                    };
                }
            }
            return {
                ...state,
            };
        }
        case ModManagerActions.SHIFT_UP_MOD_OF_LOAD_ORDER : {
            const newLoadOrder = state.loadOrder;
            let indexOfTarget: number;
            for (let i = 0; i < newLoadOrder.length; i++) {
                if (action.payload[0] === state.loadOrder[i][0] && action.payload[1] === state.loadOrder[i][1]) {
                    indexOfTarget = i;
                    break;
                }
            }
            let tempHolder: number;
            if (indexOfTarget - 1 !== -1) {
                tempHolder = newLoadOrder[indexOfTarget];
                newLoadOrder[indexOfTarget] = newLoadOrder[indexOfTarget - 1];
                newLoadOrder[indexOfTarget - 1] = tempHolder;
            }
            return {
                ...state,
                loadOrder: newLoadOrder
            };
        }
        case ModManagerActions.SHIFT_DOWN_MOD_OF_LOAD_ORDER : {
            const newLoadOrder = state.loadOrder;
            let indexOfTarget: number;
            for (let i = 0; i < newLoadOrder.length; i++) {
                if (action.payload[0] === state.loadOrder[i][0] && action.payload[1] === state.loadOrder[i][1]) {
                    indexOfTarget = i;
                    break;
                }
            }
            let tempHolder: number;
            if (indexOfTarget + 1 < newLoadOrder.length) {
                tempHolder = newLoadOrder[indexOfTarget];
                newLoadOrder[indexOfTarget] = newLoadOrder[indexOfTarget + 1];
                newLoadOrder[indexOfTarget + 1] = tempHolder;
            }
            return {
                ...state,
                loadOrder: newLoadOrder
            };
        }
        case ModManagerActions.REMOVE_MOD_FROM_LOAD_ORDER : {
            const newLoadOrder = [];
            for (let i = 0; i < state.loadOrder[i].length; i++) {
                if (action.payload[0] !== state.loadOrder[i][0] && action.payload[1] !== state.loadOrder[i][1]) {
                    newLoadOrder.push(state.loadOrder[i]);
                    break;
                }
            }
            return {
                ...state,
                loadOrder: newLoadOrder
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
                ownedPathDict: action.tree.payload.ModManagerState.ownedPathDict,
                loadOrder: action.tree.payload.ModManagerState.loadOrder
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
}
