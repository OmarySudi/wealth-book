import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgetPasswordRoutingModule } from './forget-password-routing.module';
import { IonicModule } from '@ionic/angular';
import { ForgetPasswordComponent } from './forget-password.component';
import { AppFormsModule } from 'src/app/core/modules/app-forms.module';


@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [
    CommonModule,
    IonicModule,
    ForgetPasswordRoutingModule,
    AppFormsModule,
  ]
})
export class ForgetPasswordModule { }
