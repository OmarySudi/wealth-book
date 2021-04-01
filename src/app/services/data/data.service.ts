import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {ExpenseInterface} from '../../interfaces/expenseinterface'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly _expenses: BehaviorSubject<ExpenseInterface[]>;
  private readonly todayTotalExpenses: BehaviorSubject<number>;
  private readonly todayTotalReturn: BehaviorSubject<number>;
  
  
  constructor() {
    this._expenses = new BehaviorSubject<ExpenseInterface[]>(null);
    this.todayTotalExpenses = new BehaviorSubject<number>(0);
    this.todayTotalReturn = new BehaviorSubject<number>(0);

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

  async setTodayTotalExpenses(total: number): Promise<void>{

    return this.todayTotalExpenses.next(total);
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

  calculateTodayTotal(expenses: ExpenseInterface[]): number{
    let total = 0;

    for(const expense of expenses){

      if(expense.category == "Expense")
        total+=expense.amount;
    }
    return total;
  }


  async setTodayTotalReturns(total: number): Promise<void>{

    return this.todayTotalReturn.next(total);
  }

  async getTodayTotalReturns(): Promise<number>{

    return this.todayTotalReturn.getValue();
  }

  getTodayTotalReturnsSubscription(): BehaviorSubject<number>{

    return this.todayTotalReturn;

  }

  setReturnsTotalAMount(expenses: ExpenseInterface[]){
    if(expenses)
      this.setTodayTotalReturns(this.calculateTodayTotalReturn(expenses))
  }

  calculateTodayTotalReturn(expenses: ExpenseInterface[]): number{
    let total = 0;

    for(const expense of expenses){

      if(expense.category == "Return")
        total+=expense.amount;
    }
    return total;
  }
 
}
