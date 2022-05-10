import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IncomeEgress } from 'src/app/models/income-egress.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  fullIncome: number = 0;
  fullEgress: number = 0;

  countIncome: number = 0;
  countEgress: number = 0;
  incomeEgressSubcription$: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.incomeEgressSubcription$ = this.store
      .select('incomeEgress')
      .pipe(filter(({ items }) => items.length !== 0))
      .subscribe(({ items }) => this.generateStatistics(items));
  }

  ngOnDestroy(): void {
    this.incomeEgressSubcription$?.unsubscribe();
  }

  generateStatistics(items: Array<IncomeEgress>) {
    items.forEach(({ type, amount }) => {
      if (type === 'ingreso') {
        this.fullIncome += Number(amount);
        this.countIncome += 1;
      } else if (type === 'egreso') {
        this.fullEgress += +amount;
        this.countEgress += 1;
      }
    });
  }
}
