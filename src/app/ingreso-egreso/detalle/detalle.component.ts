import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IncomeEgressI } from 'src/app/interfaces/incomeEgress.interface';
import { IncomeEgress } from 'src/app/models/income-egress.model';
import { IncomeEgressService } from 'src/app/services/income-egress.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  incomEgressSubcription$: Subscription;
  incomeEgress: Array<IncomeEgress> = [];
  colData: Array<{ type: string; text: string }> = [
    {
      type: 'description',
      text: 'Descripcion',
    },
    {
      type: 'amount',
      text: 'Monto',
    },
    {
      type: 'type',
      text: 'Tipo',
    },
  ];

  constructor(
    private store: Store<AppState>,
    private incomeEgressService: IncomeEgressService
  ) {}

  ngOnInit(): void {
    this.incomEgressSubcription$ = this.store
      .select('incomeEgress')
      .pipe(filter((incomeEgress) => incomeEgress.items.length !== 0))
      .subscribe(({ items }) => {
        this.incomeEgress = [...items];
        console.log(items);
      });
  }

  deleteIncomeEgress(uid:string) {
    this.incomeEgressService
      .deleteIncomeEgress(uid)
      .then(() => {
        Swal.fire('Borrado', 'Item borrado', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', error.message, 'error');
      });

    console.log(uid);
  }

  ngOnDestroy(): void {
    this.incomEgressSubcription$?.unsubscribe();
  }
}
