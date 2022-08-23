import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth"
import firebase from 'firebase/app';
import { from,Observable, throwError } from 'rxjs';
import { LodashService } from 'src/app/services/lodash/lodash.service';
import {Router} from '@angular/router'
import { StorageService } from 'src/app/services/storage/storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireAuth: AngularFireAuth,
    private storageservice: StorageService,
    private router: Router,
    private notification: NotificationService,
    private _:LodashService
    ) { 

    }

  loginWithEmailAndPassword(email:string, password:string): Observable<firebase.auth.UserCredential>{

    if(!this._.isNull(email) && !this._.isNull(password))
      return from( this.fireAuth.signInWithEmailAndPassword(email,password));
    else
    return throwError("Email or password is null");

  }

  registerWithEmailAndPassword(email:string,password:string): Observable<firebase.auth.UserCredential>{

    if(!this._.isNull(email) && !this._.isNull(password))
      return from(this.fireAuth.createUserWithEmailAndPassword(email,password));
    else
      return throwError("Email or password is null");
  }

  logout(): Observable<void>{
    return from(this.fireAuth.signOut().then(()=>{
      this.storageservice.removeFromLocalStorage("WB_userid");
      this.storageservice.removeFromLocalStorage("WB_email");
      this.storageservice.removeFromLocalStorage("WB_name");
      this.router.navigate(['/auth/login'])
    }).catch(()=>{
      this.notification.presentToast("There is an error during logout, try again later","red");
    }));
  }

  // loginWithGoogle(): Promise<firebase.auth.UserCredential>{
  //   return this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  // }


  async loginWithGoogle(){
    return await GoogleAuth.signIn();
  }

  requestResetPasswordLink(email: string){
    return this.fireAuth.sendPasswordResetEmail(email);
  }

}
