import { Action } from '@ngrx/store';

import {ActionChain} from '../../model/ActionChain.class';

export const INIT_APP = '[MAIN] INIT_APP';

export class InitApp implements Action {
    readonly type = INIT_APP;
}

export const INIT_APP_SUCCESS = '[MAIN] INIT_APP';

export class InitAppSuccess implements Action {
    readonly type = INIT_APP_SUCCESS;
}

export const CLOSE_WINDOW = '[MAIN] CLOSE_WINDOW';

export class CloseWindow implements Action {
    readonly type = CLOSE_WINDOW;
}

export const SAVE_STATE = '[MAIN] SAVE_STATE';

export class SaveState implements Action {
    readonly type = SAVE_STATE;
}

export const SAVE_STATE_SUCCESS = '[MAIN] SAVE_STATE_SUCCESS';

export class SaveStateSuccess implements Action {
    readonly type = SAVE_STATE_SUCCESS;
}

export const LOAD_STATE = '[MAIN] LOAD_STATE';

export class LoadState implements Action {
    readonly type = LOAD_STATE;
    constructor(public chain: ActionChain = null) { }
}

export const LOAD_STATE_SUCCESS = '[MAIN] LOAD_STATE_SUCCESS';

export class LoadStateSuccess implements Action {
    readonly type = LOAD_STATE_SUCCESS;
    constructor(public chain: ActionChain = null) { }
}

export const GET_MHW_DIRECTORY_PATH = '[MAIN] GET_MHW_DIRECTORY_PATH';

export class GetMhwDirectoryPath implements Action {
    readonly type = GET_MHW_DIRECTORY_PATH;
    constructor(public chain: ActionChain = null) { }
}

export const GET_MHW_DIRECTORY_PATH_SUCCESS = '[MAIN] GET_MHW_DIRECTORY_PATH_SUCCESS';

export class GetMhwDirectoryPathSuccess implements Action {
    readonly type = GET_MHW_DIRECTORY_PATH_SUCCESS;
    constructor(public chain: ActionChain = null) { }
}

export const GET_MHW_DIRECTORY_PATH_FAILED = '[MAIN] GET_MHW_DIRECTORY_PATH_FAILED';

export class GetMhwDirectoryPathFailed implements Action {
    readonly type = GET_MHW_DIRECTORY_PATH;
    constructor(public chain: ActionChain = null) { }
}

export const MAIN_SUCCESS = '[MAIN] MAIN_SUCCESS';

export class MainSuccess implements Action {
    readonly type = MAIN_SUCCESS;
}

export const MAIN_FAILED = '[MAIN] MAIN_FAILED';

export class MainFailed implements Action {
    readonly type = MAIN_FAILED;
    constructor(public chain: ActionChain = null) { }
}

export type All = InitApp | InitAppSuccess | CloseWindow | SaveState | MainSuccess | MainFailed |
    GetMhwDirectoryPath | GetMhwDirectoryPathSuccess | GetMhwDirectoryPathFailed;
