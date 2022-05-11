import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateWithIncome } from '../ingreso-egreso.reducer';
import { IncomeEgress } from 'src/app/models/income-egress.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  fullIncome = 0;
  fullEgress = 0;

  countIncome = 0;
  countEgress = 0;
  incomeEgressSubcription$: Subscription;

  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [],
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppStateWithIncome>) {}

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
    this.fullIncome = 0;
    this.fullEgress = 0;
    this.countIncome = 0;
    this.countEgress = 0;

    items.forEach(({ type, amount }) => {
      if (type === 'ingreso') {
        this.fullIncome += Number(amount);
        this.countIncome += 1;
      } else if (type === 'egreso') {
        this.fullEgress += +amount;
        this.countEgress += 1;
      }
    });

    this.doughnutChartData.datasets.push({
      data: [this.fullIncome, this.fullEgress],
    });
  }
}
