import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Setting } from 'src/app/interfaces/setting';
import {DataService} from 'src/app/services/data/data.service'
import { NotificationService } from 'src/app/services/notification/notification.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-change-currency',
  templateUrl: './change-currency.component.html',
  styleUrls: ['./change-currency.component.scss'],
})
export class ChangeCurrencyComponent implements OnInit {

  @Input() currency: string;

  currencyObject: {};
  currencyKeys: string[];
  settingref: AngularFireObject<Setting>;
  setting: Setting;
  

  changeCurrencyForm = new FormGroup({
    currency: new FormControl('',Validators.required),
  });

  constructor( 
    private modalController: ModalController,
    private dataservice: DataService,
    private storage: StorageService,
    private database: AngularFireDatabase,
    private notification: NotificationService) { 
    //this.currencies = Currencies;
  }

  ngOnInit() {

    this.changeCurrencyForm.setValue(
      { 
        currency: this.currency,
      }
    )

    this.dataservice.getCurrencyCodes().subscribe(data=>{
     this.currencyObject = data;
     this.currencyKeys = Object.keys(data);
    })
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  changeCurrency(){

    this.storage.getFromLocalStorage("WB_userid").then((res)=>{

      let userid = res.value;
      
      this.setting = this.changeCurrencyForm.value;

      this.settingref = this.database.object('settings/'+userid);

      this.settingref.set(this.setting).then(()=>{
        this.storage.saveToLocalStorage('WB_currency',this.setting.currency).then(()=>{
          this.dataservice.setCurrency(this.setting.currency).then(()=>{
            this.dismiss();
          })
        });
      }).catch(()=>{
        this.notification.presentToast("There is internal servor error","danger");
      })

    });
  }

}
