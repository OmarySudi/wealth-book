import { Component, OnInit, SystemJsNgModuleLoader} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router'
import firebase from 'firebase/app';
import {AngularFireAuth} from "@angular/fire/auth"
import {NotificationService} from 'src/app/services/notification/notification.service'
import { StorageService } from 'src/app/services/storage/storage.service';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Setting } from 'src/app/interfaces/setting';
import { LodashService } from 'src/app/services/lodash/lodash.service';
import { DataService } from 'src/app/services/data/data.service';
import { GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import { FacebookLoginPlugin } from '@capacitor-community/facebook-login';
import { Plugins, registerWebPlugin } from '@capacitor/core'
import {LoaderService} from 'src/app/services/loader/loader.service'

import { FacebookLogin } from '@capacitor-community/facebook-login';
registerWebPlugin(FacebookLogin);


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

  public showPassword: boolean = false;
  fbLogin: FacebookLoginPlugin;
  user = null;
  token = null;

  setting: Setting;

  settingRef: AngularFireObject<Setting>;

  constructor(
    private authservice: AuthService,
    private route: Router,
    private notification: NotificationService,
    private storage: StorageService,
    private database: AngularFireDatabase,
    private angularAuth: AngularFireAuth,
    private lodash: LodashService,
    private dataservice: DataService,
    private loader: LoaderService,
    ) 
    { 
      // console.log("in constructor"); 
      const { FacebookLogin } = Plugins;
      this.fbLogin = FacebookLogin;
    }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.min(8)])
  });

 ngOnInit(){

 }

  doLogin(): void{

    this.loader.presentLoading();

    let loginValues = this.loginForm.value;
    this.authservice.loginWithEmailAndPassword(loginValues.email,loginValues.password)
      .subscribe(
        {
          next: (res: firebase.auth.UserCredential)=>{

            let user = firebase.auth().currentUser;
        
            this.storage.saveToLocalStorage("WB_userid",user.uid);
            // this.storage.saveToLocalStorage("WB_name",user.displayName);
            // this.storage.saveToLocalStorage("WB_email",user.email);

            this.dataservice.setEmail(user.email);
            this.dataservice.setName(user.displayName);

            this.setCurrency(user.uid);

            user.reload();

            if(user.emailVerified){

              this.loader.dismiss();
              this.route.navigate(['/tabs/dashboard']);
              
            }else {
            this.loader.dismiss();
             this.notification.presentToast("Make sure to verify email before login","danger");
              
            }
          },
          error: (error)=>{
            this.loader.dismiss();

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

                    default:
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

  // googleSignin(){
  //   this.authservice.loginWithGoogle().then((userCredential: firebase.auth.UserCredential)=>{
     
  //     this.storage.saveToLocalStorage("WB_userid",userCredential.user.uid);

  //     this.dataservice.setEmail(userCredential.user.email);
  //     this.dataservice.setName(userCredential.user.displayName);

  //     this.setCurrency(userCredential.user.uid);

  //     this.route.navigate(['/tabs/dashboard']);

  //   }).catch(()=>{

  //     this.notification.presentToast("There is a google server error","danger");
  //   });
  // }
 async googleSignin(){
    let googleUser = await GoogleAuth.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
    this.angularAuth.signInWithCredential(credential).then((userCredential: firebase.auth.UserCredential)=>{
      
      this.storage.saveToLocalStorage("WB_userid",userCredential.user.uid);

      this.dataservice.setEmail(userCredential.user.email);
      this.dataservice.setName(userCredential.user.displayName);

      this.setCurrency(userCredential.user.uid);

      this.route.navigate(['/tabs/dashboard']);

    }).catch(()=>{

      this.notification.presentToast("There is a google server error","danger");
    });
  }

  // facebookSignin(){
  //   this.authservice.loginWithFacebook().then((userCredential: firebase.auth.UserCredential)=>{
     
  //     this.storage.saveToLocalStorage("WB_userid",userCredential.user.uid);

  //     this.dataservice.setEmail(userCredential.user.email);
  //     this.dataservice.setName(userCredential.user.displayName);

  //     this.setCurrency(userCredential.user.uid);

  //     this.route.navigate(['/tabs/dashboard']);

  //   }).catch(()=>{

  //     this.notification.presentToast("There is a facebook server error","danger");
  //   });
  // }

  async facebookSignin(){
    // this.authservice.loginWithFacebook().then((userCredential: firebase.auth.UserCredential)=>{
     
    //   this.storage.saveToLocalStorage("WB_userid",userCredential.user.uid);

    //   this.dataservice.setEmail(userCredential.user.email);
    //   this.dataservice.setName(userCredential.user.displayName);

    //   this.setCurrency(userCredential.user.uid);

    //   this.route.navigate(['/tabs/dashboard']);

    // }).catch(()=>{

    //   this.notification.presentToast("There is a facebook server error","danger");
    // });
    const FACEBOOK_PERMISSIONS = ['email', 'public_profile'];
    const result = await this.fbLogin.login({ permissions: FACEBOOK_PERMISSIONS });
   

    if (result.accessToken && result.accessToken.userId) {
      const credential = firebase.auth.FacebookAuthProvider.credential(result.accessToken.token)

      this.angularAuth.signInWithCredential(credential).then((userCredential: firebase.auth.UserCredential)=>{
      
        this.storage.saveToLocalStorage("WB_userid",userCredential.user.uid);
  
        this.dataservice.setEmail(userCredential.user.email);
        this.dataservice.setName(userCredential.user.displayName);
  
        this.setCurrency(userCredential.user.uid);
  
        this.route.navigate(['/tabs/dashboard']);
  
      }).catch(()=>{
  
        this.notification.presentToast("There is a google server error","danger");
      });
      
    }else if(result.accessToken)
    {
      const credential = firebase.auth.FacebookAuthProvider.credential(result.accessToken.token)

      this.angularAuth.signInWithCredential(credential).then((userCredential: firebase.auth.UserCredential)=>{
      
        this.storage.saveToLocalStorage("WB_userid",userCredential.user.uid);
  
        this.dataservice.setEmail(userCredential.user.email);
        this.dataservice.setName(userCredential.user.displayName);
  
        this.setCurrency(userCredential.user.uid);
  
        this.route.navigate(['/tabs/dashboard']);
  
      }).catch(()=>{
  
        this.notification.presentToast("There is a google server error","danger");
      });
    }else {
      // Login failed
      this.notification.presentToast("There is a facebook server error during login","danger");
    }
  }

  setCurrency(userid: string){

    this.settingRef = this.database.object('settings/'+userid);
    
    this.settingRef.valueChanges().pipe(
      map(setting=>setting)
      ).subscribe((data)=>{

        if(this.lodash.isNull(data)){
          this.storage.saveToLocalStorage('WB_currency','USD').then(()=>{
            this.dataservice.setCurrency("USD")
          });
        }else{
          this.setting = data;
          this.storage.saveToLocalStorage('WB_currency',this.setting.currency).then(()=>{
            this.dataservice.setCurrency(this.setting.currency);
          });
        }
      });
    
  }

}
