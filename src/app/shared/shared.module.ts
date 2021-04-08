import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import {EditExpenseComponent} from './components/edit-expense/edit-expense.component'
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeCurrencyComponent } from './components/change-currency/change-currency.component';



@NgModule({
  declarations: [AddExpenseComponent,EditExpenseComponent,ChangeCurrencyComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],

})
export class SharedModule { }
