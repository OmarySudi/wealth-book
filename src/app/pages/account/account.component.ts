import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ActionSheetController } from '@ionic/angular';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app';
import {Router} from '@angular/router'
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubscriptionLike } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import {AuthService} from 'src/app/auth/auth/auth.service'


@Component({
  selector: 'app-settings',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  email: string;
  name: string;
  emailSubscription: SubscriptionLike;
  nameSubscription: SubscriptionLike;

  constructor(
    private storageservice: StorageService,
    private authService: AuthService,
    private dataservice: DataService,
    private alertcontroller: AlertController,
    private actionSheetController: ActionSheetController,
    private auth: AngularFireAuth,
    private router: Router,
    private notification: NotificationService
    ) 
    { 
      
    }

  ngOnInit() {

    this.emailSubscription = this.dataservice.getEmailSubscription()
      .subscribe({
        next: ((email: string)=>this.email = email),
        error: ((error)=>{
          this.notification.presentToast(error,"danger")
        }),
        complete: (()=>{

        })   
      })

      this.nameSubscription = this.dataservice.getNameSubscription()
      .subscribe({
        next: ((name: string)=>this.name = name),
        error: ((error)=>{
          this.notification.presentToast(error,"danger")
        }),
        complete: (()=>{

        })   
      })

      this.setEmailAndName();
  }

  setEmailAndName(){
    this.auth.currentUser.then((user: firebase.User)=>{
      this.email = user.email;
      this.name = user.displayName;
      this.dataservice.setEmail(this.email).then(()=>{
        this.dataservice.setName(this.name)
      })
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
   this.authService.logout();
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
