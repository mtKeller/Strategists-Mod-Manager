import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ActionTree,
    ActionNode,
    ActionTreeParams
} from '../../model/ActionTree.class';
import * as ModManagerActions from './ModManager.action';
import * as FileSystemActions from '../FileSystem/FileSystem.actions';
import * as DownloadManagerActions from '../DownloadManager/DownloadManager.actions';
import { SaveStateTree } from '../Main/Main.tree';
import { map } from 'rxjs-compat/operator/map';

function replaceAll(str , search, replacement) {
    const target = str;
    return target.split(search).join(replacement);
}

@Injectable()
  export class ModManagerEffects {
    modFolderMap: Array<string>;
    modList: Array<any>;
    downloadManagerCurrentFiles: Array<any>;
    downloadedModDetail: Array<any>;
    mhwDIR: string;
    processingQue: Array<any>;
    modProcessing: boolean;

    constructor(private actions$: Actions, private store: Store<any> ) {
        this.store.select(state => state.ModManagerState.modFolderMap).subscribe(val => {
            if (val) {
                this.modFolderMap = val;
            }
        });
        this.store.select(state => state.DownloadManagerState.currentFiles).subscribe(val => {
            this.downloadManagerCurrentFiles = val;
        });
        this.store.select(state => state.ModManagerState.downloadedModDetail).subscribe(val => {
            // console.log('CHANGE TO MOD DETAIL', val);
            this.downloadedModDetail = val;
        });

        this.store.select(state => state.MainState.mhwDirectoryPath).subscribe(val => {
            this.mhwDIR = val;
        });

        this.store.select(state => state.ModManagerState.modList).subscribe(val => {
            this.modList = val;
        });
        this.store.select(state => state.ModManagerState.processingQue).subscribe(val => {
            this.processingQue = val;
        });
        this.store.select(state => state.ModManagerState.modProcessing).subscribe(val => {
            this.modProcessing = val;
        });
        setInterval(() => {
            if (!this.modProcessing && this.processingQue.length !== 0) {
                this.store.dispatch(this.processingQue[0].tree.success());
            }
        }, 500);
    }
    @Effect()
        ModManagerBeginProcessingMod$: Observable<any> = this.actions$
            .ofType(ModManagerActions.BEGIN_MOD_PROCESSING)
            .map(action => {
                return action.tree.success();
            });
    @Effect()
        ModManagerProcessMod$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_MOD)
            .map(action => {
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
            });
    @Effect()
        ModManagerProcessModByName$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_MOD_BY_NAME)
            .map(action => {
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
            });
    @Effect()
        ModManagerProcessRarMod$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_RAR_MOD)
            .map(action => {
                console.log('HIT PROCESS RAR MOD', action);
                const ActionNodeModProcessed: ActionNode = {
                    initAction: new ModManagerActions.ModProcessed(),
                    successNode: null,
                };
                const ActionNodeDeleteModDetailFromDownload: ActionNode = {
                    initAction: new ModManagerActions.RemoveModDetail(),
                    successNode: ActionNodeModProcessed,
                    payload: action.payload.modArchiveName
                };
                const ActionNodeDeleteDownloadItem: ActionNode = {
                    initAction: new DownloadManagerActions.RemoveDownloadItem(),
                    successNode: ActionNodeDeleteModDetailFromDownload,
                    payload: action.payload.modArchiveName
                };
                const ActionNodeUpdateProgress100: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeDeleteDownloadItem,
                    payload: 100
                };
                // PROGRESS
                const ActionNodeDeleteDir: ActionNode = {
                    initAction: new FileSystemActions.DeleteDirectory(),
                    successNode: ActionNodeUpdateProgress100,
                    payload: this.mhwDIR + `\\modFolder\\temp\\${action.payload.modTitle}\\`
                };
                // TIER 3 DELETE OWN DIR
                const ActionNodeUpdateProgress75: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeDeleteDir,
                    payload: 75
                };
                // UPDATE PROGRESS TO 100
                const ActionNodeAddModToModList: ActionNode = {
                    initAction: new ModManagerActions.AddModToModList(),
                    successNode: ActionNodeUpdateProgress75,
                };
                // TIER 2 ADD MAP TO PAYLOAD THEN ADD MOD TO MOD LIST
                // UPDATE PROGRESS TO 66
                const ActionNodeUpdateProgress50: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeAddModToModList,
                    payload: 50
                };
                // Tier 1 MAP OWN DIR
                const ActionNodeMapDirectory: ActionNode = {
                    initAction: new FileSystemActions.MapDirectoryThenAppendPayload(),
                    successNode: ActionNodeUpdateProgress50,
                    payload: this.mhwDIR + `\\modFolder\\temp\\${action.payload.modTitle}\\`
                };
                // UPDATE PROGRESS TO 33
                const ActionNodeUpdateProgress25: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeMapDirectory,
                    payload: 25
                };
                // Tier 0 UNRAR INTO OWN DIR IN TEMP
                const ActionNodeUnRarFile: ActionNode = {
                    initAction: new FileSystemActions.UnrarFile(),
                    successNode: ActionNodeUpdateProgress25,
                    failureNode: null,
                    payload: [replaceAll(action.payload.modArchivePath, '/', '\\'),
                        this.mhwDIR + `\\modFolder\\temp\\${action.payload.modTitle}\\`]
                };
                const ActionNodeBeginModProcessing: ActionNode = {
                    initAction: new ModManagerActions.BeginModProcessing(),
                    successNode: ActionNodeUnRarFile,
                };
                const ActionNodeAddModToProcessingQue: ActionNode = {
                    initAction: new ModManagerActions.AddModToProcessingQue(),
                    successNode: ActionNodeBeginModProcessing,
                    payload: action.payload.modArchiveName
                };
                const ActionTreeParam: ActionTreeParams = {
                    actionNode: ActionNodeAddModToProcessingQue,
                    payload: action.payload,
                    store: this.store
                };
                const ActionTreeProcessRarMod: ActionTree = new ActionTree(ActionTreeParam);
                console.log('process rar mod', ActionTreeProcessRarMod);
                return ActionTreeProcessRarMod.begin();
            });
    @Effect()
        ModMangerAddModToModList$: Observable<any> = this.actions$
            .ofType(ModManagerActions.ADD_MOD_TO_MOD_LIST)
            .map(action => {
                return action.tree.success();
            });
    @Effect()
        ModManagerRemoveModDetail$: Observable<any> = this.actions$
            .ofType(ModManagerActions.REMOVE_MOD_DETAIL)
            .map(action => {
                this.store.dispatch(SaveStateTree(this.store).begin());
                if (action.tree) {
                    return action.tree.success();
                } else {
                    return new ModManagerActions.ModManagerSuccess();
                }
            });
    @Effect()
        ModManagerProcessZipMod$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_ZIP_MOD)
            .map(action => {
                const ActionNodeModProcessed: ActionNode = {
                    initAction: new ModManagerActions.ModProcessed(),
                    successNode: null,
                };
                const ActionNodeDeleteModDetailFromDownload: ActionNode = {
                    initAction: new ModManagerActions.RemoveModDetail(),
                    successNode: ActionNodeModProcessed,
                    payload: action.payload.modArchiveName
                };
                const ActionNodeDeleteDownloadItem: ActionNode = {
                    initAction: new DownloadManagerActions.RemoveDownloadItem(),
                    successNode: ActionNodeDeleteModDetailFromDownload,
                    payload: action.payload.modArchiveName
                };
                // UPDATE PROGRESS TO 100
                const ActionNodeUpdateProgress100: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeDeleteDownloadItem,
                    payload: 100
                };
                // Tier 1 Add Payload to Mod list
                const ActionNodeAddModToModList: ActionNode = {
                    initAction: new ModManagerActions.AddModToModList(),
                    successNode: ActionNodeUpdateProgress100,
                };
                // UPDATE PROGRESS TO 50
                const ActionNodeUpdateProgress50: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeAddModToModList,
                    payload: 50
                };
                // Tier 0 get ZIP LIST of Payload add to payload
                const ActionNodeViewZipContents: ActionNode = {
                    initAction: new FileSystemActions.ViewZippedContents(),
                    successNode: ActionNodeUpdateProgress50,
                    payload: action.payload.modArchivePath
                };
                const ActionNodeBeginModProcessing: ActionNode = {
                    initAction: new ModManagerActions.BeginModProcessing(),
                    successNode: ActionNodeViewZipContents,
                };
                const ActionNodeAddModToProcessingQue: ActionNode = {
                    initAction: new ModManagerActions.AddModToProcessingQue(),
                    successNode: ActionNodeBeginModProcessing,
                    payload: action.payload.modArchiveName
                };
                const ActionTreeParam: ActionTreeParams = {
                    actionNode: ActionNodeAddModToProcessingQue,
                    payload: action.payload,
                    store: this.store
                };
                const ActionTreeProcessZipMod: ActionTree = new ActionTree(ActionTreeParam);
                // console.log('PROCESS_NODE_TREE_ZIP', ActionTreeProcessZipMod);
                return ActionTreeProcessZipMod.begin();
            });
    @Effect()
        ModManagerProcess7ZipMod$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_7_ZIP_MOD)
            .map(action => {
                // UPDATE PROGRESS TO 100
                // Tier 1 Add Payload to Mod list
                // UPDATE PROGRESS TO 50
                // Tier 0 get 7ZIP LIST of Payload add to payload
                console.log(action);
                return new ModManagerActions.ModManagerSuccess();
            });
    @Effect()
        ModManagerSetNativePcMap$: Observable<any> = this.actions$
            .ofType(ModManagerActions.SET_NATIVE_PC_MAP)
            .map(action => {
                // Insert Processing of direct installed MODS here
                // Generates Anon JSON
                return action.tree.success();
            });
    @Effect()
        ModManagerSetModFolderMap$: Observable<any> = this.actions$
            .ofType(ModManagerActions.SET_MOD_FOLDER_MAP)
            .map(action => {
                let payload;
                if (action.payload) {
                    payload = action.payload.filter(path => path.indexOf('/temp/') > -1);
                } else {
                    payload = action.tree.payload.filter(path => path.indexOf('/temp/') === -1);
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
                    for (let j = 0; j < this.downloadedModDetail.length; j++) {
                        if (payload[i].indexOf(this.downloadedModDetail[j].modArchiveName) > -1) {
                            // console.log('BROKE INSIDE ARCHIVE NAMES AT MOD DETAIL');
                            modExists = true;
                            break;
                        }
                    }
                    for (let j = 0; j < this.modList.length; j++) {
                        for (let k = 0; k < this.modList[j].archiveNames.length; k++) {
                            if (payload[i].indexOf(this.modList[j].archiveNames[k]) > -1) {
                                // console.log('BROKE INSIDE ARCHIVE NAMES AT MOD LIST');
                                modExists = true;
                                break;
                            }
                        }
                    }
                    if (!modExists) {
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
                // console.log('HIT OUTSIDE LOOP');
                // Insert Processing of dragged over MODS here
                // Check against downloadedModDetail and Current MODS
                // Generates Anon JSON
                return action.tree.success();
            });
    @Effect()
        ModManagerSetState$: Observable<any> = this.actions$
            .ofType(ModManagerActions.SET_STATE)
            .map(action => {
                // this.store.dispatch(new ModManagerActions.VerifyMods());
                // console.log('CHECK MOD STATE', action.tree.payload);
                return action.tree.success();
            });
}
