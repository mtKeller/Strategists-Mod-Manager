import {InitializeMainState} from './Main.state';
import * as MainActions from './Main.actions';
import {Action} from '@ngrx/store';

export interface Main {
    loading: boolean;
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
        default: {
            return {
                ...state
            };
        }
    }
}
