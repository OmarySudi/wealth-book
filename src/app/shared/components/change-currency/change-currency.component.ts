import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Setting } from 'src/app/interfaces/setting';
import {DataService} from 'src/app/services/data/data.service'
import { NotificationService } from 'src/app/services/notification/notification.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import {LodashService} from 'src/app/services/lodash/lodash.service'
import { SubscriptionLike } from 'rxjs';

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
  currencyCodeSubscription: SubscriptionLike;
  temporarySetting: Setting;

  checkboxChecked: boolean;
  

  changeCurrencyForm = new FormGroup({
    currency: new FormControl('',Validators.required),
  });

  constructor( 
    private modalController: ModalController,
    private dataservice: DataService,
    private storage: StorageService,
    private database: AngularFireDatabase,
    private notification: NotificationService,
    private lodash: LodashService,) { 
    //this.currencies = Currencies;
  }

  ngOnInit() {

    this.changeCurrencyForm.setValue(
      { 
        currency: this.currency,
      }
    )

   
    this.currencyCodeSubscription = this.dataservice.getCurrencyCodesSubscription()
     .subscribe({
       next: (codes)=>{

       
        this.currencyObject = codes
        this.currencyKeys = Object.keys(codes);
       },
       error: ()=>{},
       complete: ()=>{}
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
      
      this.temporarySetting = this.changeCurrencyForm.value;
  
      this.settingref = this.database.object('settings/'+userid);

      this.settingref.query.get().then((snapshot)=>{

        if(!this.lodash.isNull(snapshot.val())){
          this.setting = snapshot.val();
          this.setting.currency = this.temporarySetting.currency;
        }else{
          this.setting = this.changeCurrencyForm.value
          this.setting.expenseTypes = [''];
          this.setting.incomeTypes = [''];
        }

      }).then(()=>{
          this.settingref.set(this.setting).then(()=>{
            this.storage.saveToLocalStorage('WB_currency',this.setting.currency).then(()=>{
              this.dataservice.setCurrency(this.setting.currency).then(()=>{
                this.dismiss();
              })
            });
          }).catch(()=>{
            this.notification.presentToast("There is internal servor error","danger");
          })
          })
    });
  }

  toggleChecked(){

    if(!this.checkboxChecked)
      this.changeCurrencyForm.setValue({currency:''});

    this.checkboxChecked = !this.checkboxChecked;
  }

}
