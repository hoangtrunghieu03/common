import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path:'thong-tin',
    component:UserProfileComponent,
    data: {
      title: "Thông tin cá nhân",
      breadcrumb: "Thông tin cá nhân",
    }
    
  },
  {
    path:'dang-nhap',
    component:LoginComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
