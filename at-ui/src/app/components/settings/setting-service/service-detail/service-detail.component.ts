import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { formatCurentcy, formatCurrencyNumber, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { onLoadMedicalService, onRemoveMedicalService, onUpdateMedicalService } from 'src/app/store/actions/medicalService.action';
import MedicalService from '../../../../../../../at-common/model/MedicalService';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import { onLoadMedicalServiceById } from '../../../../store/actions/medicalService.action';
import { RootState } from '../../../../store/entities/state.entity';
export class ServiceInfor {
  label: string
  value: string | any
  inputType: string | any
  typeInput?: string | any
  isUpdate: boolean
  formName: string
  disabled?: boolean
  required?: boolean
}
@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  providers: [DestroySubsribeService]
})
export class ServiceDetailComponent implements OnInit {

  serviceForm: FormGroup;
  medicalService: MedicalService = null;
  serviceContent: ServiceInfor[] = [];
  serviceList: MedicalService[] = [];

  isEdit: boolean = false;

  formatCurentcy = formatCurentcy;
  validateForm = validateForm;
  formatCurrencyNumber = formatCurrencyNumber;
  validateAllFormFields = validateAllFormFields;
  scrollToFirstInvalidControl = scrollToFirstInvalidControl;

  constructor(
    public location: Location,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.serviceForm = this.createServiceForm();
    this.route.queryParams.subscribe(param => {
      if (param && param._id) {
        this.onLoadMedicalService(param._id);
        this.onLoadMedicalServiceList();
      }
    })
  }

  onLoadMedicalService = (_id: string) => {
    this.store.dispatch(onLoadMedicalServiceById({ _id: _id }));
    this.store.select(state => state.medicalService.medicalServiceItem)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalServiceItem => {
        if (!medicalServiceItem) return;
        this.medicalService = medicalServiceItem;
        this.serviceForm = this.createServiceForm();
        this.onCreateServiceContent();
      })
  }

  onLoadMedicalServiceList = () => {
    this.store.dispatch(onLoadMedicalService());
    this.store
      .select((state) => state.medicalService.medicalServices)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalService) => {
        if (!medicalService) return;
        this.serviceList = medicalService;
      });
  }

  createServiceForm = (): FormGroup => {
    return this._formBuilder.group({
      _id: [this.medicalService?._id],
      name: [this.medicalService?.name, [Validators.required], this.validIncludeService.bind(this)],
      description: [this.medicalService?.description],
      price: [this.medicalService?.price, [Validators.required]],
      priceMax: [this.medicalService?.priceMax],
      priceMin: [this.medicalService?.priceMin],
      tagService: [this.medicalService?.tagService, [Validators.required]]
    })
  }

  onCreateServiceContent = (): void => {
    this.serviceContent = [
      { label: 'Tên dịch vụ', value: this.medicalService?.name, inputType: null, isUpdate: false, formName: 'name', required: true },
      { label: 'Giá', value: formatCurentcy(this.medicalService?.price), inputType: 'money', isUpdate: false, formName: 'price',required: true },
      { label: 'Giá nhỏ nhất', value: formatCurentcy(this.medicalService?.priceMin), inputType: 'money', isUpdate: false, formName: 'priceMin' },
      { label: 'Giá lớn nhất', value: formatCurentcy(this.medicalService?.priceMax), inputType: 'money', isUpdate: false, formName: 'priceMax' },
      { label: 'Nhóm', value: this.medicalService?.tagService, isUpdate: false, inputType: null, formName: 'tagService' ,required: true},
    ];
  }

  handleUpdateService = (): void => {
    this.serviceContent.filter(val => val.isUpdate = !val.isUpdate);
    this.isEdit = !this.isEdit;
    !this.isEdit && (this.serviceForm = this.createServiceForm());
  }

  validatorName = (name: string): Observable<boolean> => {
    let isValid: boolean = this.serviceList.filter(value => value.name !== this.medicalService?.name).every(val => val.name.toLocaleLowerCase() !== name.toLocaleLowerCase())
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

    if (this.serviceForm.valid && this.serviceForm.valid) {
      this.serviceForm.get('price').setValue(this.formatCurrencyNumber(this.serviceForm.get('price').value));
      this.serviceForm.get('priceMin').setValue(this.formatCurrencyNumber(this.serviceForm.get('priceMin').value));
      this.serviceForm.get('priceMax').setValue(this.formatCurrencyNumber(this.serviceForm.get('priceMax').value));

      this.store.dispatch(onUpdateMedicalService(this.serviceForm.value));
      this.handleUpdateService();
    }

    validateAllFormFields(this.serviceForm);
    scrollToFirstInvalidControl(this.serviceForm);
  }

  onRemoveService = (): void => {

    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn muốn xóa dịch vụ <b>${this.medicalService?.name}</b>`;
    modal.result.then(result => {
      if (!result) return;
      this.store.dispatch(onRemoveMedicalService(this.medicalService));
      this.location.back();
    }).catch(error => {
    })
  }

}