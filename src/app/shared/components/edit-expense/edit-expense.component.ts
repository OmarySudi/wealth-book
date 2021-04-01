import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpenseTypes } from 'src/app/constants/constants';
import { CreditTypes } from 'src/app/constants/constants';
import { ModalController } from '@ionic/angular';
import { ActionService } from 'src/app/services/action/action.service';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import {NotificationService} from 'src/app/services/notification/notification.service'
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss'],
})
export class EditExpenseComponent implements OnInit {

  expenseTypes: any;
  creditTypes: any;
  


  constructor(
    private modalController: ModalController,
    private actionService: ActionService,
    private notification: NotificationService,
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

    this.editExpenseForm.setValue(
        { amount: this.amount,
          description:this.description,
          type: this.type,
          date: this.date
        }
      )
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

}
