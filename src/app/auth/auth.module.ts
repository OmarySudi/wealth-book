import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuthModule } from '@angular/fire/auth';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    AuthRoutingModule,
    AngularFireAuthModule,
  ]
})
export class AuthModule { }
