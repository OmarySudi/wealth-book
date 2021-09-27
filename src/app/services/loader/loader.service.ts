import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(public loadingController: LoadingController) { }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      //duration: 2000
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }

  async dismiss(){
    await this.loadingController.dismiss();
  }
}
