import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export const BEGIN_MONSTER_CYCLER = '[Monster Variant] BEGIN_MONSTER_CYCLER';

export class BeginMonsterCycler implements Action {
    readonly type = BEGIN_MONSTER_CYCLER;
    constructor(public payload: Observable<any> = null) { }
}

export const SYNC_MONSTER_MODS = '[Monster Variant] SYNC_MONSTER_MODS';

export class SyncMonsterMods implements Action {
    readonly type = SYNC_MONSTER_MODS;
}

export const SYNC_MONSTER_MODS_SUCCESS = '[Monster Variant] SYNC_MONSTER_MODS_SUCCESS';

export class SyncMonsterModsSuccess implements Action {
    readonly type = SYNC_MONSTER_MODS;
    constructor(public payload: any = null) { }
}

export const MONSTER_VARIANT_FAILED = '[Monster Variant] MONSTER_VARIANT_FAILED';

export class MonsterVariantFailed implements Action {
    readonly type = MONSTER_VARIANT_FAILED;
    constructor(public payload: string = null) { }
}

export type All = BeginMonsterCycler | SyncMonsterMods | SyncMonsterModsSuccess | MonsterVariantFailed;
