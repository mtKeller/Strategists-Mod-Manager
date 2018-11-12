import { createFeatureSelector, createSelector} from '@ngrx/store';
import { DownloadManagerState } from './DownloadManager.state';

export const selectDownloadManagerState = createFeatureSelector('DownloadManagerState');

export const selectCurrentFiles = createSelector(
    selectDownloadManagerState,
    (state: DownloadManagerState) => state.currentFiles
);

export const selectReady = createSelector(
    selectDownloadManagerState,
    (state: DownloadManagerState) => state.ready
);
