import { createFeatureSelector, createSelector} from '@ngrx/store';
import { MainState } from './Main.state';

export const selectMainState = createFeatureSelector('MainState');

export const selectMhwDirectoryPath = createSelector(
    selectMainState,
    (state: MainState) => state.mhwDirectoryPath
);

export const selectMhwDirectoryMap = createSelector(
    selectMainState,
    (state: MainState) => state.mhwDirectoryMap
);

export const selectAppState = state => state;

export const selectWatchingMhwDirectory = createSelector(
    selectMainState,
    (state: MainState) => state.watchingMhwDir
);

export const selectIpcActive = createSelector(
    selectMainState,
    (state: MainState) => state.ipcActive
);

export const selectReady = createSelector(
    selectMainState,
    (state: MainState) => state.ready
);

export const selectHaltedAction = createSelector(
    selectMainState,
    (state: MainState) => state.haltedAction
);

