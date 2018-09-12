import { Monster } from '../../model/monster.interface';
import { Observable } from 'rxjs/Observable';

export interface MonsterList {
    monsterFamilyName: string;
    monsterMods: Array<Monster>;
    activeMonsterIndex: number;
    locked: boolean;
}

export interface MonsterVariant {
    cycleTimer: Observable<any>;
    monsterList: MonsterList;
}

export function initializeMonsterVariantState() {
    return{
        cycleTimer: null,
        monsterList: null
    };
}

// SAVE AS JSON TO FILE AFTER EACH CYCLE
// IF NO INFO JSON, WRITE OWN TO EACH MONSTER MOD
// DEFAULT RARITY IS SILVER
// READ ON LOAD
