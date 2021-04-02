import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseInterface } from '../interfaces/expenseinterface';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(value: ExpenseInterface[], category: string): any {

    if(category === "All" || category === undefined)
      return value
    else
      return value.filter(val=> val.category == category)
  }

}
