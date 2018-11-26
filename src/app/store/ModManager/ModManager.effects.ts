import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ActionTree,
    ActionNode,
    ActionTreeParams
} from '../../model/ActionTree.class';
import * as MainSelectors from '../Main/Main.selectors';
import * as ModManagerActions from './ModManager.actions';
import * as ModManagerSelectors from './ModManager.selectors';
import * as ModManagerControllers from './ModManager.controllers';
import * as FileSystemActions from '../FileSystem/FileSystem.actions';
import * as DownloadManagerSelectors from '../DownloadManager/DownloadManager.selectors';
import { SaveStateTree } from '../Main/Main.tree';
import { ProcessRarMod, ProcessZipMod, PrepInstallation, PrepDependencies, PrepRemoval, Process7ZipMod } from './ModManager.tree';
import { DynamicEntity } from '../../model/DynamicEntity.class';

@Injectable()
  export class ModManagerEffects {
    modFolderMap: Array<string>;
    modList: DynamicEntity;
    downloadManagerCurrentFiles: Array<any>;
    downloadedModDetail: Array<any>;
    mhwDIR: string;
    processingQue: Array<any>;
    installationQue: Array<any>;
    modProcessing: boolean;
    constructor(private actions$: Actions, private store: Store<any> ) {
        this.store.pipe(
            select(ModManagerSelectors.selectModFolderMap)
        ).subscribe(val => {
            if (val) {
                this.modFolderMap = val;
            }
        });
        this.store.pipe(
            select(DownloadManagerSelectors.selectCurrentFiles)
        ).subscribe(val => {
            if (val) {
                this.downloadManagerCurrentFiles = val;
            }
        });
        this.store.pipe(
            select(ModManagerSelectors.selectDownloadedModDetail)
        ).subscribe(val => {
            if (val) {
                this.downloadedModDetail = val;
            }
        });
        this.store.pipe(
            select(ModManagerSelectors.selectDownloadedModDetail)
        ).subscribe(val => {
            if (val) {
                this.downloadedModDetail = val;
            }
        });
        this.store.pipe(
            select(MainSelectors.selectMhwDirectoryPath)
        ).subscribe(val => {
            if (val) {
                this.mhwDIR = val;
            }
        });
        this.store.pipe(
            select(ModManagerSelectors.selectModList)
        ).subscribe(val => {
            if (val) {
                this.modList = val;
            }
        });
        this.store.pipe(
            select(ModManagerSelectors.selectModProcessing)
        ).subscribe(val => {
            if (val) {
                this.modProcessing = val;
            }
        });
        this.store.pipe(
            select(ModManagerSelectors.selectProcessingQue)
        ).subscribe(val => {
            if (val) {
                this.processingQue = val;
            }
        });
        this.store.pipe(
            select(ModManagerSelectors.selectInstallationQue)
        ).subscribe(val => {
            if (val) {
                this.installationQue = val;
            }
        });
        ModManagerControllers.InitializeModQueController(this.store).subscribe(val => {
            console.log('testing', val);
            store.dispatch(val.action.tree.success());
        });
    }
    @Effect()
        ModManagerBeginProcessingMod$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.BEGIN_MOD_PROCESSING),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerProcessMod$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.PROCESS_MOD),
                map(action => {
                    const payload = action.payload;
                    if (payload.modArchiveName.indexOf('.rar') > -1) {
                        return new ModManagerActions.ProcessRarMod(payload);
                    } else if (payload.modArchiveName.indexOf('.zip') > -1) {
                        return new ModManagerActions.ProcessZipMod(payload);
                    } else if (payload.modArchiveName.indexOf('.7z') > -1) { // TODO WILL NOT WORK AT THE MOMENT
                        return new ModManagerActions.Process7ZipMod(payload);
                    } else {
                        return new ModManagerActions.ModManagerSuccess();
                    }
                })
            );
    @Effect()
        ModManagerUpdateProcessingProgress$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.UPDATE_PROCESSING_PROGRESS),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerProcessModByName$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.PROCESS_MOD_BY_NAME),
                map(action => {
                    let payload = null;
                    for (let i = 0; i < this.downloadedModDetail.length; i++) {
                        if (action.payload === this.downloadedModDetail[i].modArchiveName) {
                            payload = this.downloadedModDetail[i];
                            payload.modArchivePath = `${this.mhwDIR}\\modFolder\\${action.payload}`;
                            if (action.payload.indexOf('.rar') > -1) {
                                return new ModManagerActions.ProcessRarMod(payload);
                            } else if (action.payload.indexOf('.zip') > -1) {
                                return new ModManagerActions.ProcessZipMod(payload);
                            } else if (action.payload.indexOf('.7z') > -1) { // TODO WILL NOT WORK AT THE MOMENT
                                return new ModManagerActions.Process7ZipMod(payload);
                            } else {
                                return new ModManagerActions.ModManagerSuccess();
                            }
                        }
                    }
                    return new ModManagerActions.ModManagerSuccess();
                })
            );
    @Effect()
        ModManagerProcessRarMod$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.PROCESS_RAR_MOD),
                map(action => {
                    const ActionTreeProcessRarMod = ProcessRarMod(this.store, action, this.mhwDIR);
                    return ActionTreeProcessRarMod.begin();
                })
            );
    @Effect()
        ModMangerAddModToModList$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.ADD_MOD_TO_MOD_LIST),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerRemoveModDetail$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.REMOVE_MOD_DETAIL),
                map(action => {
                    this.store.dispatch(SaveStateTree(this.store).begin());
                    if (action.tree) {
                        return action.tree.success();
                    } else {
                        return new ModManagerActions.ModManagerSuccess();
                    }
                })
            );
    @Effect()
        ModManagerProcessZipMod$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.PROCESS_ZIP_MOD),
                map(action => {
                    const ActionTreeProcessZipMod = ProcessZipMod(this.store, action);
                    return ActionTreeProcessZipMod.begin();
                })
            );
    @Effect()
        ModManagerProcess7ZipMod$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.PROCESS_7_ZIP_MOD),
                map(action => {
                    const ActionTreeProcess7ZipMod = Process7ZipMod(this.store, action);
                    return ActionTreeProcess7ZipMod;
                })
            );
    @Effect()
        ModManagerSetNativePcMap$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.SET_NATIVE_PC_MAP),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerSetModFolderMap$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.SET_MOD_FOLDER_MAP),
                map(action => {
                    if (!this.modProcessing) {
                        let payload;
                        if (action.payload) {
                            payload = action.payload.filter(path => path.indexOf('/temp/') === -1 && path.indexOf('/modFolder/') > -1);
                        } else {
                            payload = action.tree.payload.filter(path => path.indexOf('/temp/') === -1 && path.indexOf('/modFolder/') > -1);
                        }
                        // console.log('CHECK PAYLOAD', payload);
                        let modExists = false;
                        for (let i = 0; i < payload.length; i++) {
                            modExists = false;
                            for (let j = 0; j < this.downloadManagerCurrentFiles.length; j++) {
                                if (payload[i].indexOf(this.downloadManagerCurrentFiles[j].fileName) > -1) {
                                    // console.log('BROKE INSIDE ARCHIVE NAMES AT MOD DOWNLOAD');
                                    modExists = true;
                                    break;
                                }
                            }
                            for (let j = 0; j < this.modList.keys().length; j++) {
                                for (let k = 0; k < this.modList.entity[j].archiveNames.length; k++) {
                                    if (payload[i].indexOf(this.modList.entity[j].archiveNames[k]) > -1) {
                                        // console.log('BROKE INSIDE ARCHIVE NAMES AT MOD LIST');
                                        modExists = true;
                                        break;
                                    }
                                }
                            }
                            if (!modExists) {
                                if (payload[i].split('/modFolder/')[1].length !== 0) {
                                    // console.log('CHECK PAYLOAD INDEX', payload[i]);
                                    const date = new Date();
                                    this.store.dispatch( new ModManagerActions.ProcessMod({
                                        authorLink: null,
                                        authorName: 'Anonymous',
                                        modArchiveName: payload[i].split('/modFolder/')[1],
                                        modArchivePath: payload[i],
                                        modPictures: [],
                                        modPublishDate: `${date.getUTCDay()} ${date.getUTCMonth()} ${date.getUTCFullYear()}`,
                                        modThumbs: [],
                                        modTitle: payload[i].split('/modFolder/')[1].split('.')[0],
                                        modUpdateDate: `${date.getUTCDay()} ${date.getUTCMonth()} ${date.getUTCFullYear()}`,
                                        modUrl: null
                                    }));
                                }
                            }
                        }
                        // console.log('HIT OUTSIDE LOOP');
                        // Insert Processing of dragged over MODS here
                        // Check against downloadedModDetail and Current MODS
                        // Generates Anon JSON
                        return action.tree.success();
                    }
                    // console.log('HIT OUTSIDE LOOP');
                    // Insert Processing of dragged over MODS here
                    // Check against downloadedModDetail and Current MODS
                    // Generates Anon JSON
                    return action.tree.failed();
                })
            );
    @Effect()
        ModManagerPrepDependencies$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.PREP_DEPENDENCIES),
                map(action => {
                    function onlyUnique(value, index, self) {
                        return self.indexOf(value) === index;
                    }
                    const dependencies = [];
                    const installPaths = action.tree.payload.installPaths;
                    const removePaths = action.tree.payload.removePaths;

                    installPaths.map(path => dependencies.push(path.owner));
                    removePaths.map(path => dependencies.push(path.owner));

                    const archiveNames = dependencies.filter(onlyUnique);
                    const ActionTreeInstall: ActionTree = PrepDependencies(
                        this.store,
                        archiveNames,
                        action.tree.payload.installPaths,
                        action.tree.payload.removePaths,
                        this.mhwDIR
                    );
                    ActionTreeInstall.init();
                    return action.tree.success();
                })
            );
    @Effect()
        ModManagerInsertToFrontOfLoadOrder$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.INSERT_TO_FRONT_OF_LOAD_ORDER),
                map(action => {
                    console.log('INSERT TO FRONT', action.payload, this.modList);
                    const preppedInstallationTree = PrepInstallation(
                        this.store,
                        this.modList[action.payload[0]],
                        action.payload,
                        0
                    );
                    console.log(preppedInstallationTree);
                    return preppedInstallationTree.begin();
                })
            );
    @Effect()
        ModManagerShiftUpLoadOrder$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.SHIFT_UP_MOD_OF_LOAD_ORDER),
                map(action => {
                    console.log('SHIFT UP', action.payload, this.modList);
                const preppedInstallationTree = PrepInstallation(
                        this.store,
                        this.modList[action.payload[0]],
                        action.payload,
                        0
                    );
                    console.log(preppedInstallationTree);
                    return preppedInstallationTree.begin();
                })
            );
    @Effect()
        ModManagerShiftDownLoadOrder$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.SHIFT_DOWN_MOD_OF_LOAD_ORDER),
                map(action => {
                    console.log('SHIFT DOWN', action.payload, this.modList);
                    const preppedInstallationTree = PrepInstallation(
                        this.store,
                        this.modList[action.payload[0]],
                        action.payload,
                        0
                    );
                    console.log(preppedInstallationTree);
                    return preppedInstallationTree.begin();
                })
            );
    @Effect()
        ModManagerRemoveModFromLoadOrder$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.REMOVE_MOD_FROM_LOAD_ORDER),
                map(action => {
                    console.log('REMOVE FROM LOAD ORDER', action.payload, this.modList);
                    const preppedRemovalTree = PrepRemoval(
                        this.store,
                        this.modList[action.payload[0]],
                        action.payload,
                    );
                    console.log(preppedRemovalTree);
                    return preppedRemovalTree.begin();
                })
            );
    @Effect()
        ModManagerFilterUnpackedDependencies$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.FILTER_UNPACKED_DEPENDENCIES),
                map(action => {
                    const archiveNames = action.tree.payload.archiveNames;
                    const modMap = action.tree.payload.modMap;
                    const filteredDependencies = [];
                    if (archiveNames.length !== 0) {
                        console.log('BEFORE', archiveNames[0].split('.')[0], modMap);
                        if (modMap.length === 0) {
                            for (let i = 0; i < archiveNames.length; i++) {
                                filteredDependencies.push(archiveNames[i]);
                            }
                        } else {
                            for (let i = 0; i < archiveNames.length; i++) {
                                let exists = false;
                                for (let j = 0; j < modMap.length; j++) {
                                    if (modMap[j].indexOf(archiveNames[i].split('.')[0]) > -1) {
                                        exists = true;
                                        break;
                                    }
                                }
                                if (!exists) {
                                    filteredDependencies.push(archiveNames[i]);
                                    exists = false;
                                }
                            }
                        }
                        console.log('after', filteredDependencies);
                        return action.tree.success({
                            ...action.tree.payload,
                            archiveNames: filteredDependencies
                        });
                    } else {
                        return action.tree.success();
                    }
                })
            );
    @Effect()
        ModManagerDeleteTemp = this.actions$
            .pipe(
                ofType(ModManagerActions.DELETE_TEMP),
                map(action => {
                    const ActionNodeCreateModdingDirectories: ActionNode = {
                        initAction: new FileSystemActions.CreateModdingDirectories(),
                        successNode: null
                    };
                    const ActionNodeDeleteTemp: ActionNode = {
                        initAction: new FileSystemActions.DeleteDirectory,
                        successNode: ActionNodeCreateModdingDirectories
                    };
                    const ActionTreeParam: ActionTreeParams = {
                        actionNode: ActionNodeDeleteTemp,
                        store: this.store,
                        payload: this.mhwDIR + '\\modFolder\\temp\\**\\*'
                    };
                    const ActionTreeRefreshTemp: ActionTree = new ActionTree(ActionTreeParam);
                    return ActionTreeRefreshTemp.begin();
                })
            );
    @Effect()
        ModManagerRemoveFromPathOwnershipDict$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.REMOVE_MOD_FROM_LOAD_ORDER),
                map(action => {
                    if (action.payload) {
                        return new ModManagerActions.ModManagerSuccess();
                    } else {
                        return action.tree.success();
                    }
                })
            );
    @Effect()
        ModManagerFilterModMaps$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.FILTER_MOD_MAP),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerVerifyAgainstOwnershipDict$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.VERIFY_AGAINST_OWNERSHIP_DICT),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerRemoveFromOwnershipDict$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.REMOVE_MOD_FROM_OWNERSHIP_DICT),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerRemoveModFromModList$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.REMOVE_MOD_FROM_MOD_LIST),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerBeginInstallation$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.BEGIN_INSTALLATION),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerAddToInstallationQue$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.ADD_TO_INSTALL_QUE),
                map(action => action.tree.success())
            );
    @Effect()
        ModManagerEndInstallation$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.END_INSTALLATION),
                map(action => {
                    const SaveState = SaveStateTree(this.store);
                    SaveState.init();
                    return action.tree.success();
                })
            );
    @Effect()
        ModManagerSetState$: Observable<any> = this.actions$
            .pipe(
                ofType(ModManagerActions.SET_STATE),
                map(action => action.tree.success())
            );
}
