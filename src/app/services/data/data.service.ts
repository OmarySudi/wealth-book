import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {ExpenseInterface} from '../../interfaces/expenseinterface'
import {HttpClient} from '@angular/common/http'
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly _expenses: BehaviorSubject<ExpenseInterface[]>;
  private readonly _monthlyExpenses: BehaviorSubject<ExpenseInterface[]>;
  private readonly _expenseTypes: BehaviorSubject<string[]>;
  private readonly _incomeTypes: BehaviorSubject<string[]>;
  private readonly _currencies: BehaviorSubject<{}>;
  public currencyCodes: Observable<string[]>;
  private readonly _expenseCategoryKeys: BehaviorSubject<{}>;
  private readonly todayTotalExpenses: BehaviorSubject<number>;
  private readonly todayTotalReturn: BehaviorSubject<number>;
  private readonly monthlyTotalExpenses: BehaviorSubject<number>;
  private readonly monthlyTotalReturn: BehaviorSubject<number>;
  private readonly _addedExpense: BehaviorSubject<ExpenseInterface>;
  private readonly _addedIncome: BehaviorSubject<ExpenseInterface>;
  private readonly currency: BehaviorSubject<string>;
  private readonly _email: BehaviorSubject<string>;
  private readonly _name: BehaviorSubject<string>;
  private readonly _googleLogged: BehaviorSubject<boolean>;

  constructor(private httpClient: HttpClient) {
    this._expenses = new BehaviorSubject<ExpenseInterface[]>(null);
    this._monthlyExpenses = new BehaviorSubject<ExpenseInterface[]>(null);
    this._expenseTypes = new BehaviorSubject<string[]>(null);
    this._incomeTypes = new BehaviorSubject<string[]>(null);
    this._expenseCategoryKeys =  new BehaviorSubject<{}>(null);
    this._currencies = new BehaviorSubject<{}>(null);
    //this.currencyCodes = this._currencies.asObservable();
    this.todayTotalExpenses = new BehaviorSubject<number>(0);
    this.todayTotalReturn = new BehaviorSubject<number>(0);
    this.monthlyTotalExpenses = new BehaviorSubject<number>(0);
    this.monthlyTotalReturn = new BehaviorSubject<number>(0);
    this._addedExpense = new BehaviorSubject<ExpenseInterface>(null);
    this._addedIncome = new BehaviorSubject<ExpenseInterface>(null);
    this.currency = new BehaviorSubject<string>('');
    this._email = new BehaviorSubject<string>('');
    this._name = new BehaviorSubject<string>('');
    this._googleLogged = new BehaviorSubject<boolean>(false);

   }

  async getExpenses(): Promise<ExpenseInterface[]>{

    return this._expenses.getValue();
  }

  async setExpenses(expenses: ExpenseInterface[]): Promise<void>{

    if(expenses)
      this.setTodayTotalExpenses(this.calculateTodayTotal(expenses))

    return this._expenses.next(expenses);
  }

  async getMonthlyExpenses(): Promise<ExpenseInterface[]>{

    return this._monthlyExpenses.getValue();
  }

  getMonthlyExpensesSubscription(): BehaviorSubject<ExpenseInterface[]>{

    return this._monthlyExpenses;
  }

  async setMonthlyExpenses(expenses: ExpenseInterface[]): Promise<void>{
    return this._monthlyExpenses.next(expenses);
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

      if(expense.category == "Income")
        total+=expense.amount;
    }
    return total;
  }

  getCurrencyCodesFromUrl(){
    return this.httpClient.get("https://openexchangerates.org/api/currencies.json",{responseType:'json'})
    .pipe(
      map(data=>{
        
        return data;
      })
    )
  }

  getEmailSubscription(): BehaviorSubject<string>{

    return this._email;
  }

  async setEmail(email: string): Promise<void>{
    return this._email.next(email);
  }

  async getEmail(): Promise<string>{
    return this._email.getValue();
  }


  getNameSubscription(): BehaviorSubject<string>{
    return this._name;
  }

  async setName(name: string): Promise<void>{
    return this._name.next(name);
  }

  async getName(): Promise<string>{
    return this._name.getValue();
  }

  getIncomeTypesSubscription(): BehaviorSubject<string[]>{

    return this._incomeTypes;
  }

  async setIncomeTypes(incomeTypes: string[]): Promise<void>{

    return this._incomeTypes.next(incomeTypes);
  }

  async getIncomeTypes(): Promise<string[]>{

    return this._incomeTypes.getValue();
  }

  getExpenseTypesSubscription(): BehaviorSubject<string[]>{

    return this._expenseTypes;
  }

  async setExpenseTypes(expenseTypes: string[]): Promise<void>{

    return this._expenseTypes.next(expenseTypes);
  }

  async getExpenseTypes(): Promise<string[]>{

    return this._expenseTypes.getValue();
  }

  getAddedExpenseSubscription(): BehaviorSubject<ExpenseInterface>{

    return this._addedExpense;
  }

  async setAddedExpense(addedExpense: ExpenseInterface): Promise<void>{

    return this._addedExpense.next(addedExpense);
  }

  async getAddedExpense(): Promise<ExpenseInterface>{

    return this._addedExpense.getValue();
  }

  getAddeIncomeSubscription(): BehaviorSubject<ExpenseInterface>{

    return this._addedIncome;
  }

  async setAddedIncome(addedIncome: ExpenseInterface): Promise<void>{

    return this._addedIncome.next(addedIncome);
  }

  async getAddedIncome(): Promise<ExpenseInterface>{

    return this._addedIncome.getValue();
  }

  getExpenseCategoryKeysSubscription(): BehaviorSubject<{}>{

    return this._expenseCategoryKeys;
  }

  async setExpenseCategoryKeys(expenseCategoryKeys: {}): Promise<void>{

    return this._expenseCategoryKeys.next(expenseCategoryKeys);
  }

  async getExpenseCategoryKeys(): Promise<{}>{

    return this._expenseCategoryKeys.getValue();
  }

  getMonthlyTotalExpensesSubscription(): BehaviorSubject<number>{

    return this.monthlyTotalExpenses;
  }

  async getMonthlyTotalExpenses(): Promise<number>{

    return this.monthlyTotalExpenses.getValue();
  }
 
  async setMonthlyTotalExpenses(total: number): Promise<void>{

    return this.monthlyTotalExpenses.next(total);
  }

  getMonthlyTotalReturnsSubscription(): BehaviorSubject<number>{

    return this.monthlyTotalReturn;
  }

  async getMonthlyTotalReturns(): Promise<number>{

    return this.monthlyTotalReturn.getValue();
  }
 
  async setMonthlyTotalRetuns(total: number): Promise<void>{

    return this.monthlyTotalReturn.next(total);
  }

  getGoogleLoggedSubscription(): BehaviorSubject<boolean>{

    return this._googleLogged;
  }

  async getGoogleLogged(): Promise<boolean>{

    return this._googleLogged.getValue();
  }
 
  async setGoogleLogged(logged: boolean): Promise<void>{

    return this._googleLogged.next(logged);
  }


  getCurrencyCodesSubscription(): BehaviorSubject<{}>{

    return this._currencies;
  }

  async getCurrencyCodes(): Promise<{}>{

    return this._currencies.getValue();
  }
 
  async setCurrencyCodes(currencyCodes: {}): Promise<void>{

    return this._currencies.next(currencyCodes);
  }
}
