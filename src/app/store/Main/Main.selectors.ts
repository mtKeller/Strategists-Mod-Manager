import { createFeatureSelector, createSelector} from '@ngrx/store';
import { MainState } from './Main.state';

export const selectMainState = createFeatureSelector('MainState');

export const selectMhwDirectoryPath = createSelector(
    selectMainState,
    (state: MainState) => state.mhwDirectoryPath
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
