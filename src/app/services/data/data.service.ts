import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {ExpenseInterface} from '../../interfaces/expenseinterface'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly _expenses: BehaviorSubject<ExpenseInterface[]>;
  private readonly todayTotalExpenses: BehaviorSubject<number>;
  
  
  constructor() {
    this._expenses = new BehaviorSubject<ExpenseInterface[]>(null);
    this.todayTotalExpenses = new BehaviorSubject<number>(0);

   }

  async getExpenses(): Promise<ExpenseInterface[]>{

    return this._expenses.getValue();
  }


  async setExpenses(expenses: ExpenseInterface[]): Promise<void>{

    if(expenses)
      this.setTodayTotalExpenses(this.calculateTodayTotal(expenses))

    return this._expenses.next(expenses);
  }

  setExpenesTotalAmount(expenses: ExpenseInterface[]){
    if(expenses)
      this.setTodayTotalExpenses(this.calculateTodayTotal(expenses));
  }


  getExpensesSubscription(): BehaviorSubject<ExpenseInterface[]>{

    return this._expenses;
  }


  getTodayTotalExpensesSubscription(): BehaviorSubject<number>{

    return this.todayTotalExpenses;
  }

  async getTodayTotalExpenses(): Promise<number>{

    return this.todayTotalExpenses.getValue();
  }

  async setTodayTotalExpenses(total: number): Promise<void>{

    return this.todayTotalExpenses.next(total);
  }


  calculateTodayTotal(expenses: ExpenseInterface[]): number{
    let total = 0;

    for(const expense of expenses){

      total+=expense.amount;
    }
    return total;
  }
 
}
