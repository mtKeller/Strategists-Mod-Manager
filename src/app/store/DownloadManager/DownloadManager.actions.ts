import { Action } from '@ngrx/store';
import { ActionTree } from '../../model/ActionTree.class';

export const INIT_DOWNLOAD_MANAGER = '[DownloadManager] INIT_DOWNLOAD_MANAGER';

export class InitDownloadManager implements Action {
    readonly type = INIT_DOWNLOAD_MANAGER;
    constructor(public chain: ActionTree = null) { }
}

export const ADD_DOWNLOAD_ITEM = '[DownloadManager] ADD_DOWNLOAD_ITEM';

export class AddDownloadItem implements Action {
    readonly type = ADD_DOWNLOAD_ITEM;
    constructor(public payload: any) { }
}

export const UPDATE_DOWNLOAD_ITEM_PROGRESS = '[DownloadManager] UPDATE_DOWNLOAD_ITEM_PROGRESS';

export class UpdateDownloadItemProgress implements Action {
    readonly type = UPDATE_DOWNLOAD_ITEM_PROGRESS;
    constructor(public payload: any) { }
}

export const COMPLETE_DOWNLOAD_ITEM = '[DownloadManager] COMPLETE_DOWNLOAD_ITEM';

export class CompleteDownloadItem implements Action {
    readonly type = COMPLETE_DOWNLOAD_ITEM;
    constructor(public payload: any) { }
}

export const REMOVE_DOWNLOAD_ITEM = '[DownloadManager] REMOVE_DOWNLOAD_ITEM';

export class RemoveDownloadItem implements Action {
    readonly type = REMOVE_DOWNLOAD_ITEM;
    constructor(public payload: any) { }
}

export type All = InitDownloadManager | AddDownloadItem | UpdateDownloadItemProgress | RemoveDownloadItem | CompleteDownloadItem;
