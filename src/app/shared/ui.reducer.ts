import { createReducer, on } from '@ngrx/store';
import { isLoanding, stopLoanding } from './ui.actions';

export interface State {
  isLoanding: boolean;
}

export const initialState: State = {
  isLoanding: false,
};

const _uiReducer = createReducer(
  initialState,

  on(isLoanding, (state) => ({ ...state, isLoanding: true })),
  on(stopLoanding, (state) => ({ ...state, isLoanding: false }))
);

export function uiReducer(state, action) {
  return _uiReducer(state, action);
}
