import { InitializeModManagerState, Mod } from './ModManager.state';
import * as ModManagerActions from './ModManager.actions';
import {Action} from '@ngrx/store';

function bubbleSortByLoadOrderPos(arr) {
    console.log('bubble', arr);
    let sorted = false;
    while (!sorted) {
        sorted = true;
        arr.forEach(function (element, index, array) {
            if (index < array.length - 1) {
                if (element.loadOrderPos > array[index + 1].loadOrderPos) {
                    array[index] = array[index + 1];
                    array[index + 1] = element;
                    sorted = false;
                }
            }
        });
    }
    return arr;
}

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
            let name;
            if (action.hasOwnProperty('payload')) { // Preprocessed
                name = action.payload;
            } else {
                name = action.tree.payload.modArchiveName; // Raw
            }
            for (let i = 1; i < state.processingQue.length; i++) {
                if (state.processingQue[i].name === name) {
                    target = state.processingQue[i];
                } else {
                    newProcessingQue.push(state.processingQue[i]);
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
            let name;
            const newProcessingQue = [];
            if (action.tree.payload.hasOwnProperty('mod')) {
                name = action.tree.payload.mod.modArchiveNames[action.tree.payload.modIndex];
                for (let i = 0;  i < state.processingQue.length; i++) {
                    // const archiveName = action.payload.
                    if (state.processingQue[i].name === name) {
                        newProcessingQue.push({
                            name : name,
                            action: action,
                            progress: action.payload.progress
                        });
                    } else {
                        newProcessingQue.push(state.processingQue[i]);
                    }
                }
            } else {
                name = action.tree.payload.modArchiveName; // Raw
                for (let i = 0;  i < state.processingQue.length; i++) {
                    // const archiveName = action.payload.
                    if (state.processingQue[i].name === name) {
                        newProcessingQue.push({
                            name: name,
                            action : action,
                            progress: action.payload
                        });
                    } else {
                        newProcessingQue.push(state.processingQue[i]);
                    }
                }
            }
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
                modProcessing: false,
                target: null
            };
        }
        case ModManagerActions.ADD_MOD_TO_PROCESSING_QUE : {
            const newProcessingQue = [];
            let name;
            if (action.hasOwnProperty('payload')) { // Raw
                name = action.payload;
            } else {
                name = action.tree.payload.archiveName; // Pre
            }
            if (state.processingQue.length === 0) {
                return {
                    ...state,
                    processingQue: [{
                        name: name,
                        action: action,
                        progress: 0
                    }]
                };
            } else {
                for (let i = 0;  i < state.processingQue.length; i++) {
                    // const archiveName = action.payload.
                    if (state.processingQue[i].name !== name) {
                        newProcessingQue.push({
                            name: name,
                            action: action,
                            progress: 0
                        });
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
            // console.log(action.tree.payload);
            if (action.payload[0] !== undefined || action.payload[1] !== undefined) {
                let modExists = false;
                for (let i = 0; i < state.loadOrder.length; i++) {
                    if (action.payload[0] === state.loadOrder[i][0] && action.payload[1] === state.loadOrder[i][1]) {
                        modExists = true;
                    }
                }
                if (!modExists) {
                    const newLoadOrder = [action.payload];
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
        case ModManagerActions.FILTER_MOD_MAP : {
            const mod: Mod = action.tree.payload.mod;
            const modIndexes = action.tree.payload.modIndexes;
            const newArchivePaths = mod.archiveMaps[modIndexes[1]].filter(path => {
                return (path.indexOf('.') > - 1);
            });
            console.log(newArchivePaths);
            action.tree.payload = {
                ...action.tree.payload,
                modPaths: newArchivePaths
            };
            return {
                ...state
            };
        }
        case ModManagerActions.VERIFY_AGAINST_OWNERSHIP_DICT : {
            const newOwnershipDict = {
                ...state.ownedPathDict
            };
            const installArr = [];
            const removeArr = [];
            const paths = action.tree.payload.modPaths;
            const pathKeys = Object.keys(newOwnershipDict);
            for (let i = 0; i < pathKeys.length; i++) {
                const targetPathDef = newOwnershipDict[pathKeys[i]];
                for (let j = 0; j < targetPathDef.length; j++) {
                    for (let k = 0; k < state.loadOrder.length; k++) {
                        if (targetPathDef[j].modIndexes[0] === state.loadOrder[k][0] &&
                            targetPathDef[j].modIndexes[1] === state.loadOrder[k][1] &&
                            targetPathDef[j].loadOrderPos !== k) {
                            newOwnershipDict[pathKeys[i]][j].loadOrderPos = k;
                        }
                        // console.log(targetPathDef);
                        if (state.loadOrder[k][0] === action.tree.payload.modIndexes[0] &&
                            state.loadOrder[k][1] === action.tree.payload.modIndexes[1] &&
                        k !== action.tree.payload.loadOrderPos) {
                            action.tree.payload.loadOrderPos = k;
                        }
                    }
                }
            }
            for (let i = 0; i < paths.length; i++) {
                if (newOwnershipDict.hasOwnProperty(paths[i])) {
                    // IF PAYLOAD IS NEW OWNER
                    // if (newOwnershipDict[paths[i]][0].owner !== action.tree.payload.archiveName &&
                    //     newOwnershipDict[paths[i]][0].loadOrderPos > action.tree.payload.loadOrderPos) {
                    //     console.log('ENTRY');
                    //     const newOwnership = [{
                    //         owner: action.tree.payload.archiveName,
                    //         loadOrderPos: action.tree.payload.loadOrderPos,
                    //         modIndexes: action.tree.payload.modIndexes
                    //     }];
                    //     for (let j = 0; j < newOwnershipDict[paths[i]]; j++) {
                    //         if (newOwnershipDict[paths[i]][j].owner !== newOwnership[0].owner) {
                    //             newOwnership.push(newOwnershipDict[paths[i]][j]);
                    //         }
                    //     }
                    //     newOwnershipDict[paths[i]] = newOwnership;
                    // } else if (newOwnershipDict[paths[i]][0].owner === action.tree.payload.archiveName && // IF SAME OWNER AND POS
                    //     newOwnershipDict[paths[i]][0].loadOrderPos === action.tree.payload.loadOrderPos) { // DO JACK SHIT
                    //         console.log('JACK SHIT');
                    // } else { // IF PAYLOAD OWNS PATH BUT IS NOT CURRENT OWNER
                        for (let j = 0; j < newOwnershipDict[paths[i]].length; j++) { // AND IF CHANGE IN LOAD ORDER POS
                            const currentOwnershipEntry = newOwnershipDict[paths[i]];
                            let newOwnershipDictEntry = [];
                            for (let k = 0; k < currentOwnershipEntry.length; k++) {
                                if (currentOwnershipEntry[k].owner !== action.tree.payload.archiveName) {
                                    newOwnershipDictEntry.push(currentOwnershipEntry[k]);
                                }
                            }
                            newOwnershipDictEntry.push({
                                owner: action.tree.payload.archiveName,
                                loadOrderPos: action.tree.payload.loadOrderPos,
                                modIndexes: action.tree.payload.modIndexes
                            });
                            console.log('DICT', newOwnershipDict);
                            newOwnershipDictEntry = bubbleSortByLoadOrderPos(newOwnershipDictEntry);
                            newOwnershipDict[paths[i]] = newOwnershipDictEntry;
                        }
                    // }
                } else { // IF OWNERSHIP DICT DOES NOT HAVE PATH
                    console.log('NO PATH');
                    newOwnershipDict[paths[i]] = [{
                        owner: action.tree.payload.archiveName,
                        loadOrderPos: action.tree.payload.loadOrderPos,
                        modIndexes: action.tree.payload.modIndexes
                    }];
                    installArr.push({
                        path: paths[i],
                        owner: action.tree.payload.modIndex,
                        modIndexes: action.tree.payload.modIndexes
                    });
                }
            }
            const previousKeys = Object.keys(state.ownedPathDict);
            for (let j = 0; j < previousKeys.length; j++) {
                if (newOwnershipDict[previousKeys[j]][0].owner !== state.ownedPathDict[previousKeys[j]][0].owner) {
                    removeArr.push({
                        path : previousKeys[j],
                        owner : state.ownedPathDict[previousKeys[j]][0].owner,
                        modIndexes : state.ownedPathDict[previousKeys[j]][0].modIndexes,
                    });
                    installArr.push({
                        path : previousKeys[j],
                        owner : newOwnershipDict[previousKeys[j]][0].owner,
                        modIndexes: newOwnershipDict[previousKeys[j]][0].modIndexes
                    });
                }
            }
            action.tree.payload = {
                ...action.tree.payload,
                install: installArr,
                remove: removeArr
            };
            return {
                ...state,
                ownedPathDict: {...newOwnershipDict}
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
