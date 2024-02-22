import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { logout } from 'src/app/store/actions/authentication.action';
import { onChangeStaffPassword } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  @Input() staffId: string;

  staffForm: FormGroup;
  contentForm = CONTENT_FORM;
  validateForm = validateForm;

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private router: Router,
    public activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit(): void {
    this.staffForm = this.createStaffPasswordForm();
    this.contentForm = this.contentForm.filter(x => x.hide = true);
  }

  createStaffPasswordForm = (): FormGroup => {
    return this._formBuilder.group({
      _id: [this.staffId],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      confirmPassword: [null, [Validators.minLength(6), Validators.maxLength(32), Validators.required]],
    }, { validators: this.checkPasswords })
  }

  onSavePasswordForm = (): void => {
    if (this.staffForm.valid) {
      this.store.dispatch(onChangeStaffPassword(this.staffForm.value));
      this.activeModal.close();
      return this.store.dispatch(logout());
    }
    validateAllFormFields(this.staffForm);
    scrollToFirstInvalidControl(this.staffForm);
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value
    return pass === confirmPass ? null : { notSame: true }
  }

  moveToLoginPage = (): void => {
    this.router.navigate(['/dang-nhap']);
  }
}

const CONTENT_FORM = [
  { label: 'Mật khẩu', formName: 'password', type: 'password', hide: true },
  { label: 'Xác nhận mật khẩu', formName: 'confirmPassword', type: 'password', hide: true },
]