import { Action } from '@ngrx/store';

import { ActionTree } from '../../model/ActionTree.class';
import { Mod } from './ModManager.state';

export const SET_NATIVE_PC_MAP = '[ModManager] SET_NATIVE_PC_MAP';

export class SetNativePcMap implements Action {
    readonly type = SET_MOD_FOLDER_MAP;
    constructor(public tree: ActionTree = null) { }
}

export const SET_MOD_FOLDER_MAP = '[ModManager] SET_MOD_FOLDER_MAP';

export class SetModFolderMap implements Action {
    readonly type = SET_MOD_FOLDER_MAP;
    constructor(public tree: ActionTree = null) { }
}

export const VERIFY_MODS = '[ModManager] VERIFY_MODS';

export class VerifyMods implements Action {
    readonly type = VERIFY_MODS;
    constructor(public chain: ActionTree = null) { }
}

export const PROCESS_MOD = '[ModManager] PROCESS_MOD';

export class ProcessMod implements Action {
    readonly type = PROCESS_MOD;
    constructor(public payload: any = null) { }
}

export const BEGIN_MOD_PROCESSING = '[ModManager] BEGIN_MOD_PROCESSING';

export class BeginModProcessing implements Action {
    readonly type = BEGIN_MOD_PROCESSING;
    constructor(public tree: ActionTree = null) { }
}

export const PROCESS_MOD_BY_NAME = '[ModManager] PROCESS_MOD_BY_NAME';

export class ProcessModByName implements Action {
    readonly type = PROCESS_MOD_BY_NAME;
    constructor(public payload: any = null) { }
}

export const PROCESS_RAR_MOD = '[ModManager] PROCESS_RAR_MOD';

export class ProcessRarMod implements Action {
    readonly type = PROCESS_RAR_MOD;
    constructor(public payload: any = null) { }
}

export const PROCESS_ZIP_MOD = '[ModManager] PROCESS_ZIP_MOD';

export class ProcessZipMod implements Action {
    readonly type = PROCESS_ZIP_MOD;
    constructor(public payload: any = null) { }
}

export const PROCESS_7_ZIP_MOD = '[ModManager] PROCESS_7_ZIP_MOD';

export class Process7ZipMod implements Action {
    readonly type = PROCESS_7_ZIP_MOD;
    constructor(public payload: any = null) { }
}

export const ADD_MOD_TO_MOD_LIST = '[ModManager] ADD_MOD_TO_MOD_LIST';

export class AddModToModList implements Action {
    readonly type = ADD_MOD_TO_MOD_LIST;
    constructor(public tree: ActionTree = null) { }
}

export const ADD_MOD_FROM_PROCESSING = '[ModManager] ADD_MOD_FROM_PROCESSING';

export class AddModFromProcessing implements Action {
    readonly type = ADD_MOD_FROM_PROCESSING;
    constructor(public payload: Mod) { }
}

export const ADD_MOD_TO_PROCESSING_QUE = '[ModManager] ADD_MOD_TO_PROCESSING_QUE';

export class AddModToProcessingQue implements Action {
    readonly type = ADD_MOD_TO_PROCESSING_QUE;
    constructor(public tree: ActionTree = null) { }
}

export const UPDATE_PROCESSING_PROGRESS = '[ModManager] UPDATE_PROCESSING_PROGRESS';

export class UpdateProcessingProgress implements Action {
    readonly type = UPDATE_PROCESSING_PROGRESS;
    constructor(public tree: ActionTree = null) { }
}

export const MOD_PROCESSED = '[ModManager] MOD_PROCESSED';

export class ModProcessed implements Action {
    readonly type = MOD_PROCESSED;
}

export const ADD_MOD_DETAIL_FROM_DOWNLOAD = '[ModManager] ADD_MOD_DETAIL_FROM_DOWNLOAD';

export class AddModDetailFromDownload implements Action {
    readonly type = ADD_MOD_DETAIL_FROM_DOWNLOAD;
    constructor(public payload: any) { }
}

export const REMOVE_MOD_DETAIL = '[ModManager] REMOVE_MOD_DETAIL';

export class RemoveModDetail implements Action {
    readonly type = REMOVE_MOD_DETAIL;
    constructor(public payload: any = null) { }
}

export const INSERT_TO_FRONT_OF_LOAD_ORDER = '[ModManager] INSERT_TO_FRONT_OF_LOAD_ORDER';

export class InsertToFrontOfLoadOrder implements Action {
    readonly type = INSERT_TO_FRONT_OF_LOAD_ORDER;
    constructor(public payload: Array<number> = null) { }
}

export const SHIFT_UP_MOD_OF_LOAD_ORDER = '[ModManager] SHIFT_UP_MOD_OF_LOAD_ORDER';

export class ShiftUpModOfLoadOrder implements Action {
    readonly type = SHIFT_UP_MOD_OF_LOAD_ORDER;
    constructor(public payload: Array<number> = null) { }
}

export const SHIFT_DOWN_MOD_OF_LOAD_ORDER = '[ModManager] SHIFT_DOWN_MOD_OF_LOAD_ORDER';

export class ShiftDownModOfLoadOrder implements Action {
    readonly type = SHIFT_DOWN_MOD_OF_LOAD_ORDER;
    constructor(public payload: Array<number> = null) { }
}

export const REMOVE_MOD_FROM_LOAD_ORDER = '[ModManager] REMOVE_MOD_FROM_LOAD_ORDER';

export class RemoveModFromLoadOrder implements Action {
    readonly type = REMOVE_MOD_FROM_LOAD_ORDER;
    constructor(public payload: Array<number> = null) { }
}

export const FILTER_MOD_MAP = '[ModManager] FILTER_MOD_MAP';

export class FilterModMap implements Action {
    readonly type = FILTER_MOD_MAP;
    constructor(public tree: ActionTree = null) { }
}

export const VERIFY_AGAINST_OWNERSHIP_DICT = '[ModManager] VERIFY_AGAINST_OWNERSHIP_DICT';

export class VerifyAgainstOwnershipDict implements Action {
    readonly type = VERIFY_AGAINST_OWNERSHIP_DICT;
    constructor(public tree: ActionTree = null) { }
}

export const REMOVE_MOD_FROM_OWNERSHIP_DICT = '[ModManager] REMOVE_MOD_FROM_OWNERSHIP_DICT';

export class RemoveModFromOwnershipDict implements Action {
    readonly type = REMOVE_MOD_FROM_OWNERSHIP_DICT;
    constructor(public tree: ActionTree = null) { }
}

export const PREP_DEPENDENCIES = '[ModManager] PREP_DEPENDENCIES';

export class PrepDependencies implements Action {
    readonly type = PREP_DEPENDENCIES;
    constructor(public tree: ActionTree = null) { }
}

export const FILTER_UNPACKED_DEPENDENCIES = '[ModManager] FILTER_UNPACKED_DEPENDENCIES';

export class FilterUnpackedDependencies implements Action {
    readonly type = FILTER_UNPACKED_DEPENDENCIES;
    constructor(public tree: ActionTree = null) { }
}

export const BEGIN_INSTALLATION = '[ModManager] BEGIN_INSTALLATION';

export class BeginInstallation implements Action {
    readonly type = BEGIN_INSTALLATION;
    constructor(public tree: ActionTree = null) { }
}

export const END_INSTALLATION = '[ModManager] END_INSTALLATION';

export class EndInstallation implements Action {
    readonly type = END_INSTALLATION;
    constructor(public tree: ActionTree = null) { }
}

export const ADD_TO_INSTALL_QUE = '[ModManager] ADD_TO_INSTALL_QUE';

export class AddToInstallQue implements Action {
    readonly type = ADD_TO_INSTALL_QUE;
    constructor(public tree: ActionTree = null) { }
}

export const PACK_MOD = '[ModManager] PACK_MOD';

export class PackMod implements Action {
    readonly type = PACK_MOD;
    constructor(public chain: ActionTree = null) { }
}

export const UNPACK_MOD = '[ModManager] UNPACK_MOD';

export class UnpackMod implements Action {
    readonly type = UNPACK_MOD;
    constructor(public chain: ActionTree = null) { }
}

export const SET_STATE = '[ModManager] SET_STATE';

export class SetState implements Action {
    readonly type = SET_STATE;
    constructor(public tree: ActionTree = null) { }
}

export const MOD_MANAGER_SUCCESS = '[ModManager] MOD_MANAGER_SUCCESS';

export class ModManagerSuccess implements Action {
    readonly type = MOD_MANAGER_SUCCESS;
}

export type All = VerifyMods | PackMod | UnpackMod | SetNativePcMap | SetModFolderMap | SetState |
    ProcessMod | AddModFromProcessing | ModManagerSuccess | AddModDetailFromDownload | ProcessRarMod |
    Process7ZipMod | RemoveModDetail | AddModToModList | ProcessModByName | ModProcessed |
    AddModToProcessingQue | InsertToFrontOfLoadOrder | ShiftUpModOfLoadOrder | ShiftDownModOfLoadOrder |
    RemoveModFromLoadOrder | FilterModMap | VerifyAgainstOwnershipDict | UpdateProcessingProgress | PrepDependencies |
    AddToInstallQue | FilterUnpackedDependencies | BeginInstallation | EndInstallation | RemoveModFromOwnershipDict;
