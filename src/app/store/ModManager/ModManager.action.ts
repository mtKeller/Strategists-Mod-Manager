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

export const PROCESS_MODS = '[ModManager] PROCESS_MODS';

export class ProcessMods implements Action {
    readonly type = PROCESS_MODS;
}

export const ADD_MOD_FROM_PROCESSING = '[ModManager] ADD_MOD_FROM_PROCESSING';

export class AddModFromProcessing implements Action {
    readonly type = ADD_MOD_FROM_PROCESSING;
    constructor(public payload: Mod) { }
}

export const ADD_MOD_DETAIL_FROM_DOWNLOAD = '[ModManager] ADD_MOD_DETAIL_FROM_DOWNLOAD';

export class AddModDetailFromDownload implements Action {
    readonly type = ADD_MOD_DETAIL_FROM_DOWNLOAD;
    constructor(public payload: any) { }
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
    ProcessMods | AddModFromProcessing | ModManagerSuccess | AddModDetailFromDownload;
