import { createReducer, on } from '@ngrx/store';
import { IncomeEgress } from '../models/income-egress.model';
import { setItems, unSettItems } from './ingreso-egreso.actions';

export interface State {
  items: IncomeEgress[];
}

export const initialState: State = {
  items: [],
};

const _incomeEgressReducer = createReducer(
  initialState,

  on(setItems, (state, { items }) => ({ ...state, items: [...items] })),
  on(unSettItems, (state) => ({ ...state, items: [] }))
);

export function incomeEgressReducer(state, action) {
  return _incomeEgressReducer(state, action);
}
