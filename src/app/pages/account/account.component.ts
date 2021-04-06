import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ActionSheetController } from '@ionic/angular';
import { AngularFireAuth } from "@angular/fire/auth";
import {Router} from '@angular/router'
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-settings',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  email: string;
  name: string;

  constructor(
    private storageservice: StorageService,
    private alertcontroller: AlertController,
    private actionSheetController: ActionSheetController,
    private auth: AngularFireAuth,
    private router: Router,
    private notification: NotificationService
    ) 
    { 

    }

  ngOnInit() {

    this.setEmailAndName();
  }

  setEmailAndName(){
    this.storageservice.getFromLocalStorage('email').then((res)=> this.email = res.value)
    .then(()=>{
      this.storageservice.getFromLocalStorage('name').then((res)=>this.name = res.value)
    })
  }

  resetApp(){
    this.storageservice.clearLocalStorage(true).then(()=>{
      this.presentResetAlert();
    });
  }

  async presentResetAlert() {
    const alert = await this.alertcontroller.create({
      cssClass: 'my-custom-class',
      header: 'App reset successfully',
      buttons: ['OK']
    });

    await alert.present();
  }

  logoutUser(){
    this.auth.signOut().then(()=>{
      this.router.navigate(['/auth/login'])
    }).catch(()=>{
      this.notification.presentToast("There is an error during logout, try again later","red");
    })
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to logout?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'YES',
        role: 'destructive',
        icon: 'checkmark',
        handler: () => {
          this.logoutUser();
        }
      },
      {
        text: 'NO',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

}
