import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth"
import firebase from 'firebase/app';
import { from,Observable, throwError } from 'rxjs';
import { LodashService } from 'src/app/services/lodash/lodash.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireAuth: AngularFireAuth,
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
    return from(this.fireAuth.signOut());
  }

  loginWithGoogle(): Promise<firebase.auth.UserCredential>{
    return this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginWithFacebook(): Promise<firebase.auth.UserCredential>{
    return this.fireAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider)
  }
  
  requestResetPasswordLink(email: string){
    return this.fireAuth.sendPasswordResetEmail(email);
  }

}
