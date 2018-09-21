import { Action } from '@ngrx/store';

import { ActionTree } from '../../model/ActionTree.class';

export const VERIFY_MODS = '[Mod Manager] VERIFY_MODS';

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

export type All = VerifyMods | PackMod | UnpackMod;
