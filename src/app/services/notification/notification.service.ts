import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {Router} from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastController: ToastController,private route:Router) { }

  async presentToast(message: string,color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      color: color,
      position: 'middle'
    });
    toast.present();
  }

  async successfullRegistration(message,header) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      position: 'top',
      cssClass: 'toast-custom-class',
      color: 'success',
      buttons: [
       {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            this.route.navigate(['/auth/login']);
          }
        }
      ]
    });
    toast.present();
  }

  async passwordReset(message,header,color) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 5000,
      position: 'top',
      cssClass: 'toast-custom-class',
      color: color,
      buttons: [
       {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            this.route.navigate(['/auth/forget-password']);
          }
        }
      ]
    });
    toast.present();
  }

}
