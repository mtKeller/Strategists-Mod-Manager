import { InitializeDownloadManagerState } from './DownloadManager.state';
import * as DownloadManagerActions from './DownloadManager.actions';
import { Action } from '@ngrx/store';

export function DownloadManagerReducer(state = InitializeDownloadManagerState(), action: Action) {
    switch (action.type) {
        case DownloadManagerActions.INIT_DOWNLOAD_MANAGER: {
            return {
                ...state,
                ready: true
            };
        }
        case DownloadManagerActions.ADD_DOWNLOAD_ITEM: {
            let newState = {
                ...state
            };
            if (state.currentFiles.length < 1) {
                newState = {
                    ...state,
                    currentFiles: [
                        {
                            fileName: action.payload,
                            progress: 0.0,
                            complete: false
                        }
                    ]
                };
            } else {
                let exists = false;
                for (let i = 0; i < state.currentFiles.length; i++) {
                    if (action.payload === state.currentFiles[i]) {
                        exists = true;
                    }
                }
                if (!exists) {
                    const newEntry = state.currentFiles;
                    newEntry.push({
                        fileName: action.payload,
                        progress: 0.0,
                        complete: false
                    });
                    newState = {
                        ...state,
                        currentFiles: newEntry
                    };
                }
            }
            return newState;
        }
        case DownloadManagerActions.COMPLETE_DOWNLOAD_ITEM: {
            let newState;
            if (state.currentFiles.length < 1) {
                newState = {
                    ...state,
                };
            } else {
                const newArray = [];
                for (let i = 0; i < state.currentFiles.length; i++) {
                    if (action.payload !== state.currentFiles[i].fileName) {
                        newArray.push(state.currentFiles[i]);
                    } else {
                        newArray.push({
                            fileName: state.currentFiles[i].fileName,
                            progress: 100,
                            complete: true
                        });
                    }
                }
                newState = {
                    ...state,
                    currentFiles: newArray
                };
            }
            return newState;
        }
        case DownloadManagerActions.REMOVE_DOWNLOAD_ITEM: {
            let newState;
            if (state.currentFiles.length < 1) {
                newState = {
                    ...state,
                };
            } else {
                const newArray = [];
                for (let i = 0; i < state.currentFiles.length; i++) {
                    if (action.payload !== state.currentFiles[i].fileName) {
                        newArray.push(state.currentFiles[i]);
                    }
                }
                newState = {
                    ...state,
                    currentFiles: newArray
                };
            }
            return newState;
        }
        case DownloadManagerActions.UPDATE_DOWNLOAD_ITEM_PROGRESS: {
            let newState;
            if (state.currentFiles.length < 1) {
                newState = {
                    ...state,
                };
            } else {
                const newArray = [];
                for (let i = 0; i < state.currentFiles.length; i++) {
                    if (action.payload[0] !== state.currentFiles[i].fileName) {
                        newArray.push(state.currentFiles[i]);
                    } else {
                        newArray.push({
                            fileName: state.currentFiles[i].fileName,
                            progress: action.payload[1],
                            complete: false
                        });
                    }
                }
                newState = {
                    ...state,
                    currentFiles: newArray
                };
            }
            return newState;
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
