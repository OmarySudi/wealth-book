import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  constructor(
    private storageservice: StorageService,
    private alertcontroller: AlertController) 
    { 

    }

  ngOnInit() {}

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

}
