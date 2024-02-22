import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import {
  formatCurentcy,
  formatCurrencyNumber,
  scrollToFirstInvalidControl,
  validateAllFormFields,
  validateForm,
} from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import {
  onLoadServiceIndicate,
  onLoadServiceIndicateById,
  onRemoveServiceIndicate,
  onUpdateServiceIndicate,
} from 'src/app/store/actions/serviceIndicate.action';
import { TYPE_SERVICEINDICATE } from '../../../../../../../at-common/model/enum';
import MedicalServiceIndicate from '../../../../../../../at-common/model/MedicalServiceIndicate';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import { RootState } from '../../../../store/entities/state.entity';
export class AllocateInfor {
  label: string;
  value: string | any;
  inputType: string | any;
  typeInput?: string | any;
  isUpdate: boolean;
  formName: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-allocate-detail',
  templateUrl: './allocate-detail.component.html',
  styleUrls: ['./allocate-detail.component.scss'],
  providers: [DestroySubsribeService],
})
export class AllocateDetailComponent implements OnInit {
  
  allocateForm: FormGroup;
  medicalIndicate: MedicalServiceIndicate = null;
  allocateContent: AllocateInfor[] = [];
  serviceIndicateList: MedicalServiceIndicate[] = [];
  typeServiceIndicates: {label: string, value: string | any}[];

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
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.allocateForm = this.createIndicateForm();
    this.typeServiceIndicates = Object.values(TYPE_SERVICEINDICATE).map((item) => (
      { label: item, value: item, _id: item }));
    this.route.queryParams.subscribe((param) => {
      if (param && param._id) {
        this.onLoadMedicalIndicate(param._id);
        this.onLoadMedicalServiceIndicateList();
      }
    });
  }

  onLoadMedicalIndicate = (_id: string) => {
    this.store.dispatch(onLoadServiceIndicateById({ id: _id }));
    this.store
      .select((state) => state.serviceIndicate.serviceIndicateItem)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalServiceItem) => {
        if (!medicalServiceItem) return;
        this.medicalIndicate = medicalServiceItem;
        this.allocateForm = this.createIndicateForm();
        this.onCreateIndicateContent();
      });
  };

  onLoadMedicalServiceIndicateList = () => {
    this.store.dispatch(onLoadServiceIndicate());
    this.store
      .select((state) => state.serviceIndicate.serviceIndicates)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalService) => {
        if (!medicalService) return;
        this.serviceIndicateList = medicalService;
      });
  }

  createIndicateForm = (): FormGroup => {
    return this._formBuilder.group({
      _id: [this.medicalIndicate?._id],
      name: [this.medicalIndicate?.name, [Validators.required], this.validIncludeService.bind(this)],
      description: [this.medicalIndicate?.description],
      price: [this.medicalIndicate?.price, [Validators.required]],
      tagService: [this.medicalIndicate?.tagService, [Validators.required]],
      medicalServiceIndicateGroupId: [this.medicalIndicate?.medicalServiceIndicateGroupId],
      typeIndicate: [this.medicalIndicate?.typeIndicate, [Validators.required]],
    });
  };

  onCreateIndicateContent = (): void => {
    this.allocateContent = [
      {
        label: 'Tên chỉ định',
        value: this.medicalIndicate?.name,
        inputType: null,
        isUpdate: false,
        formName: 'name',
      },
      {
        label: 'Tổng giá chỉ định',
        value: formatCurentcy(this.medicalIndicate?.price),
        inputType: 'money',
        isUpdate: false,
        formName: 'price',
      },
      {
        label: 'Nhóm',
        value: this.medicalIndicate?.tagService,
        isUpdate: false,
        inputType: null,
        formName: 'tagService',
      },
      {
        label: 'Loại',
        value: this.medicalIndicate?.typeIndicate,
        isUpdate: false,
        inputType: null,
        formName: 'typeIndicate',
      },
    ];
  };

  handleUpdateIndicate = (): void => {
    this.allocateContent.filter((val) => (val.isUpdate = !val.isUpdate));
    this.isEdit = !this.isEdit;
    !this.isEdit && (this.allocateForm = this.createIndicateForm());
  };

  validatorName = (name: string): Observable<boolean> => {
    let isValid: boolean = this.serviceIndicateList.filter(value => value.name !== this.medicalIndicate?.name).every(val => val.name.toLocaleLowerCase() !== name.toLocaleLowerCase())
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
    if (this.allocateForm.valid) {
      this.allocateForm
        .get('price')
        .setValue(
          this.formatCurrencyNumber(this.allocateForm.get('price').value)
        );
      this.store.dispatch(onUpdateServiceIndicate(this.allocateForm.value));
      this.handleUpdateIndicate();
    }

    validateAllFormFields(this.allocateForm);
    scrollToFirstInvalidControl(this.allocateForm);
  };

  onRemoveIndicate = (): void => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    });
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn muốn xóa dịch vụ <b>${this.medicalIndicate?.name}</b>`;
    modal.result
      .then((result) => {
        if (!result) return;
        this.store.dispatch(onRemoveServiceIndicate(this.medicalIndicate));
        this.location.back();
      })
      .catch((error) => {});
  };
}
