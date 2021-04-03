import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReportComponent } from './report.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{path:'',component:ReportComponent}])
  ]
})

export class ReportModule { }
