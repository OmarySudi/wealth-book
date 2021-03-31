import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { IonicModule } from '@ionic/angular';
import { RegisterComponent } from './register.component';
import { AppFormsModule } from 'src/app/core/modules/app-forms.module';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    IonicModule,
    RegisterRoutingModule,
    AppFormsModule,
  ]
})
export class RegisterModule { }
