import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import * as uiActions from 'src/app/shared/ui.actions';
import { IncomeEgress } from '../models/income-egress.model';
import { IncomeEgressService } from '../services/income-egress.service';
@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  type: string = 'ingreso';
  incomeEgressForm: FormGroup;
  uiSubscription$: Subscription;
  loandingState: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private incomeEgressSErvice: IncomeEgressService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.buildForm();

    this.uiSubscription$ = this.store.select('ui').subscribe((ui) => {
      this.loandingState = ui.isLoanding;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription$?.unsubscribe();
  }

  buildForm(): void {
    this.incomeEgressForm = this.formBuilder.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      uid: [''],
    });
  }

  addIncomeEgress(): void {
    if (this.incomeEgressForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoanding());
    const { description, amount }: IncomeEgress = this.incomeEgressForm.value;
    const incomeEgress = new IncomeEgress(description, this.type, amount);
    this.incomeEgressSErvice
      .createIncomeEgress(incomeEgress)
      .then(() => {
        this.incomeEgressForm.reset();
        this.store.dispatch(uiActions.stopLoanding());
        Swal.fire('Registro creado', description, 'success');
      })
      .catch((err) => {
        this.store.dispatch(uiActions.stopLoanding());
        Swal.fire('Error', err.message, 'error')
      });
  }
}
