import { Action } from '@ngrx/store';

export interface MainState {
    loading: boolean;
    mhwDirectoryPath: string;
    mhwDirectoryMap: any;
    watchingMhwDir: boolean;
    haltedAction: Action;
    ready: boolean;
    ipcActive: boolean;
}

export function InitializeMainState() {
    return{
        loading: false,
        mhwDirectoryPath: null,
        mhwDirectoryMap: [],
        watchingMhwDir: false,
        haltedAction: null,
        ready: false,
        ipcActive: true
    };
}
