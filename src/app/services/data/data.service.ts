import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {ExpenseInterface} from '../../interfaces/expenseinterface'
import {HttpClient} from '@angular/common/http'
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly _expenses: BehaviorSubject<ExpenseInterface[]>;
  private readonly todayTotalExpenses: BehaviorSubject<number>;
  private readonly todayTotalReturn: BehaviorSubject<number>;
  private readonly currency: BehaviorSubject<string>;

  constructor(private httpClient: HttpClient) {
    this._expenses = new BehaviorSubject<ExpenseInterface[]>(null);
    this.todayTotalExpenses = new BehaviorSubject<number>(0);
    this.todayTotalReturn = new BehaviorSubject<number>(0);
    this.currency = new BehaviorSubject<string>('');

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

  getCurrencySubscription(): BehaviorSubject<string>{

    return this.currency;
  }

  async setCurrency(currency: string): Promise<void>{
    return this.currency.next(currency);
  }

  async getCurrency(): Promise<string>{
    return this.currency.getValue();
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

  getExpensesSubscription(): BehaviorSubject<ExpenseInterface[]>{

    return this._expenses;
  }

  
  calculateTodayTotalReturn(expenses: ExpenseInterface[]): number{
    let total = 0;

    for(const expense of expenses){

      if(expense.category == "Return")
        total+=expense.amount;
    }
    return total;
  }

  getCurrencyCodes(){
    return this.httpClient.get("https://openexchangerates.org/api/currencies.json",{responseType:'json'})
    .pipe(
      map(data=>{
        return data;
      })
    )
  }
 
}
