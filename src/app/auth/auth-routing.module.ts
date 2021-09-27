import { importType } from '@angular/compiler/src/output/output_ast';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterModule)
  },

  {
    path: 'forget-password',
    loadChildren: () => import('./forget-password/forget-password.module').then( m => m.ForgetPasswordModule)
  },

  {
    path: 'password-reset',
    loadChildren: ()=>import('./passwordreset/passwordreset.module').then(m => m.PasswordresetPageModule)
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
