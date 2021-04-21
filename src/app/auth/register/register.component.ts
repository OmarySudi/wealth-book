import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import firebase from 'firebase/app';
import {NotificationService} from 'src/app/services/notification/notification.service'
import {LoaderService} from 'src/app/services/loader/loader.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit{

  constructor(
    private authservice: AuthService,
    private notification: NotificationService,
    private loaderservice: LoaderService,
    ) 
    {

    }

  showPassword: boolean;
  showConfirmPassword: boolean;

  registrationForm: FormGroup = new FormGroup({
    name: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.min(8)]),
    passwordConfirm: new FormControl('',[Validators.required,Validators.min(8)]),
  });

  ngOnInit(){
    this.showPassword = false;
    this.showConfirmPassword = false;
  }
  
  doRegister(): void{
    this.loaderservice.presentLoading();

    let registrationValues = this.registrationForm.value;

      if(registrationValues.password.localeCompare(registrationValues.passwordConfirm) == 0){

        this.authservice.registerWithEmailAndPassword(registrationValues.email,registrationValues.password)
        .subscribe({
          next:(res: firebase.auth.UserCredential)=>{
           
                let user = firebase.auth().currentUser;
            
                user.updateProfile({displayName: registrationValues.name});
                user.sendEmailVerification().then(()=>{

                  this.loaderservice.dismiss();
                  this.notification.successfullRegistration('Confirm verification email before login','Successfully Registered');

                }).catch((error)=> {

                  this.loaderservice.dismiss();
                  this.notification.presentToast("There is problem sending verificatione email,try again latter","danger");

                });    
          },
          error: (error)=>{
            this.loaderservice.dismiss();
            switch(error.code){
              case 'auth/email-already-in-use':
                this.notification.presentToast(error.message,"danger");
                break;

                case 'auth/weak-password':
                  this.notification.presentToast(error.message,"danger");
                  break;
                default:
                  this.notification.presentToast(error.message,"danger")
                break;
            }
          }
        }
        );
      }else {
        this.notification.presentToast("Passwords does not match","danger");
      }  
  }

  toggleShowPassword(): void{
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void{
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
