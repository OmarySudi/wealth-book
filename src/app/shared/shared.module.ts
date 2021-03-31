import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import {EditExpenseComponent} from './components/edit-expense/edit-expense.component'
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AddExpenseComponent,EditExpenseComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],

})
export class SharedModule { }
