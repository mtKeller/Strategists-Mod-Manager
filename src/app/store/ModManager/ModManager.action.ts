import { Action } from '@ngrx/store';

import { ActionTree } from '../../model/ActionTree.class';

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

export type All = VerifyMods | PackMod | UnpackMod | SetNativePcMap | SetModFolderMap | SetState;
