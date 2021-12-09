import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import {EditExpenseComponent} from './components/edit-expense/edit-expense.component'
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CatagoryPipe } from 'src/app/pipes/catagory.pipe';
import { CategoryPipe} from 'src/app/pipes/category.pipe';
import {CustomCurrencyPipe} from 'src/app/pipes/custom-currency.pipe';
import { ChangeCurrencyComponent } from './components/change-currency/change-currency.component';
import { MonthlyExpensesComponent } from './components/monthly-expenses/monthly-expenses.component';




@NgModule({
  declarations: [
    AddExpenseComponent,
    EditExpenseComponent,
    ChangeCurrencyComponent,
    MonthlyExpensesComponent,
    CatagoryPipe,
    CategoryPipe,
    CustomCurrencyPipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CatagoryPipe,
    CategoryPipe,
    CustomCurrencyPipe
  ]

})
export class SharedModule { }
