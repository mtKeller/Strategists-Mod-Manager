import {InitializeFileSystemState} from './FileSystem.state';
import * as FileSystemActions from './FileSystem.actions';
import {Action} from '@ngrx/store';

export function FileSystemReducer(state = InitializeFileSystemState(), action: Action) {
    switch (action.type) {
        case FileSystemActions.READ_FILE: {
            return {
                ...state,
                fileSystemLoading: true
            };
        }
        case FileSystemActions.READ_FILE_SUCCESS: {
            return {
                ...state,
                fileSystemLoading: false
            };
        }
        case FileSystemActions.FILE_SYSTEM_FAILURE: {
            return {
                ...state,
                fileSystemLoading: false
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
}
