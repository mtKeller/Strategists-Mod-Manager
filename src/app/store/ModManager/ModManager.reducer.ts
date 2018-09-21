import { InitializeModManagerState } from './ModManager.state';
import * as ModManagerActions from './ModManager.action';
import {Action} from '@ngrx/store';

export function ModManagerReducer(state = InitializeModManagerState(), action: Action) {
    switch (action.type) {
        case ModManagerActions.VERIFY_MODS: {
            return {
                ...state,
                loading: true
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
}
