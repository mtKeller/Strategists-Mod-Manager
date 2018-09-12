import { initializeMonsterVariantState } from './MonsterVariant.state';
import * as MonsterVariantActions from './MonsterVariant.actions';
import { Action } from '@ngrx/store';

export function FileSystemReducer(state = initializeMonsterVariantState(), action: Action) {
    switch (action.type) {
        default: {
            return {
                ...state
            };
        }
    }
}
