import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {AngularFireAuth} from "@angular/fire/auth";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NotificationService} from 'src/app/services/notification/notification.service'

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.page.html',
  styleUrls: ['./passwordreset.page.scss'],
})
export class PasswordresetPage implements OnInit {

  constructor(
    private router:Router,
    private activedRoute: ActivatedRoute,
    private angularAuth: AngularFireAuth,
    private notification: NotificationService
    ) {

     }

  PasswordResetForm: FormGroup = new FormGroup({
    password: new FormControl('',[Validators.required,Validators.min(8)]),
    passwordConfirm: new FormControl('',[Validators.required,Validators.min(8)]),
  });
  
  showPassword: boolean;
  showConfirmPassword: boolean;
  mode: string;
  actionCode: string;
  actionCodeChecked: boolean;

  ngOnInit() {
    this.activedRoute.queryParams.subscribe(params=>{

      if(!params) this.router.navigate(['/auth/login']);

      this.mode = params['mode'];
      this.actionCode = params['oobCode']

      this.angularAuth.verifyPasswordResetCode(this.actionCode).then(()=>{
    
        this.actionCodeChecked = true;
      }).catch(()=>{

      
        this.notification.passwordReset("There is a problem in verifying reset code, it's either invalid or expired, please try to reset password again","Code verification error","danger");

        setTimeout(()=>{
          this.router.navigate(['/auth/forget-password']);
        },6000)
      });
      
    });
  }

  toggleShowPassword(): void{
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void{
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  doPasswordReset(){
    if(this.PasswordResetForm.value.password != this.PasswordResetForm.value.passwordConfirm){

      console.log("password do not match");
      
      this.notification.presentToast("Passwords do not match","danger");

      return;
    }

    this.angularAuth.confirmPasswordReset(this.actionCode,this.PasswordResetForm.value.password)
      .then(()=>{

        this.notification.passwordReset("Password has been successfully changed","Password saved","success");

        setTimeout(()=>{
          this.router.navigate(['/auth/login']);
        },6000)

      }).catch(()=>{

        this.notification.presentToast("Password may be weak or code is expired","danger");

      });

  }

}
