import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordresetPageRoutingModule } from './passwordreset-routing.module';
import { AppFormsModule } from 'src/app/core/modules/app-forms.module';

import { PasswordresetPage } from './passwordreset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppFormsModule,
    PasswordresetPageRoutingModule
  ],
  declarations: [PasswordresetPage]
})
export class PasswordresetPageModule {}
