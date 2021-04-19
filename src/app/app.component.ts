import { Component,OnInit,NgZone } from '@angular/core';
import { StorageKeys } from './constants/constants';
import { DatetimeService } from './services/datetime/datetime.service';
import { StorageService } from './services/storage/storage.service';
import { DataService} from './services/data/data.service'
import firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth'
import {Router} from '@angular/router'


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  constructor(
    private datetimeService: DatetimeService,
    private dataservice: DataService,
    private storageservice: StorageService,
    private angularAuth: AngularFireAuth,
    private router: Router,
    private zone: NgZone,
  ) {
    
    this.checkIfUserLoggedIn().then(()=>{
      this.initalizeInstallDate();
    })
  }


 ngOnInit(){
  //  this.checkIfUserLoggedIn().then(()=>{
  //     this.initalizeInstallDate();
  //   })
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

  checkIfUserLoggedIn(){
    return this.angularAuth.onAuthStateChanged((user: firebase.User)=>{
      if(user){
        this.dataservice.setEmail(user.email)
        this.dataservice.setName(user.displayName)

        this.zone.run(()=>{
          this.router.navigate(['/tabs/dashboard'])
        })
        
      }else{

        this.zone.run(()=>{
          this.router.navigate(['/auth/login'])
        })
      
      }
  })
  }
}
