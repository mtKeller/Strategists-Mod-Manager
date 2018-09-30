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
                            fileName: action.payload[0],
                            progress: 0.0,
                            complete: false,
                            processing: false,
                            processingProgress: 0
                        }
                    ]
                };
            } else {
                let exists = false;
                for (let i = 0; i < state.currentFiles.length; i++) {
                    if (action.payload[0] === state.currentFiles[i].fileName) {
                        exists = true;
                    }
                }
                if (!exists) {
                    const newEntry = state.currentFiles;
                    newEntry.push({
                        fileName: action.payload[0],
                        progress: 0.0,
                        complete: false,
                        processing: false,
                        processingProgress: 0
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
                            complete: true,
                            processing: false,
                            processingProgress: 0
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
                            complete: false,
                            processing: false,
                            processingProgress: 0
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
        case DownloadManagerActions.UPDATE_DOWNLOAD_ITEM_PROCESSING_PROGRESS: {
            let payload;
            if (action.payload) {
                payload = action.payload;
            } else {
                payload = action.tree.payload;
            }
            let newState;
            if (state.currentFiles.length < 1) {
                newState = {
                    ...state,
                };
            } else {
                const newArray = [];
                for (let i = 0; i < state.currentFiles.length; i++) {
                    if (payload[0] !== state.currentFiles[i].fileName) {
                        newArray.push(state.currentFiles[i]);
                    } else {
                        newArray.push({
                            fileName: state.currentFiles[i].fileName,
                            progress: state.currentFiles[i].progress,
                            complete: state.currentFiles[i].complete,
                            processing: true,
                            processingProgress: payload[1]
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
        case DownloadManagerActions.SET_STATE : {
            return {
                ...state,
                currentFiles: action.tree.payload.DownloadManagerState.currentFiles,
            };
        }
        default: {
            return {
                ...state,
            };
        }
    }
}
