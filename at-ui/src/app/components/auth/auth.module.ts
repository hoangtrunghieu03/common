import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '../../shared/shared.module';
import { AtFeatherIconModule } from "../../shared/components/feather-icons/feather-icons.module";
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ATModalModule } from 'src/app/shared/modal/modal-common/modal.module';
import { AtInputModule } from 'src/app/shared/components/at-input/at-input.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AtSelectModule } from 'src/app/shared/components/at-select/at-select.module';
import { AtDatePickerModule } from 'src/app/shared/components/at-datepicker/at-datepicker.module';
import { AtExamineFooterModule } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.module';
import { ATDirectivesModule } from 'src/app/shared/directives/directives.module';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { ProgressBarModule } from 'src/app/shared/components/progress-bar/progress-bar.module';
@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent, UserProfileComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    CarouselModule,
    SharedModule,
    AtFeatherIconModule,
    FormsModule,
    ATModalModule,
    AtInputModule,
    AtSelectModule,
    AtDatePickerModule,
    AtExamineFooterModule,
    ATDirectivesModule,
    ProgressBarModule
  ]
})
export class AuthModule { }
