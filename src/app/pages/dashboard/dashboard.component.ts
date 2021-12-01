import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController,AlertController } from '@ionic/angular';
import { SubscriptionLike } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase,AngularFireList, AngularFireObject} from '@angular/fire/database';
import { ExpenseTypes } from 'src/app/constants/constants';
import {HttpClient} from '@angular/common/http'
import { CreditTypes } from 'src/app/constants/constants'
import { Category } from 'src/app/constants/constants'
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import { DataService } from 'src/app/services/data/data.service';
import { ActionService } from 'src/app/services/action/action.service';
import {NotificationService} from 'src/app/services/notification/notification.service'
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddExpenseComponent } from 'src/app/shared/components/add-expense/add-expense.component';
import { EditExpenseComponent } from 'src/app/shared/components/edit-expense/edit-expense.component';
import { Setting } from 'src/app/interfaces/setting';
import { LodashService } from 'src/app/services/lodash/lodash.service';
import { ChangeCurrencyComponent } from 'src/app/shared/components/change-currency/change-currency.component';

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
  currencySubscription: SubscriptionLike;
  todayTotalExpensesSubscription: SubscriptionLike;
  todayTotalReturnsSubscription: SubscriptionLike;
  creditTypeSubscription: SubscriptionLike;
  expenseTypeSubscription: SubscriptionLike;
  todayTotalReturns: number;
  todayTotalExpenses: number;
  todayDate: Date;
  installDate: Date;
  selectedDate: Date;
  // expenseTypes: any;
  expenseTypes = ExpenseTypes;
  creditTypes = CreditTypes;
  
  category = Category;
  categoryKeys = [];
  
  currency: string = "";

  filterPrice: boolean;
  filterPriceUp: boolean;
  loader: boolean;

  setting: Setting;
  settingRef: AngularFireObject<Setting>;

  creditTypesArray: string[]
  expenseTypesArray: string[]

  constructor(
    private modalController:ModalController,
    private alertController: AlertController,
    private dataservice: DataService,
    private httpClient: HttpClient,
    private actionService: ActionService,
    private notification: NotificationService,
    private database: AngularFireDatabase,
    private datetimeservice: DatetimeService,
    private storage: StorageService,
    private actionSheetController: ActionSheetController,
    private lodash: LodashService,
    ) 
    
    {
    
    this.setCurrency();

    this.setExpenseTypesArray()

    this.getAllExpenses();

    this.todayDate = 
    this.datetimeservice.getCurrentDateTime();
    this.installDate = this.datetimeservice.installDate;
    // this.expenseTypes = ExpenseTypes;
    //this.storage.saveExpenseToDatabase();
    // this.expenseTypesKeys = Object.keys(this.expenseTypes);
    // this.creditTypesKeys = Object.keys(this.creditTypes)
    this.categoryKeys = Object.keys(this.category);
   
  }

  ngOnInit() {

    
    this.setExpenseTypesArray()

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

      this.currencySubscription = this.dataservice.getCurrencySubscription()
      .subscribe({
        next: (currency: string)=>{
          this.currency = currency;
        },
        error: (error)=>{console.log(error)},
        complete: ()=>{}
      });

    this.todayTotalReturnsSubscription = this.dataservice.getTodayTotalReturnsSubscription()
    .subscribe({
      next: (total: number)=>{
        this.todayTotalReturns = total;
      },
      error: (error)=>{console.log(error);
      },
      complete: ()=>{}
    })

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


    this.expenseTypeSubscription = this.dataservice.getExpenseTypesSubscription().
      subscribe({
        next:((expense: string[])=>{
          this.expenseTypesArray = expense;
        }),
        error: (()=>{

        }),

        complete: (()=>{

        })

      });

    this.creditTypeSubscription = this.dataservice.getIncomeTypesSubscription().
      subscribe({
        next:((income: string[])=>{
          this.creditTypesArray = income;
        }),
        error: (()=>{

        }),

        complete: (()=>{

        })

      });
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
        'category': expense.category,
      }
    });
    return await modal.present();
  }


  async presentDeleteAlert(expense: any){
    const alert = await this.alertController.create({
      cssClass: 'delete-item-alert',
      header: 'Dou you want to delete?',
      //message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'YES',
          handler: () => {
            console.log('Confirm Okay');
              this.actionService.deleteItem(expense,expense.key).then(()=>{
                this.notification.presentToast("Successfully deleted","success");
              }).catch(()=>{
                this.notification.presentToast("There is a problem occured, please try again later","danger");
              });
          }
        }
      ]
    });

    await alert.present();
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

 async changeCurrency(){
  const modal = await this.modalController.create({
    component: ChangeCurrencyComponent,
    cssClass: 'my-custom-class',
    componentProps: {
      'currency': this.currency,
    }
  });
  return await modal.present();
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
 
  this.loader = true;

  let userid = "";
  let fetchedDate = "";

  this.storage.getFromLocalStorage("WB_userid").then((res)=>{

    userid = res.value;
    
    fetchedDate = date ? this.datetimeservice.getDateIso(date).substr(0,10).split('-').join('/'): this.datetimeservice.getDateIso(date).substr(0,10).split('-').join('/');
    
    this.expensesRef = this.database.list('users/'+userid+'/'+fetchedDate);

    this.expensesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {

      if(data){

      
        this.loader = false;
        this.expenses = data;
        this.dataservice.setExpenesTotalAmount(data);
        this.dataservice.setReturnsTotalAMount(data);

      }else{

        this.loader = false;
        this.expenses = [];
        this.dataservice.setExpenesTotalAmount([]);
      }
     
    });

  });
}

  setCurrency(){
    this.storage.getFromLocalStorage("WB_currency").then((res)=>{
      if(this.lodash.isNull(res))
        this.currency = "USD"
      else
        this.currency = res.value;
    });
  }

  setExpenseTypesArray(): void{
      this.storage.getFromLocalStorage("WB_userid").then((res)=>{

        let userid = res.value;
        let userSetting: Setting;
        
        this.settingRef = this.database.object('settings/'+userid);
        this.settingRef.query.get().then((snapshot)=>{

          if(!this.lodash.isNull(snapshot.val())){
            userSetting = snapshot.val();
            
            this.creditTypesArray = Object.keys(this.creditTypes)
            this.expenseTypesArray = Object.keys(this.expenseTypes)
            
            userSetting.incomeTypes.forEach((data)=>{
              if(data !== '')
                this.creditTypesArray.push(data);
            })
            this.expenseTypesArray = Object.keys(this.expenseTypes)
            userSetting.expenseTypes.forEach((data)=>{
              if(data !== '')
                this.expenseTypesArray.push(data);
            })

          }else{
            this.creditTypesArray = Object.keys(this.creditTypes);
            this.expenseTypesArray = Object.keys(this.expenseTypes);
          }

        })
    });
  }

}

