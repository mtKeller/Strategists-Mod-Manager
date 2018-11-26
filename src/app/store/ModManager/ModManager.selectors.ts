import { createFeatureSelector, createSelector} from '@ngrx/store';
import { ModManagerState } from './ModManager.state';

export const selectModManager = createFeatureSelector('ModManagerState');

export const selectModFolderMap = createSelector(
    selectModManager,
    (state: ModManagerState) => state.modFolderMap
);

export const selectDownloadedModDetail = createSelector(
    selectModManager,
    (state: ModManagerState) => state.downloadedModDetail
);

export const selectModList = createSelector(
    selectModManager,
    (state: ModManagerState) => state.modList
);

export const selectLoadOrder = createSelector(
    selectModManager,
    (state: ModManagerState) => state.loadOrder
);

export const selectProcessingQue = createSelector(
    selectModManager,
    (state: ModManagerState) => state.processingQue
);

export const selectInstallationQue = createSelector(
    selectModManager,
    (state: ModManagerState) => state.installationQue
);

export const selectModProcessing = createSelector(
    selectModManager,
    (state: ModManagerState) => state.modProcessing
);

export const selectModQueController = createSelector(
    selectModManager,
    (state: ModManagerState) => state.modQueController
);

export const selectGalleryOpen = createSelector(
    selectModManager,
    (state: ModManagerState) => state.galleryOpen
);

export const selectGalleryContent = createSelector(
    selectModManager,
    (state: ModManagerState) => state.galleryContent
);
