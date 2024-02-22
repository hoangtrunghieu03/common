import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { formatPhoneNumber, regexEmail, regexFormTel, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { login, onResetPassword } from 'src/app/store/actions/authentication.action';
import { showProgress } from 'src/app/store/actions/progress.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { onClearStateRole, onloadRoleStaffLogin } from 'src/app/store/actions/roles.action';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import Staffs from '../../../../../../at-common/model/Staffs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthencationEffect } from 'src/app/store/effects/authentication.effect';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import Role from '../../../../../../at-common/model/Role';
import * as _ from 'lodash';
import { SETTING_PRINT } from '../../../../../../at-common/model/enum';
import { onCreateSetting, onLoadSettings, onUpdateSetting } from '../../../store/actions/setting.action';
import Setting from '../../../../../../at-common/model/Setting';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthencationEffect, DestroySubsribeService]
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public registerForm: FormGroup;
  validateForm = validateForm;
  regexEmail = regexEmail;
  formatPhoneNumber = formatPhoneNumber;
  information = CONTENT_ADDRESS_FORM;
  isLoading: boolean = false;
  settingContent: Array<{label: string, formName: string, type: string , link: boolean , class : string , icon : string }> = [];
  settingList: Setting[] = [];
  settingForm: FormGroup;
 

  constructor(
    public authencationEffect: AuthencationEffect,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<RootState>,
    private _modal: NgbModal,
    private activatedRoute: ActivatedRoute,
    private destroy: DestroySubsribeService,
    private _formBuilder: FormBuilder,
    ) {
  }

  ngOnInit() {
    this.settingForm = this.createSettingForm();
    this.onLoadSetting();
    this.isAuthenticated();
    this.store.dispatch(onClearStateRole());
    this.settingContent = [
      {
        label: SETTING_PRINT.ADDRESS,
        formName: 'address',
        type: 'multi',
        link: false,
        class : "col-12",
        icon : "map-pin",
        
      },
      {
        label: SETTING_PRINT.TEL,
        formName: 'tel',
        type: 'multi',
        link: false,
        class : "col-12",
        icon : "phone",
      },
      {
        label: SETTING_PRINT.WEBSITE,
        formName: 'website',
        type: 'single',
        link: false,
        class : "col-12",
        icon : "globe",
      },
   
    ],
    
    this.loginForm = this.createLoginForm();
    // this.registerForm = this.createRegisterForm();

    this.activatedRoute.queryParams.subscribe(param => {
      if (param && param._id) {
        this.onConfirmResetPassword(param._id);
      }
    })

    this.store.select(state => state.progress.show)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(show => {
      this.isLoading = !show;
    })
    this.settingContent = [
      {
        label: SETTING_PRINT.ADDRESS,
        formName: 'address',
        type: 'multi',
        link: false,
        class : "col-12",
        icon : "map-pin",
        
      },
      {
        label: SETTING_PRINT.TEL,
        formName: 'tel',
        type: 'multi',
        link: false,
        class : "col-12",
        icon : "phone",
      },
      {
        label : SETTING_PRINT.EMAIL,
        formName : 'email',
        type : 'single',
        link : false,
        class : "col-12",
        icon : "mail"
      },
      {
        label: SETTING_PRINT.WEBSITE,
        formName: 'website',
        type: 'single',
        link: false,
        class : "col-12",
        icon : "globe",
      },
   
    ]

  }
  onLoadSetting(): void {
    this.store.dispatch(onLoadSettings());
    this.store.select(state => state.setting.settings)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(setting => {
        if (!setting) return;
        this.settingList = _.cloneDeep(setting);
        this.settingForm = this.createSettingForm();
      })
  }
  createSettingForm(): FormGroup {
    return this._formBuilder.group({
      logo: [this.getValueOfData(SETTING_PRINT.LOGO) ? this.getValueOfData(SETTING_PRINT.LOGO).settingValue : [null]],
      name: [this.getValueOfData(SETTING_PRINT.NAME) ? this.getValueOfData(SETTING_PRINT.NAME).settingValue : null],
      address: [this.getValueOfData(SETTING_PRINT.ADDRESS) ? this.getValueOfData(SETTING_PRINT.ADDRESS).settingValue : [null]],
      website: [this.getValueOfData(SETTING_PRINT.WEBSITE) ? this.getValueOfData(SETTING_PRINT.WEBSITE).settingValue : null],
      footerInfor: [this.getValueOfData(SETTING_PRINT.FOOTERINFO) ? this.getValueOfData(SETTING_PRINT.FOOTERINFO).settingValue : null],
      tel: [this.getValueOfData(SETTING_PRINT.TEL) ? this.getValueOfData(SETTING_PRINT.TEL).settingValue : null],
      email: [this.getValueOfData(SETTING_PRINT.EMAIL) ? this.getValueOfData(SETTING_PRINT.EMAIL).settingValue : null]

    })
  }
  
  getValueOfData(key: string) {
    const settingList = _.cloneDeep(this.settingList);
    let value = settingList.find(x => x.settingKey == key);
    return value;
  }

  isAuthenticated = () => {
    if (localStorage.getItem('id_token')) {
      this.store.dispatch(showProgress());
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(localStorage.getItem('id_token'));
      if (decodedToken.roleId) {
        this.store.dispatch(onloadRoleStaffLogin({ roleId: decodedToken.roleId }));
        this.store.select(state => state.role.roleStaffLogin)
          .pipe(takeUntil(this.destroy.destroySub$))
          .subscribe((role: Role) => {
            if (!role) return;
            this.store.select(state => state.staff.staffLogin)
              .pipe(takeUntil(this.destroy.destroySub$))
              .subscribe((staff: Staffs) => {
                if (!staff) return;
                this.authencationEffect.onActiveMenu(role.dataAccesses, staff.dataAccessNameExtends);
              })
          })
      }
      return;
    }
    this.isLoading = true;
  }

  createLoginForm():FormGroup {
    return this.formBuilder.group({
      tel: ['',[Validators.required, regexFormTel]],
      password: ['',[Validators.minLength(6), Validators.maxLength(32),Validators.required]],
    })
  }

  createRegisterForm():FormGroup {
    return this.formBuilder.group({
      userName: [''],
      password: [''],
      confirmPassword: [''],
    })
  }

  onForgotPassword = (): void => {
    const modalRef = this._modal.open(ForgotPasswordComponent, {
      scrollable: false,
      size: 'md', //'sm' | 'lg' | 'xl' | string;
      centered: true
    }).result.then(result => {
      if (!result) { return }
    }).catch(error => { return error })
  }

  onConfirmResetPassword = (_id: string) => {
    const modal: NgbModalRef = this._modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
      backdrop: 'static',
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Xác nhận đặt lại mật khẩu của bạn`;
    modal.result.then(result => {
      if (!result) { return }
      let staff: Staffs = new Staffs();
      staff._id = _id;
      this.store.dispatch(onResetPassword(staff));
    }).catch(error => {
    })
  }

  
  loginToMainContent():void {
    if ( this.loginForm.valid ){
      let loginData = _.cloneDeep(this.loginForm.value);
      loginData.tel = loginData.tel.replaceAll(' ', '');
      this.store.dispatch(login(loginData));
    } else {

      validateAllFormFields(this.loginForm);

      scrollToFirstInvalidControl(this.loginForm);

    }

  }

  goToLink = (url:string):void => {
    window.open("//" + url, '_blank');
  }

}

const CONTENT_ADDRESS_FORM = [
  {label: '170 Nguyễn Hữu Thọ, Q. Hải Châu, Tp. Đà Nẵng', icon: 'map-pin', class: 'col-12',link: false},
  {label: '0236.3811.899', icon: 'phone', class: 'col-12',link: false},
  {label: '0983 1100 25 - 0983.11.00.24', icon: 'phone', class: 'col-12',link: false},
  {label: 'tienrhm2008@gmail.com', icon: 'mail', class: 'col-12',link: false},
  {label: 'www.nhakhoaatdanang.com', icon: 'globe', class: 'col-12',link: true},
]