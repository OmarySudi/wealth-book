import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { ActionService } from 'src/app/services/action/action.service';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { ExpenseTypes } from 'src/app/constants/constants';
import { Category } from 'src/app/constants/constants';
import { Setting } from 'src/app/interfaces/setting';
import { CreditTypes } from 'src/app/constants/constants';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import {NotificationService} from 'src/app/services/notification/notification.service'
import { StorageService } from 'src/app/services/storage/storage.service';
import {LodashService} from 'src/app/services/lodash/lodash.service'
import {DataService} from 'src/app/services/data/data.service'
import { SubscriptionLike } from 'rxjs';


@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit {

  addExpenseForm = new FormGroup({
    amount: new FormControl('',Validators.required),
    description: new FormControl(''),
    type: new FormControl('',Validators.required),
    category: new FormControl('',Validators.required),
  });

  expenseTypes: any;
  expenseTypesArray: string[];
  creditTypes: any;
  creditTypesArray: string[];
  category: any;
  isExpense: boolean;
  isReturn: boolean;
  checkboxChecked: boolean;
  settingref: AngularFireObject<Setting>
  setting: Setting;

  creditTypeSubscription: SubscriptionLike;
  expenseTypeSubscription: SubscriptionLike;

  defaultSetting: Setting = {
    currency: 'USD',
    incomeTypes:[],
    expenseTypes:[]
  }

  constructor(
    private modalController:ModalController,
    private actionservice: ActionService,
    private datetimeservice: DatetimeService,
    private notification: NotificationService,
    private storage: StorageService,
    private database: AngularFireDatabase,
    private dataservice: DataService,
    private lodash: LodashService,
    ) { 
    
      this.expenseTypes = ExpenseTypes;
      this.category = Category;
      this.creditTypes = CreditTypes;
      this.isExpense = false;
      this.isReturn = false;

      this.setExpenseTypesArray();

      // console.log(Object.keys(this.creditTypes))
      // this.expenseTypesArray = Object.keys(this.expenseTypes);
     
  }

 
  ngOnInit() {

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

  initCreateExpense(){
    const expense: ExpenseInterface = this.addExpenseForm.value;
    expense.amount = Number(expense.amount.toFixed(2));

    this.datetimeservice.getSelectedDate().then((date: Date)=>{

      expense.createdOn = date;
      console.log(expense.createdOn);

      if(!expense.createdOn)
        expense.createdOn = this.datetimeservice.getCurrentDateTime();

    }).then(()=>{

      // this.actionservice.createExpense(expense).then(()=>{
      //   this.dismiss();
      // }).catch(()=>{console.log("there is an error");

      // });

      if(this.checkboxChecked){
        this.addType(expense).then(()=>{
          this.actionservice.createExpense(expense).then(()=>{
              this.dismiss();
          }).catch(()=>{
              this.notification.presentToast("There is problem in adding expense, try again latter","danger")
          });
        });
      }else{

        this.actionservice.createExpense(expense).then(()=>{
            this.dismiss();
        }).catch(()=>{
            this.notification.presentToast("There is problem in adding expense, try again latter","danger")
        });

      }
     
    })
   
  }

  addType(expenseInterface?: ExpenseInterface) :Promise<void>{
   
    let userid: string

    return this.storage.getFromLocalStorage("WB_userid").then((res)=>{

      userid = res.value;
      
      this.settingref = this.database.object('settings/'+userid);
      this.settingref.query.get().then((snapshot)=>{

        if(!this.lodash.isNull(snapshot.val())){
          this.setting = snapshot.val();
        }else{
          this.setting = this.defaultSetting;
          this.setting.expenseTypes = [''];
          this.setting.incomeTypes = [''];
        }

      }).then(()=>{

        if(expenseInterface.category == "Income"){
          this.setting.incomeTypes.push(expenseInterface.type)
        }else{
          this.setting.expenseTypes.push(expenseInterface.type)
        }

        this.settingref.set(this.setting).then(()=>{

          this.creditTypesArray = Object.keys(this.creditTypes).concat(this.setting.incomeTypes)
          this.expenseTypesArray = Object.keys(this.expenseTypes).concat(this.setting.expenseTypes);

          this.dataservice.setIncomeTypes(this.creditTypesArray);
          this.dataservice.setExpenseTypes(this.expenseTypesArray)

        }).catch(()=>{
          this.notification.presentToast("There is internal servor error","danger");
        })
      })
        
    });
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  test(){
    console.log("hello");
    
  }

  showCategoryMenu(){

    let expense: ExpenseInterface = this.addExpenseForm.value;
  
    if(expense.category == "Income"){
      this.isReturn = true;
      this.isExpense = false;
    }else {
      this.isReturn = false;
      this.isExpense = true;
    }
  }

  toggleChecked(){
    this.checkboxChecked = !this.checkboxChecked
  }

  setExpenseTypesArray(): void{
      this.storage.getFromLocalStorage("WB_userid").then((res)=>{

        let userid = res.value;
        let userSetting: Setting;
        
        this.settingref = this.database.object('settings/'+userid);
        this.settingref.query.get().then((snapshot)=>{

          if(!this.lodash.isNull(snapshot.val())){
            userSetting = snapshot.val();
            this.creditTypesArray = Object.keys(this.creditTypes).concat(userSetting.incomeTypes)
            this.expenseTypesArray = Object.keys(this.expenseTypes).concat(userSetting.expenseTypes);

          }else{
            this.creditTypesArray = Object.keys(this.creditTypes);
            this.expenseTypesArray = Object.keys(this.expenseTypes);
          }

        })
    });
  }
}
