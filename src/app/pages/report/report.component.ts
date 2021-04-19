import { Component, OnInit,NgZone } from '@angular/core';
import {Months} from 'src/app/constants/constants'
import { map} from 'rxjs/operators';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { AngularFireDatabase,AngularFireList} from '@angular/fire/database';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ModalController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { MonthlyExpensesComponent } from 'src/app/shared/components/monthly-expenses/monthly-expenses.component';
import { ExpenseChartComponent } from 'src/app/shared/expense-chart/expense-chart.component';
import { IncomeChartComponent } from 'src/app/shared/income-chart/income-chart.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  months = Months;
  monthKeys = [];
  years = [];

  expenseCategoriesMap;
  expenseCategoriesKeys = [];
  expenseCategories = {}
  totalMonthlyExpense: number;

  returnCategoriesMap;
  returnCategoriesKeys = [];
  returnCategories = {}
  totalMonthlyReturn: number;

  expenses: ExpenseInterface[] = [];

  filteredExpenses: ExpenseInterface[] = [];

  expensesRef: AngularFireList<ExpenseInterface>;

  currentMonth: string;
  currentYear: string;
  loader: boolean;

  monthly: boolean;
  annually: boolean;
  title: string;

  constructor(
    private datetimeservice: DatetimeService,
    private storage: StorageService,
    private database: AngularFireDatabase,
    private loadingController: LoadingController,
    private modalController: ModalController) { 

    this.title = "Monthly"

    this.monthly = true;

    this.getMonthlyReport();
  
    this.getListOfYears();

    this.monthKeys = Object.keys(this.months)
  }

  
  getMonthlyReport(year?: string, month?: string){

    this.loader = true;
    let userid = "";
    let fetchedMonth = "";
   
    if(year){

      fetchedMonth = year.concat("/"+this.months[month]);

    }else{
      this.setCurrentMonth();

      this.setCurrentYear();

      fetchedMonth = this.currentYear.concat("/"+this.months[this.currentMonth]);

    }

    this.storage.getFromLocalStorage("WB_userid").then((res)=>{

      userid = res.value;

      //fetchedMonth = month? year.concat("/"+month):'';

      console.log("fetchedMonth "+fetchedMonth);

      this.expensesRef = this.database.list('users/'+userid+'/'+fetchedMonth);
      
      this.expensesRef.snapshotChanges().pipe(

      map(changes=> changes.map(c=> c.payload.val())),
        
      ).subscribe(data => {

        this.expenseCategoriesMap = new Map();
        this.returnCategoriesMap = new Map();
        this.totalMonthlyExpense = 0;
        this.totalMonthlyReturn = 0;

      
        this.expenses = [];

        data.forEach(data=>{
         
          Object.keys(data).map((key)=>{

            let expenseinterface: ExpenseInterface;

            expenseinterface = data[key];

            this.expenses.unshift(expenseinterface);

            if(expenseinterface.category == "Expense"){
               this.totalMonthlyExpense+=expenseinterface.amount;
              if(this.expenseCategoriesMap.has(expenseinterface.type))
              {
                let amount  = this.expenseCategoriesMap.get(expenseinterface.type)
                amount+=expenseinterface.amount;
                this.expenseCategoriesMap.set(expenseinterface.type,amount);

              }else{
                this.expenseCategoriesMap.set(expenseinterface.type,expenseinterface.amount) 
              }

            }else if(expenseinterface.category == "Income"){
              this.totalMonthlyReturn+=expenseinterface.amount;
              if(this.returnCategoriesMap.has(expenseinterface.type))
              {
                let amount  = this.returnCategoriesMap.get(expenseinterface.type)
                amount+=expenseinterface.amount;
                this.returnCategoriesMap.set(expenseinterface.type,amount);

              }else{
                this.returnCategoriesMap.set(expenseinterface.type,expenseinterface.amount) 
              }
            }
            
          })
        })

        this.loader = false;

        this.setExpenseCategories(this.expenseCategoriesMap);
        
        this.setReturnCategories(this.returnCategoriesMap);
 
      });
  
    })
  }

  getAnuallyReport(year?: string){

    this.loader = true;
    //this.presentLoading();

    let userid = "";
    let fetchedYear = "";

    if(year){
      fetchedYear = year;
    }else{
      this.setCurrentYear();
      fetchedYear = this.currentYear;
    }

    this.storage.getFromLocalStorage("WB_userid").then((res)=>{

      userid = res.value;

      this.expensesRef = this.database.list('users/'+userid+'/'+fetchedYear);
      
      this.expensesRef.snapshotChanges().pipe(
      
      map((changes)=> {

        let object = [];

        changes.map((c)=> {
          object.push(c.payload.val())
        })
      
        return object;
      })
      ).subscribe(data => {
    
        this.expenseCategoriesMap = new Map();
        this.returnCategoriesMap = new Map();
        this.totalMonthlyExpense = 0;
        this.totalMonthlyReturn = 0;

        this.expenses = [];

        for(let test of data){

          Object.keys(test).map((key)=>{

            let test2 = test[key];

            Object.keys(test2).map((key)=>{

              let expenseinterface: ExpenseInterface;

              expenseinterface = test2[key];

              this.expenses.unshift(expenseinterface);

              if(expenseinterface.category == "Expense"){
                
                this.totalMonthlyExpense+=expenseinterface.amount;
                if(this.expenseCategoriesMap.has(expenseinterface.type))
                {
                  let amount  = this.expenseCategoriesMap.get(expenseinterface.type)
                  amount+=expenseinterface.amount;
                  this.expenseCategoriesMap.set(expenseinterface.type,amount);
  
                }else{
                  this.expenseCategoriesMap.set(expenseinterface.type,expenseinterface.amount) 
                }
  
              }else if(expenseinterface.category == "Income"){
                this.totalMonthlyReturn+=expenseinterface.amount;
                if(this.returnCategoriesMap.has(expenseinterface.type))
                {
                  let amount  = this.returnCategoriesMap.get(expenseinterface.type)
                  amount+=expenseinterface.amount;
                  this.returnCategoriesMap.set(expenseinterface.type,amount);
  
                }else{
                  this.returnCategoriesMap.set(expenseinterface.type,expenseinterface.amount) 
                }
              }
              
            })
          })
        }


        this.loader = false;
        //this.loadingController.dismiss();

        this.setExpenseCategories(this.expenseCategoriesMap);
        
        this.setReturnCategories(this.returnCategoriesMap);

      });
  
    })
  }

  
  ngOnInit() {
    
  }

  onClickDate(){

  }

  changeSelectedMonth(month:string){
    this.getMonthlyReport(this.currentYear,this.currentMonth);
  }

  changeSelectedYear(year:string){

    if(this.monthly)
      this.getMonthlyReport(this.currentYear,this.currentMonth);
    else if(this.annually)
    {
      console.log("annually");
      
      this.getAnuallyReport(this.currentYear)
    }
      
  }

  setExpenseCategories(expenseCategoriesMap: Iterable<unknown> | ArrayLike<unknown>){
    let obj = Array.from(expenseCategoriesMap).reduce((obj, [key, value]) => (
      Object.assign(obj, { [key]: value }) // Be careful! Maps can have non-String keys; object literals can't.
    ), {});

    this.expenseCategories = obj;
    this.expenseCategoriesKeys = Object.keys(obj)
  }

  setReturnCategories(returnCategoriesMap: Iterable<unknown> | ArrayLike<unknown>){
    let obj = Array.from(returnCategoriesMap).reduce((obj, [key, value]) => (
      Object.assign(obj, { [key]: value }) // Be careful! Maps can have non-String keys; object literals can't.
    ), {});

    this.returnCategories = obj;
    this.returnCategoriesKeys = Object.keys(obj)
  }

  setCurrentMonth(){
    this.currentMonth = this.datetimeservice.getCurrentMonth();
  }

  setCurrentYear(){
    this.currentYear = this.datetimeservice.getCurrentYear();
  }

  getListOfYears(){
    let min = 2020
    let max = Number(this.datetimeservice.getCurrentYear());
   
    for (let i = min; i<=max; i++){
      this.years.push(i);
    }
  }

  async openExpensesDialog(type: string,total:number){

    this.filterArray(type);

    const modal = await this.modalController.create({
      component: MonthlyExpensesComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'expenses': this.filteredExpenses,
        'type': type,
        'total': total,
      }
    });
    return await modal.present();
  }

  async viewExpenseChart(expenseCategoriesKeys: any[],expenseCategories: {}){
    const modal = await this.modalController.create({
      component: ExpenseChartComponent,
      componentProps: {
        'expenseCategoriesKeys': expenseCategoriesKeys,
        'expenseCategories': expenseCategories,
        'title': this.title,
        'currentMonth': this.currentMonth,
        'currentYear': this.currentYear,
      }
    })

    return await modal.present();
  }

  async viewReturnChart(returnCategoriesKeys: any[],returnCategories: {}){
    const modal = await this.modalController.create({
      component: IncomeChartComponent,
      componentProps: {
        'returnCategoriesKeys': returnCategoriesKeys,
        'returnCategories': returnCategories,
        'title': this.title,
        'currentMonth': this.currentMonth,
        'currentYear': this.currentYear,
      }
    })

    return await modal.present();
  }

  filterArray(type: string): void{

    this.filteredExpenses = this.expenses.filter(expense=>expense.type == type)

  }

  changeTitle(title: string): void{

    if(title == "Monthly"){
        this.annually = false;
        this.monthly = true;
        this.getMonthlyReport();
    }
    else if(title == "Annually"){

        this.monthly = false;
        this.annually = true;
        this.getAnuallyReport();
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}


