import { Action } from '@ngrx/store';

export interface Main {
    loading: boolean;
    mhwDirectoryPath: string;
    mhwDirectoryMap: any;
    haltedAction: Action;
    ready: boolean;
}

export function InitializeMainState() {
    return{
        loading: false,
        mhwDirectoryPath: null,
        mhwDirectoryMap: [],
        haltedAction: null,
        ready: false
    };
}
