import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import {
  formatCurrencyNumber,
  scrollToFirstInvalidControl,
  validateAllFormFields,
  validateForm,
} from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onCreateServiceIndicate, onLoadServiceIndicate , onLoadTagServiceIndicate } from 'src/app/store/actions/serviceIndicate.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { TYPE_SERVICEINDICATE } from '../../../../../../../at-common/model/enum';
import MedicalServiceIndicate from '../../../../../../../at-common/model/MedicalServiceIndicate';


@Component({
  selector: 'app-allocate-add-dialog',
  templateUrl: './allocate-add-dialog.component.html',
  styleUrls: ['./allocate-add-dialog.component.scss'],
  providers: [DestroySubsribeService]
})
export class AllocateAddDialogComponent implements OnInit {
  AllocateForm: FormGroup;

  typeServiceIndicates: {label: string, value: string | any}[];
  serviceTag: {label : string , value : string | any}[]
  tagMedicalService :  {label: string, value: string | any}[];

  formatCurrencyNumber = formatCurrencyNumber;
  validateForm = validateForm;
  validateAllFormFields = validateAllFormFields;
  scrollToFirstInvalidControl = scrollToFirstInvalidControl;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService
  ) {}

  ngOnInit(): void {
    this.AllocateForm = this.createAllocateForm();
    this.onLoadTagService();
    this.typeServiceIndicates = Object.values(TYPE_SERVICEINDICATE).map((item) => (
      { label: item, value: item, _id: item }));   
  }

  onLoadTagService = () =>{
    this.store.dispatch(onLoadTagServiceIndicate());
    this.store
      .select((state) =>state.serviceIndicate.tagServiceIndeicate)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalServiceTag) =>{
        if(!medicalServiceTag) return;
        this.tagMedicalService =[];
       medicalServiceTag.forEach((item) =>{
        this.tagMedicalService.push({label : item.tagService , value : item.tagService});     
       });
      });
  }

  createAllocateForm = (): FormGroup => {
    return this._formBuilder.group({
      name: [null, [Validators.required]],
      description: [null],
      typeIndicate: [null, [Validators.required]],
      price: [null, [Validators.required]],
      tagService: [null, [Validators.required]],
    });
  };

  onSaveForm = (): void => {

    if (this.AllocateForm.valid) {
      this.AllocateForm.get('price').setValue(this.formatCurrencyNumber(this.AllocateForm.get('price').value));
      this.AllocateForm.get('name').setValue(this.AllocateForm.get('name').value);
      this.AllocateForm.get('tagService').setValue(this.AllocateForm.get('tagService').value);
      this.store.dispatch(onCreateServiceIndicate(this.AllocateForm.value));
      this.activeModal.close();
    }

    validateAllFormFields(this.AllocateForm);
    scrollToFirstInvalidControl(this.AllocateForm);
  }
}
