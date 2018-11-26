import { InitializeModManagerState, Mod } from './ModManager.state';
import * as ModManagerActions from './ModManager.actions';
import {Action} from '@ngrx/store';
import { DynamicEntity } from '../../model/DynamicEntity.class';

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

function replaceAll(str , search, replacement) {
    const target = str;
    return target.split(search).join(replacement);
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
            if (state.modList.keys().length === 0) {
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
        case ModManagerActions.ADD_TO_INSTALL_QUE : {
            const newInstallationQue = [];
            state.installationQue.map(item => newInstallationQue.push(item));
            newInstallationQue.push(action);
            return {
                ...state,
                installationQue: newInstallationQue,
            };
        }
        case ModManagerActions.BEGIN_INSTALLATION : {
            return {
                ...state,
                modProcessing: false,
            };
        }
        case ModManagerActions.END_INSTALLATION : {
            let newInstallationQue = [];
            if (state.installationQue.length === 1) {
                newInstallationQue = [];
            } else {
                for (let i = 1; i < state.installationQue.length; i++) {
                    newInstallationQue.push(state.installationQue[i]);
                }
            }
            return {
                ...state,
                modProcessing: false,
                installationQue: newInstallationQue
            };
        }
        case ModManagerActions.ADD_MOD_TO_MOD_LIST : {
            let MOD;
            if (action.payload) {
                MOD = action.payload;
            } else {
                MOD = action.tree.payload;
            }
            let modExists = false;
            const modKeys = state.modList.keys();
            for (let li = 0; li < modKeys.length; li++) {
                const i = modKeys[li];
                if (MOD.modTitle === state.modList.entity[i].name) {
                    let modPathExists;
                    for (let j = 0; j < state.modList.entity[i].archivePaths.length; j++) {
                        if (state.modList.entity[i].archiveNames[j] === MOD.modArchiveName) {
                            modPathExists = true;
                            break;
                        }
                    }
                    if (!modPathExists) {
                        const archiveNames = state.modList.entity[i].archiveNames.map(item => item);
                        archiveNames.push(MOD.modArchiveName);
                        if (MOD.modArchiveName.indexOf('.rar') > -1) {
                            MOD.modMap = MOD.modMap.map(path => {
                                return path
                                    .split(`D:\\SteamLibrary\\SteamApps\\common\\Monster Hunter World\\modFolder\\temp\\${MOD.name}\\`)[1];
                            });
                        }
                        const archivePaths = state.modList.entity[i].archivePaths.map(item => item);
                        archivePaths.push(MOD.modArchivePath);

                        const archiveMaps = state.modList.entity[i].archiveMaps.map(item => item);
                        archiveMaps.push(MOD.modMap);

                        const enabled = state.modList.entity[i].enabled.map(item => item);
                        enabled.push(false);

                        const mutatedMOD: Mod = {
                            name: state.modList.entity[i].name,
                            authorLink: state.modList.entity[i].authorLink,
                            authorName: state.modList.entity[i].authorName,
                            url: state.modList.entity[i].url,
                            publishDate: state.modList.entity[i].publishDate,
                            updateDate: state.modList.entity[i].updateDate,
                            description: state.modList.entity[i].description,
                            archiveNames: archiveNames,
                            archivePaths: archivePaths,
                            archiveMaps: archiveMaps,
                            pictures: state.modList.entity[i].pictures,
                            thumbs: state.modList.entity[i].thumbs,
                            enabled: enabled,
                        };
                        for (let j = 0; j < modKeys.length; j++) {
                            if (mutatedMOD.name === state.modList.entity[modKeys[j]].name) {
                                state.modList.swapIndexed(modKeys[j], mutatedMOD);
                            }
                        }
                        return {
                            ...state,
                            modList : state.modList
                        };
                    }
                    modExists = true;
                    break;
                }
            }
            if (!modExists) {
                console.log('SEE RAR', MOD.modArchiveName);
                if (MOD.modArchiveName.indexOf('.rar') > -1) {
                    console.log('SEE RAR', MOD.modMap);
                    MOD.modMap = MOD.modMap.map(path => {
                        return path.split(`${MOD.modArchiveName.split('.')[0]}/`)[1];
        // .split(`D:\\SteamLibrary\\SteamApps\\common\\Monster Hunter World\\modFolder\\temp\\${MOD.modArchiveName.split('.')[0]}\\`)[1];
                    });
                }
                console.log('SEE RAR', MOD.modMap);
                const mutatedMOD: Mod = {
                    name: MOD.modTitle,
                    authorLink: MOD.authorLink,
                    authorName: MOD.authorName,
                    url: MOD.modUrl,
                    publishDate: MOD.modPublishDate,
                    updateDate: MOD.modUpdateDate,
                    description: MOD.modDescription,
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
        case ModManagerActions.REMOVE_MOD_FROM_MOD_LIST : {
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
                const newEntry = state.downloadedModDetail;
                for (let i = 0; i < state.downloadedModDetail.length; i++) {
                    if (modDetail.modArchiveName !== state.downloadedModDetail[i].modArchiveName) {
                        newEntry.push(state.downloadedModDetail[i]);
                    } else {
                        exists = true;
                    }
                }
                if (!exists) {
                    newEntry.push(modDetail);
                }
                newState = {
                    ...state,
                    downloadedModDetail: newEntry
                };
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
                    const newModList = state.modList;
                    newModList.entity[action.payload[0]].enabled[action.payload[1]] = true;
                    return {
                        ...state,
                        loadOrder: newLoadOrder,
                        modList: newModList
                    };
                } else {
                    const newLoadOrder = [action.payload];
                    for (let i = 0; i < state.loadOrder.length; i++) {
                        if (action.payload[0] !== state.loadOrder[i][0] && action.payload[1] !== state.loadOrder[i][1]) {
                            newLoadOrder.push(state.loadOrder[i]);
                        }
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
        case ModManagerActions.UPDATE_LOAD_ORDER_AND_APPEND_NEW_MOD_INDEXES : {
            const oldLoadOrder = state.loadOrder;
            break;
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
            for (let i = 0; i < state.loadOrder.length; i++) {
                if (action.payload[0] !== state.loadOrder[i][0] && action.payload[1] !== state.loadOrder[i][1]) {
                    newLoadOrder.push(state.loadOrder[i]);
                    break;
                }
            }
            const newModList = state.modList;
            newModList.entity[action.payload[0]].enabled[action.payload[1]] = false;
            return {
                ...state,
                loadOrder: newLoadOrder,
                modList: newModList
            };
        }

        case ModManagerActions.FILTER_MOD_MAP : {
            const mod: Mod = action.tree.payload.mod;
            const modIndexes = action.tree.payload.modIndexes;
            let newArchivePaths = mod.archiveMaps[modIndexes[1]].filter(path => {
                return (path.indexOf('.') > - 1);
            });
            newArchivePaths = newArchivePaths.map(path => replaceAll(path, '/', '\\'));
            console.log(newArchivePaths);
            action.tree.payload = {
                ...action.tree.payload,
                modPaths: newArchivePaths
            };
            return {
                ...state
            };
        }
        case ModManagerActions.REMOVE_MOD_FROM_OWNERSHIP_DICT : {
            const payload = action.tree.payload.modIndexes;
            const OwnershipPaths = Object.keys(state.ownedPathDict);
            let newOwnedPathDict = {};
            const installArr = [];
            const removeArr = [];
            for (let i = 0; i < OwnershipPaths.length; i++) {
                const filteredOwners = state.ownedPathDict[OwnershipPaths[i]]
                    .filter(path => {
                    if (path.modIndexes[0] !== payload[0] && path.modIndexes[1] !== payload[1]) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (filteredOwners.length !== 0) {
                    const newEntry = {};
                    newEntry[OwnershipPaths[i]] = filteredOwners;
                    newOwnedPathDict = {
                        ...newOwnedPathDict,
                        ...newEntry
                    };
                }
            }
            for (let i = 0; i < OwnershipPaths.length; i++) {
                if (newOwnedPathDict.hasOwnProperty(OwnershipPaths[i])) {
                    if (newOwnedPathDict[OwnershipPaths[i]][0].owner !== state.ownedPathDict[OwnershipPaths[i]][0].owner) {
                        removeArr.push({
                            path : OwnershipPaths[i],
                            owner : state.ownedPathDict[OwnershipPaths[i]][0].owner,
                            modIndexes : state.ownedPathDict[OwnershipPaths[i]][0].modIndexes,
                        });
                        installArr.push({
                            path : OwnershipPaths[i],
                            owner : newOwnedPathDict[OwnershipPaths[i]][0].owner,
                            modIndexes: newOwnedPathDict[OwnershipPaths[i]][0].modIndexes
                        });
                    }
                } else {
                    removeArr.push({
                        path : OwnershipPaths[i],
                        owner : state.ownedPathDict[OwnershipPaths[i]][0].owner,
                        modIndexes : state.ownedPathDict[OwnershipPaths[i]][0].modIndexes,
                    });
                }
            }
            action.tree.payload = {
                ...action.tree.payload,
                installPaths: installArr,
                removePaths: removeArr
            };
            return {
                ...state,
                ownedPathDict: newOwnedPathDict
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
                    console.log('NO PATH', action.tree.payload.archiveName);
                    newOwnershipDict[paths[i]] = [{
                        owner: action.tree.payload.archiveName,
                        loadOrderPos: action.tree.payload.loadOrderPos,
                        modIndexes: action.tree.payload.modIndexes
                    }];
                    installArr.push({
                        path: paths[i],
                        owner: action.tree.payload.archiveName,
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
                installPaths: installArr,
                removePaths: removeArr
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
            const newModList = new DynamicEntity();
            newModList.entity = action.tree.payload.ModManagerState.modList.entity;
            newModList.length = action.tree.payload.ModManagerState.modList.length;
            newModList.currentIndex = action.tree.payload.ModManagerState.modList.currentIndex;
            return {
                ...state,
                modList: newModList,
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
