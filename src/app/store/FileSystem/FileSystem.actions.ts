import { Action } from '@ngrx/store';

export interface ChainAction {
    data: any;
    nextAction?: any;
}

export const READ_FILE = '[FileSystem] READ_FILE';

export class ReadFile implements Action {
    readonly type = READ_FILE;
    constructor(public payload: ChainAction = null) { }
}

export const READ_FILE_SUCCESS = '[FileSystem] READ_FILE_SUCCESS';

export class ReadFileSuccess implements Action {
    readonly type = READ_FILE_SUCCESS;
    constructor(public payload: ChainAction = null) { }
}

export const GET_DIRECTORIES = '[FileSystem] GET_DIRECTORIES';

export class GetDirectories implements Action {
    readonly type = GET_DIRECTORIES;
    constructor(public payload: ChainAction = null) { }
}

export const GET_DIRECTORIES_SUCCESS = '[FileSystem] GET_DIRECTORIES_SUCCESS';

export class GetDirectoriesSuccess implements Action {
    readonly type = GET_DIRECTORIES_SUCCESS;
    constructor(public payload: ChainAction = null) { }
}

export const RENAME_FILE = '[FILE_SYSTEM0] RENAME_FILE';

export class RenameFile implements Action {
    readonly type = RENAME_FILE;
    constructor(public payload: ChainAction = null) { }
}

export const RENAME_FILE_SUCCESS = '[FILE_SYSTEM] RENAME_FILE_SUCCESS';

export class RenameFileSuccess implements Action {
    readonly type = RENAME_FILE;
}

export const WRITE_FILE = '[FILE_SYSTEM] WRITE_FILE';

export class WriteFile implements Action {
    readonly type = WRITE_FILE;
    constructor(public payload: ChainAction = null) { }
}

export const FILE_SYSTEM_SUCCESS = '[FileSystem] FILE_SYSTEM_SUCCESS';

export class FileSystemSuccess implements Action {
    readonly type = FILE_SYSTEM_SUCCESS;
}

export const FILE_SYSTEM_FAILURE = '[FileSystem] FILE_SYSTEM_FAILURE';

export class FileSystemFailure implements Action {
    readonly type = FILE_SYSTEM_FAILURE;
    constructor(public payload: string = null) { }
}

export type All =
    ReadFile | ReadFileSuccess | GetDirectories | GetDirectoriesSuccess |
    RenameFile | RenameFileSuccess | WriteFile |
    FileSystemSuccess | FileSystemFailure ;
