import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [BudgetComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([{path:'',component:BudgetComponent}])
  ]
})
export class BudgetModule { }
