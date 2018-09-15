import {InitializeMainState} from './Main.state';
import * as MainActions from './Main.actions';
import {Action} from '@ngrx/store';

interface Main {
    loading: boolean;
    storedState: JSON;
    mhwDirectory: string;
    nexusUser: string;
    nexusSecret: string;
    mhwDirectoryMap: any;
    chokidarObserver: any;
}

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
        case MainActions.LOAD_STATE_SUCCESS: {
            return {
                ...state,
                loading: false,
                storedState: JSON.parse(action.chain.payload)
            };
        }
        case MainActions.GET_MHW_DIRECTORY_PATH: {
            return {
                ...state,
                loading: true,
            };
        }
        case MainActions.GET_MHW_DIRECTORY_PATH_SUCCESS: {
            return {
                ...state,
                loading: true,
                mhwDirectory: action.chain.payload
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
}
