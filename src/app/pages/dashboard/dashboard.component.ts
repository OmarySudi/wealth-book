import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { SubscriptionLike } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase,AngularFireList} from '@angular/fire/database';
import { ExpenseTypes } from 'src/app/constants/constants';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import { DataService } from 'src/app/services/data/data.service';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddExpenseComponent } from 'src/app/shared/components/add-expense/add-expense.component';
import { EditExpenseComponent } from 'src/app/shared/components/edit-expense/edit-expense.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit,OnDestroy{

  expenses?: ExpenseInterface[];
  expensesRef: AngularFireList<ExpenseInterface>;
  subscription: SubscriptionLike;
  dateSubscription: SubscriptionLike;
  todayTotalExpensesSubscription: SubscriptionLike;
  todayTotalExpenses: number;
  todayDate: Date;
  installDate: Date;
  selectedDate: Date;
  expenseTypes: any;


  filterPrice: boolean;
  filterPriceUp: boolean;

  constructor(
    private modalController:ModalController,
    private dataservice: DataService,
    private database: AngularFireDatabase,
    private datetimeservice: DatetimeService,
    private storage: StorageService,
    private actionSheetController: ActionSheetController
    ) 
    
    {
    
    //this.expenses = [];

    // this.actionservice.getTodayExpenseFromDatabase().then((userid:any)=>{
    //   // if(expenses != null)
    //   // {
    //   //   console.log("expenses not null");
        
    //   //   this.expenses = expenses;
    //   //   console.log(expenses);
    //   // }else
    //   //   console.log("expenses are null");
        
    //      console.log("$$$$$$$$$$"+userid);
          
    // });
    this.getAllExpenses();

    this.todayDate = this.datetimeservice.getCurrentDateTime();
    this.installDate = this.datetimeservice.installDate;
    this.expenseTypes = ExpenseTypes;
    //this.storage.saveExpenseToDatabase();
   
  }

  ngOnInit() {

    this.dateSubscription = this.datetimeservice.getSelectedDateSubscription()
      .subscribe({
        next: (date: Date)=>{ 
          this.selectedDate = date;
        },
        error: (error)=>{console.log(error)},
        complete: ()=>{}
      });


    this.todayTotalExpensesSubscription = this.dataservice.getTodayTotalExpensesSubscription()
      .subscribe({
        next: (total: number)=>{
          this.todayTotalExpenses = total;
        },
        error: (error)=>{console.log(error)},
        complete: ()=>{}
      });
   
    this.subscription = this.dataservice.getExpensesSubscription()
      .subscribe({
        next: (expenses: ExpenseInterface[])=>{

          if(expenses != null){

            this.expenses = expenses

          } else {
            
            this.expenses = [];
          }
        
        },
        error: (error)=>{console.log(error)},
        complete: ()=>{}
      }
      );

      
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddExpenseComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async presentEditModal(expense: any) {
    const modal = await this.modalController.create({
      component: EditExpenseComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'amount': expense.amount,
        'description': expense.description,
        'type': expense.type,
        'key': expense.key,
        'date': expense.date,
      }
    });
    return await modal.present();
  }


 ngOnDestroy(): void{

 }

//  changeSelectedDate(value): void{
//   this.selectedDate = this.datetimeservice.createDateFromString(value);
//   this.datetimeservice.setSelectedDate(value).then(()=>{

//     this.actionservice.emitExpensesByDateFromLocal(this.selectedDate);

//   });
//  }

changeSelectedDate(value): void{
  this.selectedDate = this.datetimeservice.createDateFromString(value);
  this.datetimeservice.setSelectedDate(value).then(()=>{
    this.getAllExpenses(this.selectedDate);
  });
 }

//  setCurrentToTodayDate(): void{
//   this.datetimeservice.setSelectedDate(this.datetimeservice.getCurrentDateTime()).then(()=>{

//     this.actionservice.emitExpensesByDateFromLocal(this.selectedDate);
//   });
//  }

setCurrentToTodayDate(): void{
  this.datetimeservice.setSelectedDate(this.datetimeservice.getCurrentDateTime()).then(()=>{
  this.getAllExpenses(this.selectedDate)
  });
 }

 priceFilter(): void{

  this.expenses = this.expenses.sort((a,b)=>{

    if(a.amount > b.amount) return this.filterPriceUp ? 1: -1;

    if(b.amount > a.amount) return this.filterPriceUp? -1: 1;
  })

  this.filterPrice = true;
  this.filterPriceUp = !this.filterPriceUp;
  
 }

 get _selectedDate(){
  return this.selectedDate;
 }

 async presentFilterActionSheet() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Albums',
    cssClass: 'my-custom-class',
    buttons: [
    {
      text: 'Price',
      icon: 'logo-usd',
      handler: () => {
        console.log('Share clicked');
      }
    }, {
      text: 'Recent',
      icon: 'caret-forward-circle',
      handler: () => {
        console.log('Play clicked');
      }
    }, 
    {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }]
  });
  await actionSheet.present();
}

getAllExpenses(date?: Date){

  let userid = "";
  let fetchedDate = "";

  this.storage.getFromLocalStorage("userid").then((res)=>{

    userid = res.value;
    
    fetchedDate = date ? this.datetimeservice.getDateIso(date).substr(0,10): this.datetimeservice.getDateIso().substr(0,10);

    this.expensesRef = this.database.list('users/'+userid+'/'+fetchedDate);

    this.expensesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {

      if(data){

        console.log(data);
        this.expenses = data;
        this.dataservice.setExpenesTotalAmount(data);

      }else{

        this.expenses = [];
        this.dataservice.setExpenesTotalAmount([]);
      }
     
    });

  });
}

}
