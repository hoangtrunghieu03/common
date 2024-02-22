import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { regexEmail, regexFormEmail, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { onForgotPassword } from 'src/app/store/actions/authentication.action';
import { RootState } from 'src/app/store/entities/state.entity';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  modalCtrl: any;

  regexEmail = regexEmail;
  validateForm = validateForm;
  regexForm = regexFormEmail;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: [null, [Validators.required, this.regexForm]]
    });
  }

  onSaveModal = () => {
    if (this.forgotPasswordForm.valid) {
      this.store.dispatch(onForgotPassword(this.forgotPasswordForm.value));
      this.activeModal.close();
      return;
    }
    validateAllFormFields(this.forgotPasswordForm);
    scrollToFirstInvalidControl(this.forgotPasswordForm);
  }

}
