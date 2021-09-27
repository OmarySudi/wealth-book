import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import { AngularFireDatabase,AngularFireList} from '@angular/fire/database';
import { DataService } from '../data/data.service';
import { DatetimeService } from '../datetime/datetime.service';
import { LodashService } from '../lodash/lodash.service';
import { Observable } from 'rxjs';

import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private datetimeservice: DatetimeService,
    private dataservice: DataService,
    private database: AngularFireDatabase,
    private lodash: LodashService,
    ) { 
      this.expenses = [];
    }

  expensesRef: AngularFireList<ExpenseInterface>;

  expenses?: ExpenseInterface[];
 
  async saveToLocalStorage(key:string,value:any): Promise<void> {
    return await Plugins.Storage.set({
      key,
      value: JSON.stringify({value})
    });
  }

  
  async saveExpenseToDatabase(expense: ExpenseInterface): Promise<void>{

    return this.getFromLocalStorage("WB_userid").then((res)=>{
      
      let date = this.datetimeservice.getDateIso(expense.createdOn).substring(0,10).split('-').join('/');

      expense.date = date;

      let userid =  res.value;
      
      this.expensesRef = this.database.list('users/'+userid+'/'+date);

      console.log(this.expensesRef);

      this.expensesRef.push(expense)

    })//.then(()=>{
    //   if(expense.category == "Expense"){
    //     this.dataservice.setAddedExpense(expense)
    //   }else{
    //     this.dataservice.setAddedIncome(expense)
    //   }
    // });
  }

  async saveExpenseToLocalStorage(expense: ExpenseInterface): Promise<void>{

    //let key = this.datetimeservice.getDateIso();
    let key = this.datetimeservice.getDateIso(expense.createdOn);
    let expenseList: ExpenseInterface[] = [];

    return this.getFromLocalStorage(key).then((expenses: any)=>{
      if(expenses == null)
      {
        expenseList.push(expense);

      }else {

        expenseList = expenses.value;
      
        expenseList.push(expense);

        console.log(expenseList);
      }
    }).then(()=>{

        this.saveToLocalStorage(key,expenseList).then(()=>{
          this.dataservice.setExpenses(expenseList);
        });


    }).catch((error)=>{console.log(error)});
  }

 async getExpenseFromLocalStorage(date?: Date){

    let key = date ? this.datetimeservice.getDateIso(date): this.datetimeservice.getDateIso();
    return await this.getFromLocalStorage(key).then((expenses: any)=>{
      return expenses;
    })
  }

  async getExpenseFromDatabase(date?: Date){

    let userid = "";
    let fetchedDate = "";

    return await this.getFromLocalStorage("WB_userid").then((res)=>{

      userid = res.value;
      
      fetchedDate = date ? this.datetimeservice.getDateIso(date).substr(0,10).split('-').join('/'): this.datetimeservice.getDateIso(date).substr(0,10).split('-').join('/');

      console.log("today date "+fetchedDate)

      this.expensesRef = this.database.list('users/'+userid+'/'+fetchedDate);

      return this.expensesRef.snapshotChanges();

    });
  }


  getExpenses(): ExpenseInterface[]{
    return this.expenses;
  }

  async getFromLocalStorage(key:string): Promise<any> {
    const ret = await Plugins.Storage.get({ key});
    
    return JSON.parse(ret.value);
  }

  async removeFromLocalStorage(key:string): Promise<void> {
   return await Plugins.Storage.remove({ key});
  }

  async clearLocalStorage(isReset?: Boolean): Promise<void> {

    if(isReset)
      this.dataservice.setExpenses(null);

    return await Plugins.Storage.clear();
  }
}
