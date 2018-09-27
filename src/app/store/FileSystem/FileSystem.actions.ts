import { Action } from '@ngrx/store';
import { ActionTree } from '../../model/ActionTree.class';

export const READ_FILE = '[FileSystem] READ_FILE';

export class ReadFile implements Action {
    readonly type = READ_FILE;
    constructor(public tree: ActionTree = null) { }
}

export const READ_FILE_SUCCESS = '[FileSystem] READ_FILE_SUCCESS';

export class ReadFileSuccess implements Action {
    readonly type = READ_FILE_SUCCESS;
    constructor(public tree: ActionTree = null) { }
}

export const GET_DIRECTORIES = '[FileSystem] GET_DIRECTORIES';

export class GetDirectories implements Action {
    readonly type = GET_DIRECTORIES;
    constructor(public tree: ActionTree = null) { }
}

export const GET_DIRECTORIES_SUCCESS = '[FileSystem] GET_DIRECTORIES_SUCCESS';

export class GetDirectoriesSuccess implements Action {
    readonly type = GET_DIRECTORIES_SUCCESS;
    constructor(public tree: ActionTree = null) { }
}

export const RENAME_FILE = '[FILE_SYSTEM0] RENAME_FILE';

export class RenameFile implements Action {
    readonly type = RENAME_FILE;
    constructor(public tree: ActionTree = null) { }
}

export const RENAME_FILE_SUCCESS = '[FILE_SYSTEM] RENAME_FILE_SUCCESS';

export class RenameFileSuccess implements Action {
    readonly type = RENAME_FILE;
}

export const WRITE_FILE = '[FILE_SYSTEM] WRITE_FILE';

export class WriteFile implements Action {
    readonly type = WRITE_FILE;
    constructor(public tree: ActionTree = null) { }
}

export const WRITE_FILE_SUCCESS = '[FILE_SYSTEM] WRITE_FILE_SUCCESS';

export class WriteFileSuccess implements Action {
    readonly type = WRITE_FILE_SUCCESS;
    constructor(public tree: ActionTree = null) { }
}

export const ZIP_DIR = '[FILE_SYSTEM] ZIP_FILE';

export class ZipDir implements Action {
    readonly type = ZIP_DIR;
    constructor(public tree: ActionTree = null) { }
}

export const EXEC_PROCESS = '[FileSystem] EXEC_PROCESS';

export class ExecProcess implements Action {
    readonly type = EXEC_PROCESS;
    constructor(public tree: ActionTree = null) { }
}

export const CREATE_MODDING_DIRECTORIES = '[FileSystem] CREATE_MODDING_DIRECTORIES';

export class CreateModdingDirectories implements Action {
    readonly type = CREATE_MODDING_DIRECTORIES;
    constructor(public tree: ActionTree = null) { }
}

export const GET_NATIVE_PC_MAP = '[FileSystem] GET_NATIVE_PC_MAP';

export class GetNativePcMap implements Action {
    readonly type = GET_NATIVE_PC_MAP;
    constructor(public tree: ActionTree = null) { }
}

export const GET_MOD_FOLDER_MAP = '[FileSystem] GET_MOD_FOLDER_MAP';

export class GetModFolderMap implements Action {
    readonly type = GET_MOD_FOLDER_MAP;
    constructor(public tree: ActionTree = null) { }
}

export const UNZIP_FILE = 'FileSystem UNZIP_FILE';

export class UnzipFile implements Action {
    readonly type = UNZIP_FILE;
    constructor(public tree: ActionTree = null) { }
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

export const INIT = '[FileSystem] INIT';

export class Init implements Action {
    readonly type = INIT;
}

export const EXIT = '[FileSystem] EXIT';

export class Exit implements Action {
    readonly type = EXIT;
}

export type All =
    ReadFile | ReadFileSuccess | GetDirectories | GetDirectoriesSuccess |
    RenameFile | RenameFileSuccess | WriteFile | WriteFileSuccess |
    FileSystemSuccess | FileSystemFailure | ZipDir | ExecProcess |
    CreateModdingDirectories | GetNativePcMap | GetModFolderMap | UnzipFile |
    Init | Exit;
