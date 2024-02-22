import { createAction } from '@ngrx/store';

export const ProgressAction = {
  showProgress: '[App] Show Progress',
  hiddenProgress: '[App] Hidden Progress',
  hiddenProgressSuccess: '[App] Hidden Progress Success'
};

export const showProgress = createAction(ProgressAction.showProgress);

export const hiddenProgress = createAction(ProgressAction.hiddenProgress);

export const hiddenProgressSuccess = createAction(ProgressAction.hiddenProgressSuccess);
