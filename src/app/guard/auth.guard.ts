import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth'
import {DataService} from 'src/app/services/data/data.service'
import {StorageService} from 'src/app/services/storage/storage.service'


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(
    private router: Router, 
    private angularAuth: AngularFireAuth,
    private dataservice: DataService,
    private storageService: StorageService,
    ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
    return new Promise((resolve,reject)=>{
      this.angularAuth.onAuthStateChanged((user: firebase.User)=>{
        if(user && user.emailVerified){
          this.dataservice.setEmail(user.email)
          this.dataservice.setName(user.displayName)
          resolve(true)
        }else{
          this.router.navigate(['/auth/login'])
          resolve(false)
        }
    })

    })
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
