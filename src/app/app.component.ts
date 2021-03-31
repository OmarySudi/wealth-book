import { Component } from '@angular/core';
import { StorageKeys } from './constants/constants';
import { DatetimeService } from './services/datetime/datetime.service';
import { StorageService } from './services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private datetimeService: DatetimeService,
    private storageservice: StorageService
  ) {

    this.initalizeInstallDate();
  }

  initalizeInstallDate(): void{
    
    this.storageservice.getFromLocalStorage(StorageKeys.INSTALL_DATE).then((val)=>{
      if(val){
        this.datetimeService.installDate = val.value;
      }else{
        this.storageservice.saveToLocalStorage(StorageKeys.INSTALL_DATE,this.datetimeService.getCurrentDateTime());
      }
    })
  }
}
