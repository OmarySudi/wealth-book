import { Injectable } from '@angular/core';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import { DataService } from '../data/data.service';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { StorageService } from '../storage/storage.service';
import { AngularFireList,AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  expensesRef: AngularFireList<ExpenseInterface>;

  constructor(
    private dataservice: DataService,
    private storageservice: StorageService,
    private datetimeservice: DatetimeService,
    private database: AngularFireDatabase
    
    ) { 

      //this.getTodayExpenseFromLocal();
      this.getTodayExpenseFromDatabase();
  }

  // async createExpense(expense: ExpenseInterface): Promise<void>{

  //   return await this.storageservice.saveExpenseToLocalStorage(expense).then().catch();
     
  // }

  async createExpense(expense: ExpenseInterface): Promise<void>{

    // return await this.storageservice.saveExpenseToLocalStorage(expense).then().catch();
    return await this.storageservice.saveExpenseToDatabase(expense).then().catch();
     
  }

  async getTodayExpenseFromLocal(): Promise<any>{
    
    return await this.storageservice.getExpenseFromLocalStorage().then((expenses: any)=>{

      if(expenses != null)
          this.dataservice.setExpenses(expenses.value)
      else
          this.dataservice.setExpenses([])
    })
  }

  async getTodayExpenseFromDatabase(): Promise<any>{
    
    return await this.storageservice.getExpenseFromDatabase().then((expenses)=>{
      // console.log("#######"+expenses);
      // if(expenses != null)
      //     this.dataservice.setExpenses(expenses)
      // else
      //     this.dataservice.setExpenses([])
    })
  }

  async emitExpensesByDateFromLocal(date: Date): Promise<void>{
    return await this.storageservice.getExpenseFromLocalStorage(date).then((expenses: any)=>{

      if(expenses != null)
        return this.dataservice.setExpenses(expenses.value)
      else
        return this.dataservice.setExpenses(null);
    })
  }

  async editExpense(expense: ExpenseInterface, key: string){

    this.storageservice.getFromLocalStorage("WB_userid").then((res)=>{

      let userid =  res.value;
      
      this.expensesRef = this.database.list('users/'+userid+'/'+expense.date);

      if(expense.type == "Income"){
        this.dataservice.setAddedIncome(expense);
      }else {
        this.dataservice.setAddedExpense(expense)
      }

      return this.expensesRef.update(key,expense);

    });

  }

  async deleteItem(expense: ExpenseInterface, key: string){
    this.storageservice.getFromLocalStorage("WB_userid").then((res)=>{

      let userid =  res.value;
      
      this.expensesRef = this.database.list('users/'+userid+'/'+expense.date);

      return this.expensesRef.remove(key);

    });
  }

}
