import { Action } from '@ngrx/store';

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

export const LOAD_STATE_SUCCESS = '[MAIN] LOAD_STATE_SUCCESS';

export const MAIN_SUCCESS = '[MAIN] MAIN_SUCCESS';

export class MainSuccess implements Action {
    readonly type = MAIN_SUCCESS;
}

export const MAIN_FAILED = '[MAIN] MAIN_FAILED';

export interface MainError {
    failedAction: string;
    errorContents: any;
}

export class MainFailed implements Action {
    readonly type = MAIN_FAILED;
    constructor(public payload: MainError = null) { }
}

export type All = InitApp | InitAppSuccess | CloseWindow | SaveState | MainSuccess | MainFailed;
