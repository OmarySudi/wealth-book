import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActionService } from 'src/app/services/action/action.service';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { ExpenseTypes } from 'src/app/constants/constants';
import { Category } from 'src/app/constants/constants';
import { CreditTypes } from 'src/app/constants/constants';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import {NotificationService} from 'src/app/services/notification/notification.service'


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
  creditTypes: any;
  category: any;
  isExpense: boolean;
  isReturn: boolean;

  constructor(
    private modalController:ModalController,
    private actionservice: ActionService,
    private datetimeservice: DatetimeService,
    private notification: NotificationService
    ) { 
    
      this.expenseTypes = ExpenseTypes;
      this.category = Category;
      this.creditTypes = CreditTypes;
      this.isExpense = false;
      this.isReturn = false;
  }

 
  ngOnInit() {
   // console.log(this.addExpenseForm.value);
    
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
      this.actionservice.createExpense(expense).then(()=>{
          this.dismiss();
      }).catch(()=>{
          this.notification.presentToast("There is problem in adding expense, try again latter","danger")
      });
    })
   
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
  
    if(expense.category == "Return"){
      this.isReturn = true;
      this.isExpense = false;
    }else {
      this.isReturn = false;
      this.isExpense = true;
    }
  }

}
