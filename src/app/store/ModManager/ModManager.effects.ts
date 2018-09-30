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

@Injectable()
  export class ModManagerEffects {
    modFolderMap: Array<string>;
    needsProcessing: Array<string>;
    downloadManagerCurrentFiles: Array<any>;
    downloadedModDetail: Array<any>;
    mhwDIR: string;

    constructor(private actions$: Actions, private store: Store<any> ) {
        this.store.select(state => state.ModManagerState.modFolderMap).subscribe(val => {
            if (val) {
                this.modFolderMap = val;
            }
        });

        this.store.select(state => state.ModManagerState.downloadedModDetail).subscribe(val => {
            this.downloadedModDetail = val;
        });

        this.store.select(state => state.MainState.mhwDirectoryPath).subscribe(val => {
            this.mhwDIR = val;
        });
    }
    @Effect()
        ModManagerProcessMod$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_MOD)
            .map(action => {
                console.log('Process MOD: ', action.payload);
                let payload = null;
                for (let i = 0; i < this.downloadedModDetail.length; i++) {
                    console.log(this.downloadedModDetail[i].modArchiveName);
                    if (action.payload === this.downloadedModDetail[i].modArchiveName) {
                        payload = this.downloadedModDetail[i];
                        payload.modArchivePath = `${this.mhwDIR}\\modFolder\\${action.payload}`;
                        this.store.dispatch(new ModManagerActions.RemoveModDetailFromDownload(action.payload));
                        console.log('PAYLOAD', payload);
                        break;
                    }
                }
                console.log('PAYLOAD2', payload);

                if (action.payload.indexOf('.rar') > -1) {
                    return new ModManagerActions.ProcessRarMod(payload);
                } else if (action.payload.indexOf('.zip') > -1) {
                    return new ModManagerActions.ProcessZipMod(payload);
                } else if (action.payload.indexOf('.7z') > -1) { // TODO WILL NOT WORK AT THE MOMENT
                    return new ModManagerActions.Process7ZipMod(payload);
                } else {
                    return new ModManagerActions.ModManagerSuccess();
                }
            });
    @Effect()
        ModManagerProcessRarMod$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_RAR_MOD)
            .map(action => {
                console.log('HIT PROCESS RAR MOD', action);
                const ActionNodeDeleteDownloadItem: ActionNode = {
                    initAction: new DownloadManagerActions.RemoveDownloadItem(),
                    successNode: null,
                    failureNode: null,
                    payload: action.payload.modArchiveName
                };
                const ActionNodeUpdateProgress100: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeDeleteDownloadItem,
                    failureNode: null,
                    payload: 100
                };
                // PROGRESS
                const ActionNodeDeleteDir: ActionNode = {
                    initAction: new FileSystemActions.DeleteDirectory(),
                    successNode: ActionNodeUpdateProgress100,
                    failureNode: null,
                    payload: this.mhwDIR + `\\modFolder\\temp\\${action.payload.modTitle}\\`
                };
                // TIER 3 DELETE OWN DIR
                const ActionNodeUpdateProgress75: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeDeleteDir,
                    failureNode: null,
                    payload: 75
                };
                // UPDATE PROGRESS TO 100
                const ActionNodeAddModToModList: ActionNode = {
                    initAction: new ModManagerActions.AddModToModList(),
                    successNode: ActionNodeUpdateProgress75,
                    failureNode: null,
                };
                // TIER 2 ADD MAP TO PAYLOAD THEN ADD MOD TO MOD LIST
                // UPDATE PROGRESS TO 66
                const ActionNodeUpdateProgress50: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeAddModToModList,
                    failureNode: null,
                    payload: 50
                };
                // Tier 1 MAP OWN DIR
                const ActionNodeMapDirectory: ActionNode = {
                    initAction: new FileSystemActions.MapDirectoryThenAppendPayload(),
                    successNode: ActionNodeUpdateProgress50,
                    failureNode: null,
                    payload: this.mhwDIR + `\\modFolder\\temp\\${action.payload.modTitle}\\`
                };
                // UPDATE PROGRESS TO 33
                const ActionNodeUpdateProgress25: ActionNode = {
                    initAction: new DownloadManagerActions.UpdateDownloadItemProcessingProgress(),
                    successNode: ActionNodeMapDirectory,
                    failureNode: null,
                    payload: 25
                };
                // Tier 0 UNRAR INTO OWN DIR IN TEMP
                const ActionNodeUnRarFile: ActionNode = {
                    initAction: new FileSystemActions.UnrarFile(),
                    successNode: ActionNodeUpdateProgress25,
                    failureNode: null,
                    payload: [action.payload.modArchivePath,
                        this.mhwDIR + `\\modFolder\\temp\\${action.payload.modTitle}\\`]
                };
                const ActionTreeParam: ActionTreeParams = {
                    actionNode: ActionNodeUnRarFile,
                    payload: action.payload,
                    store: this.store
                };
                const ActionTreeProcessRarMod: ActionTree = new ActionTree(ActionTreeParam);
                console.log('process rar mod', ActionTreeProcessRarMod);
                ActionTreeProcessRarMod.init();
                return new ModManagerActions.ModManagerSuccess();
            });
    @Effect()
        ModMangerAddModToModList$: Observable<any> = this.actions$
            .ofType(ModManagerActions.ADD_MOD_TO_MOD_LIST)
            .map(action => {
                return action.tree.success();
            });
    @Effect()
        ModManagerProcessZipMod$: Observable<any> = this.actions$
            .ofType(ModManagerActions.PROCESS_ZIP_MOD)
            .map(action => {
                // UPDATE PROGRESS TO 100
                // Tier 1 Add Payload to Mod list
                // UPDATE PROGRESS TO 50
                // Tier 0 get ZIP LIST of Payload add to payload
                console.log(action);
                return new ModManagerActions.ModManagerSuccess();
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
                console.log('CHECK MOD STATE', action.tree.payload);
                return action.tree.success();
            });
}
