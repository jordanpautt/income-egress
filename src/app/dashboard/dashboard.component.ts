import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IncomeEgressService } from '../services/income-egress.service';
import * as actionIncomeEgress from '../ingreso-egreso/ingreso-egreso.actions';
import { IncomeEgress } from '../models/income-egress.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubcription$: Subscription;
  incomeEgressSubcription$: Subscription;

  constructor(
    private store: Store<AppState>,
    private icomeEgressService: IncomeEgressService
  ) {}

  ngOnInit(): void {
    this.userSubcription$ = this.store
      .select('user')
      .pipe(filter((auth) => auth.user !== null))
      .subscribe(({ user }) => {
        this.incomeEgressSubcription$ = this.icomeEgressService
          .initIncomeEgressListener(user.uid)
          .subscribe((incomeEgress) => {
            this.store.dispatch(
              actionIncomeEgress.setItems({ items: incomeEgress })
            );
          });
      });
  }

  ngOnDestroy(): void {
    this.userSubcription$?.unsubscribe();
    this.incomeEgressSubcription$?.unsubscribe();
  }
}
