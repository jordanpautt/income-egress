import { createAction, props } from '@ngrx/store';
import { IncomeEgress } from '../models/income-egress.model';

export const setItems = createAction(
  '[IngresoEgreso] setItems',
  props<{ items: IncomeEgress[] }>()
);

export const unSettItems = createAction(
  '[IngresoEgreso] unSet Items',
);
