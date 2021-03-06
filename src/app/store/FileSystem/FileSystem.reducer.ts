import {InitializeFileSystemState} from './FileSystem.state';
import * as FileSystemActions from './FileSystem.actions';
import {Action} from '@ngrx/store';

export function FileSystemReducer(state = InitializeFileSystemState(), action: Action) {
    switch (action.type) {
        case FileSystemActions.READ_FILE: {
            return {
                ...state,
                fileSystemLoading: true,
                targetPath: action.tree.payload
            };
        }
        case FileSystemActions.READ_FILE_SUCCESS: {
            return {
                ...state,
                fileSystemLoading: false,
                // data: action.tree.payload
            };
        }
        case FileSystemActions.WRITE_FILE: {
            if (action.tree.payload.data && action.tree.payload.path) {
                return {
                    ...state,
                    fileSystemLoading: true,
                    targetPath: action.tree.payload.path,
                    // data: action.tree.payload.data
                };
            } else {
                return {
                    ...state,
                    fileSystemLoading: true,
                    targetPath: action.tree.payload
                };
            }
        }
        case FileSystemActions.WRITE_FILE_SUCCESS: {
            return {
                ...state,
                fileSystemLoading: false,
                targetPath: null,
                data: null
            };
        }
        case FileSystemActions.GET_DIRECTORIES: {
            return {
                ...state,
                targetPath: action.tree.payload
            };
        }
        case FileSystemActions.FILE_SYSTEM_FAILURE: {
            return {
                ...state,
                fileSystemLoading: false,
                data: null
            };
        }
        default: {
            return {
                ...state
            };
        }
    }
}
