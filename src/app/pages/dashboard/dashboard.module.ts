import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';


// const routes: Routes = [
//   {
//     path: '',
//     component: DashboardComponent
    
//   }

// ];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{path:'',component:DashboardComponent}])

  ]
})
export class DashboardModule { }
