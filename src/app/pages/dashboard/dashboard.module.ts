import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { CatagoryPipe } from 'src/app/pipes/catagory.pipe';
import { CategoryPipe} from 'src/app/pipes/category.pipe';
import {CustomCurrencyPipe} from 'src/app/pipes/custom-currency.pipe';

// const routes: Routes = [
//   {
//     path: '',
//     component: DashboardComponent
    
//   }

// ];

@NgModule({
  declarations: [DashboardComponent,CatagoryPipe,CategoryPipe,CustomCurrencyPipe],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{path:'',component:DashboardComponent}])

  ]
})
export class DashboardModule { }
