import { Component, OnInit, SystemJsNgModuleLoader} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import {Router} from '@angular/router'
import firebase from 'firebase/app';
import {NotificationService} from 'src/app/services/notification/notification.service'
import { StorageService } from 'src/app/services/storage/storage.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

  public showPassword: boolean = false;

  constructor(
    private authservice: AuthService,
    private route: Router,
    private notification: NotificationService,
    private storage: StorageService
    ) 
    { 
      console.log("in constructor"); 
    }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.min(8)])
  });

 ngOnInit(){

 }

  doLogin(): void{
    
    let loginValues = this.loginForm.value;
    this.authservice.loginWithEmailAndPassword(loginValues.email,loginValues.password)
      .subscribe(
        {
          next: (res: firebase.auth.UserCredential)=>{

            let user = firebase.auth().currentUser;
        
            this.storage.saveToLocalStorage("userid",user.uid);
            this.storage.saveToLocalStorage("name",user.displayName);
            this.storage.saveToLocalStorage("email",user.email);

            user.reload();

            if(user.emailVerified){

              this.route.navigate(['/tabs/dashboard']);

            }else {
             this.notification.presentToast("Make sure to verify email before login","danger");
              
            }
          },
          error: (error)=>{
            switch(error.code){
              case 'auth/wrong-password':
                this.notification.presentToast("You have entered the wrong password","danger")
                break;

                case 'auth/user-not-found':
                  this.notification.presentToast("There is no user with such email found","danger")
                  break;

                  case 'auth/too-many-requests':
                    this.notification.presentToast(error.message,"danger");
                    break;
            }
            }
          }
      );
  }

  togglePasswordType(): void{
    this.showPassword = !this.showPassword;
  }

}
