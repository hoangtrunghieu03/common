import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { formatCurrencyNumber, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { onCreateMedicalService, onLoadMedicalService , onLoadMedicalServiceTag } from 'src/app/store/actions/medicalService.action';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import { RootState } from '../../../../store/entities/state.entity';
import MedicalService from '../../../../../../../at-common/model/MedicalService';
import { Observable, of, timer } from 'rxjs';

@Component({
  selector: 'at-service-add-dialog',
  templateUrl: './service-add-dialog.component.html',
  styleUrls: ['./service-add-dialog.component.scss'],
  providers: [DestroySubsribeService]
})
export class ServiceAddDialogComponent implements OnInit {

  serviceForm: FormGroup;
  serviceList: MedicalService[] = [];
  medicalSupply :{label : string , value: string | any}[] = [];

  formatCurrencyNumber = formatCurrencyNumber;
  validateForm = validateForm;
  validateAllFormFields = validateAllFormFields;
  scrollToFirstInvalidControl = scrollToFirstInvalidControl;

  medicalSeviceTag : {label :string ,value : string | any}[] = [];
  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.serviceForm = this.createServiceForm();
    this.onLoadMedicalService();
    this.onLoadMedicalServiceTag();
  }

  onLoadMedicalService = () => {
    this.store.dispatch(onLoadMedicalService());
    this.store
      .select((state) => state.medicalService.medicalServices)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalService) => {
        if (!medicalService) return;
        this.serviceList = medicalService;
      });
  }

  onLoadMedicalServiceTag = () =>{
    this.store.dispatch(onLoadMedicalServiceTag());
    this.store
      .select((state) => state.medicalService.medicalServiceTag)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalServiceTag) =>{
        if(!medicalServiceTag) return;
        this.medicalSupply = [];
        medicalServiceTag.forEach((item) =>{
          this.medicalSupply.push({label : item.tagService , value : item.tagService});
        });
      });   
  }

  createServiceForm = (): FormGroup => {
    return this._formBuilder.group({
      name: [null, [Validators.required], this.validIncludeService.bind(this)],
      description: [null],
      price: [null, [Validators.required]],
      priceMax: [null],
      priceMin: [null],
      tagService: [null, [Validators.required]]
    })
  }

  validatorName = (name: string): Observable<boolean> => {
    let isValid: boolean = this.serviceList.every(val => val.name.toLocaleLowerCase() !== name.toLocaleLowerCase())
    return of(isValid)
  }

  validIncludeService = (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500)
      .pipe(
        switchMap(() =>
          this.validatorName(control.value)
            .pipe(
              map(isValid => {
                if (isValid) return null;
                return {
                  nameDuplicated: true
                }
              }
              )
            ))
      )
  }

  onSaveForm = (): void => {

    if (this.serviceForm.valid) {
      this.serviceForm.get('price').setValue(this.formatCurrencyNumber(this.serviceForm.get('price').value));
      this.serviceForm.get('priceMin').setValue(this.formatCurrencyNumber(this.serviceForm.get('priceMin').value));
      this.serviceForm.get('priceMax').setValue(this.formatCurrencyNumber(this.serviceForm.get('priceMax').value));

      this.activeModal.close(this.serviceForm.value);
    }

    validateAllFormFields(this.serviceForm);
    scrollToFirstInvalidControl(this.serviceForm);
  }

}