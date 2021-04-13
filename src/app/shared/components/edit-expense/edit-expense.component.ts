import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseTypes } from 'src/app/constants/constants';
import { CreditTypes } from 'src/app/constants/constants';
import { ModalController } from '@ionic/angular';
import { ActionService } from 'src/app/services/action/action.service';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import {NotificationService} from 'src/app/services/notification/notification.service'
import {DataService} from 'src/app/services/data/data.service'
import { StorageService } from 'src/app/services/storage/storage.service';
import { SubscriptionLike } from 'rxjs';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Setting } from 'src/app/interfaces/setting';
import { LodashService} from 'src/app/services/lodash/lodash.service'

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss'],
})
export class EditExpenseComponent implements OnInit {

  expenseTypes: any;
  creditTypes: any;

  expenseTypesArray: string[];
  creditTypesArray: string[];
  creditTypeSubscription: SubscriptionLike;
  expenseTypeSubscription: SubscriptionLike;
  settingref: AngularFireObject<Setting>
  

  constructor(
    private modalController: ModalController,
    private actionService: ActionService,
    private notification: NotificationService,
    private database: AngularFireDatabase,
    private storage: StorageService,
    private lodash: LodashService,
    private dataservice: DataService,
    ) {

    this.expenseTypes = ExpenseTypes;
    this.creditTypes = CreditTypes;
   }

    // Data passed in by componentProps
    @Input() amount: number;
    @Input() description: string;
    @Input() type: string;
    @Input() date: string;
    @Input() key: string;
    @Input() category: string;

 
    editExpenseForm = new FormGroup({
      amount: new FormControl('',Validators.required),
      description: new FormControl(''),
      type: new FormControl('',Validators.required),
      date: new FormControl('')
    });
    
  ngOnInit() { 

    this.setExpenseTypesArray();

    this.editExpenseForm.setValue(
        { amount: this.amount,
          description:this.description,
          type: this.type,
          date: this.date
        }
      )

    //   this.expenseTypeSubscription = this.dataservice.getExpenseTypesSubscription().
    //   subscribe({
    //     next:((expense: string[])=>{
    //       this.expenseTypesArray = expense;
    //     }),
    //     error: (()=>{

    //     }),

    //     complete: (()=>{

    //     })

    //   });

    // this.creditTypeSubscription = this.dataservice.getIncomeTypesSubscription().
    //   subscribe({
    //     next:((income: string[])=>{
    //       this.creditTypesArray = income;
    //     }),
    //     error: (()=>{

    //     }),

    //     complete: (()=>{

    //     })

    //   });
  }


  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  editExpense(){
    const expense: ExpenseInterface = this.editExpenseForm.value;

    this.actionService.editExpense(expense,this.key).then(()=>{
      this.dismiss()
    }).catch(()=>{
      this.notification.presentToast("There is a problem occured, please try again later","danger");
    });
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
          console.log(this.creditTypesArray)
          console.log(this.expenseTypesArray)

        }else{
          this.creditTypesArray = Object.keys(this.creditTypes);
          this.expenseTypesArray = Object.keys(this.expenseTypes);
        }

      })
  });
}

}
