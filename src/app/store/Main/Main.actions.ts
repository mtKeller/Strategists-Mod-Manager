import { Action } from '@ngrx/store';

import { ActionTree } from '../../model/ActionTree.class';

export const INIT_APP = '[MAIN] INIT_APP';

export class InitApp implements Action {
    readonly type = INIT_APP;
}

export const INIT_APP_SUCCESS = '[MAIN] INIT_APP';

export class InitAppSuccess implements Action {
    readonly type = INIT_APP_SUCCESS;
}

export const PLAY = '[MAIN] PLAY';

export class Play implements Action {
    readonly type = PLAY;
}

export const HALT_ACTION = '[MAIN] HALT_ACTION';

export class HaltAction implements Action {
    readonly type = HALT_ACTION;
    constructor(public tree: ActionTree = null) { }
}

export const OPEN_MOD_NEXUS = '[MAIN] OPEN_MOD_NEXUS';

export class OpenModNexus implements Action {
    readonly type = OPEN_MOD_NEXUS;
}

export const OPEN_MHW_DIRECTORY = '[MAIN] OPEN_MHW_DIRECTORY';

export class OpenMhwDirectory implements Action {
    readonly type = OPEN_MHW_DIRECTORY;
}

export const CLOSE_WINDOW = '[MAIN] CLOSE_WINDOW';

export class CloseWindow implements Action {
    readonly type = CLOSE_WINDOW;
}

export const MINIMIZE_WINDOW = '[MAIN] MINIMIZE_WINDOW';

export class MinimizeWindow implements Action {
    readonly type = MINIMIZE_WINDOW;
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
    constructor(public chain: ActionTree = null) { }
}

export const LOAD_STATE_SUCCESS = '[MAIN] LOAD_STATE_SUCCESS';

export class LoadStateSuccess implements Action {
    readonly type = LOAD_STATE_SUCCESS;
    constructor(public chain: ActionTree = null) { }
}

export const GET_MHW_DIRECTORY_PATH = '[MAIN] GET_MHW_DIRECTORY_PATH';

export class GetMhwDirectoryPath implements Action {
    readonly type = GET_MHW_DIRECTORY_PATH;
    constructor(public chain: ActionTree = null) { }
}

export const GET_MHW_DIRECTORY_PATH_SUCCESS = '[MAIN] GET_MHW_DIRECTORY_PATH_SUCCESS';

export class GetMhwDirectoryPathSuccess implements Action {
    readonly type = GET_MHW_DIRECTORY_PATH_SUCCESS;
    constructor(public chain: ActionTree = null) { }
}

export const GET_MHW_DIRECTORY_PATH_FAILED = '[MAIN] GET_MHW_DIRECTORY_PATH_FAILED';

export class GetMhwDirectoryPathFailed implements Action {
    readonly type = GET_MHW_DIRECTORY_PATH;
    constructor(public chain: ActionTree = null) { }
}

export const SET_MHW_MAPPED_DIR = '[MAIN] SET_MHW_MAPPED_DIR';

export class SetMhwMappedDir implements Action {
    readonly type = SET_MHW_MAPPED_DIR;
    constructor(public chain: ActionTree = null) { }
}

export const INIT_DIR_WATCH = '[MAIN] INIT_DIR_WATCH';

export class InitDirWatch implements Action {
    readonly type = INIT_DIR_WATCH;
    constructor(public chain: ActionTree = null) { }
}

export const DIR_WATCH_EMIT = '[MAIN] DIR_WATCH_EMIT';

export class DirWatchEmit implements Action {
    readonly type = DIR_WATCH_EMIT;
    constructor(public chain: ActionTree = null) { }
}

export const INIT_MOD_MANAGER = '[MAIN] INIT_MOD_MANAGER';

export class InitModManager implements Action {
    readonly type = INIT_MOD_MANAGER;
    constructor(public chain: ActionTree = null) { }
}

export const MAIN_SUCCESS = '[MAIN] MAIN_SUCCESS';

export class MainSuccess implements Action {
    readonly type = MAIN_SUCCESS;
}

export const MAIN_FAILED = '[MAIN] MAIN_FAILED';

export class MainFailed implements Action {
    readonly type = MAIN_FAILED;
    constructor(public chain: ActionTree = null) { }
}

export type All = InitApp | InitAppSuccess | CloseWindow | SaveState | MainSuccess | MainFailed |
    GetMhwDirectoryPath | GetMhwDirectoryPathSuccess | GetMhwDirectoryPathFailed | InitDirWatch |
    SetMhwMappedDir | DirWatchEmit | Play | OpenModNexus | InitModManager | OpenMhwDirectory |
    MinimizeWindow | HaltAction;
