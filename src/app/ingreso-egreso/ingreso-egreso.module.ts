import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DetalleComponent } from './detalle/detalle.component';
import { IngresoEgresoComponent } from './ingreso-egreso.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { OrderIncomeEgressPipe } from '../pipes/order-income-egress.pipe';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { DashboardRoutesModule } from '../dashboard/dashboard-routes.module';
import { StoreModule } from '@ngrx/store';
import { incomeEgressReducer } from './ingreso-egreso.reducer';

@NgModule({
  declarations: [
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    OrderIncomeEgressPipe,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('incomeEgress', incomeEgressReducer),
    ReactiveFormsModule,
    NgChartsModule,
    SharedModule,
    DashboardRoutesModule,
  ],
})
export class IngresoEgresoModule {}
