import { Pipe, PipeTransform } from '@angular/core';
import { IncomeEgress } from '../models/income-egress.model';

@Pipe({
  name: 'orderIncomeEgress',
})
export class OrderIncomeEgressPipe implements PipeTransform {
  transform(items: IncomeEgress[]): IncomeEgress[] {
    return items.sort(({ type }) => {
      if (type === 'ingreso') {
        return -1;
      } else {
        return 1;
      }
    });
  }
}
