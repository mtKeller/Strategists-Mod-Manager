import {InitializeMainState} from './Main.state';
import * as MainActions from './Main.actions';
import {Action} from '@ngrx/store';

export function MainReducer(state = InitializeMainState(), action: Action) {
    switch (action.type) {
        case MainActions.INIT_APP: {
            return {
                ...state,
                loading: true
            };
        }
        case MainActions.INIT_APP_SUCCESS: {
            return {
                ...state,
                loading: false
            };
        }
        case MainActions.LOAD_STATE: {
            return {
                ...state,
                loading: true
            };
        }
        case MainActions.HALT_ACTION: {
            return {
                ...state,
                haltedAction: action
            };
        }
        case MainActions.LOAD_STATE_SUCCESS: {
            // console.log(action.tree.payload);
            const storedState = action.tree.payload;
            const newState = {
                ...state,
                loading: false,
                mhwDirectoryPath: storedState.MainState.mhwDirectoryPath,
                mhwDirectoryMap: storedState.MainState.mhwDirectoryMap
            };
            return newState;
        }
        case MainActions.GET_MHW_DIRECTORY_PATH: {
            return {
                ...state,
                loading: true,
            };
        }
        case MainActions.GET_MHW_DIRECTORY_PATH_SUCCESS: {
            // console.log('SHOULD HIT A FEW TIMES', action.tree.payload);
            return {
                ...state,
                loading: true,
                mhwDirectoryPath: action.tree.payload
            };
        }
        case MainActions.SET_MHW_MAPPED_DIR: {
            return {
                ...state,
                loading: false,
                mhwDirectoryMap: action.tree.payload
            };
        }
        case MainActions.INIT_DIR_WATCH: {
            return {
                ...state,
                watchingMhwDir: true
            };
        }
        case MainActions.INIT_MOD_MANAGER: {
            return {
                ...state,
                ready: true
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
}
