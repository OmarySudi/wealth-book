import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AuthService } from '../auth/auth.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent{

  constructor(
    private authService: AuthService,
    private notification: NotificationService,
    private route: Router) 
  { 

  }

  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email])
  });

  doForgetPassword(): void{
    this.authService.requestResetPasswordLink(this.forgetPasswordForm.value.email)
      .then(()=>{

        this.notification.passwordReset("Reset password link has been sent to your email","Email sent","success");

        setTimeout(()=>{
          this.route.navigate(['/auth/login']);
        },6000)
        

      });

  }

}
