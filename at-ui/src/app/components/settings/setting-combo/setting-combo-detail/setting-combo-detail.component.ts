import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onCreateMedicalComboService, onLoadMedicalComboServiceById, onRemoveMedicalComboService, onUpdateMedicalComboService } from 'src/app/store/actions/medicalComboService.action';
import { showNotify } from 'src/app/store/actions/notify.action';
import { onLoadServiceIndicate } from 'src/app/store/actions/serviceIndicate.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalComboService from '../../../../../../../at-common/model/MedicalComboService';
import MedicalServiceIndicate from '../../../../../../../at-common/model/MedicalServiceIndicate';
import { formatCurrencyNumber, formatCurentcy } from '../../../../shared/functions/function-helper';

@Component({
  selector: 'app-setting-combo-detail',
  templateUrl: './setting-combo-detail.component.html',
  styleUrls: ['./setting-combo-detail.component.scss'],
  providers: [DestroySubsribeService],
})
export class SettingComboDetailComponent implements OnInit {

  comboServiceForm: FormGroup;
  comboService = new MedicalComboService();
  medicalServiceIndicateGroups: Array<{ tagService: string, medicalServiceIndicates: MedicalServiceIndicate[] }> = [];
  medicalServiceIndicates: MedicalServiceIndicate[] = [];

  isEdit: boolean = false;

  validateForm = validateForm;
  formatCurentcy = formatCurentcy;

  constructor(
    private _formBuilder: FormBuilder,
    public location: Location,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private route: ActivatedRoute,
    private modal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.comboServiceForm = this.createComboServiceForm();
    this.store.dispatch(onLoadServiceIndicate());
    
    this.route.queryParams.subscribe((param) => {
      if (param && param._id) {
        this.onLoadComboService(param._id);
      } else {
        this.onLoadServicesIndicate();
      }
    })
  }

  onLoadComboService = (_id: string): void => {
    this.store.dispatch(onLoadMedicalComboServiceById({ _id: _id }));
    this.store
      .select((state) => state.medicalComboService.medicalComboServiceItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((comboService) => {
        if (!comboService) return;
        this.comboService = comboService;
        this.comboServiceForm = this.createComboServiceForm();
        this.onLoadServicesIndicate();
      });
  }

  createComboServiceForm = (): FormGroup => {
    return this._formBuilder.group({
      _id: [this.comboService?._id],
      name: [this.comboService?.name, [Validators.required]],
      price: [this.comboService?.price ? this.comboService?.price : 0, [Validators.required]],
      medicalServiceIndicates: [this.comboService?.medicalServiceIndicates, [Validators.required]],
    });
  };

  onLoadServicesIndicate = () => {
    this.store.select(state => state.serviceIndicate.serviceIndicates)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(service => {
        if (!service) { return this.medicalServiceIndicateGroups = [] }
        this.medicalServiceIndicates = _.cloneDeep(service);
        this.onGetServiceIndicate();
        this.onLoadServiceIndicateGroup();
      })
  }

  onLoadServiceIndicateGroup = () => {
    if (!this.medicalServiceIndicates || this.medicalServiceIndicates.length == 0) return this.medicalServiceIndicateGroups = [];
    this.medicalServiceIndicateGroups = [];
    this.medicalServiceIndicateGroups.push({ tagService: this.medicalServiceIndicates[0].tagService, medicalServiceIndicates: [this.medicalServiceIndicates[0]] });
    this.medicalServiceIndicates.forEach((medicalService, index) => {
      if (index === 0 || medicalService.name === 'Khác') return;
      let indexGroupExist = this.medicalServiceIndicateGroups.findIndex(x => x.tagService === medicalService.tagService);
      if (indexGroupExist === -1) {
        return this.medicalServiceIndicateGroups.push({ tagService: medicalService.tagService, medicalServiceIndicates: [medicalService] });
      }
      this.medicalServiceIndicateGroups[indexGroupExist].medicalServiceIndicates.push(medicalService);
    });
  }

  onGetServiceIndicate = () => {
    let serviceIndicateList = [];
    this.comboService?.medicalServiceIndicates.forEach(val => {
      let serviceIndicate = this.medicalServiceIndicates.find(x => x._id === val);
      serviceIndicate && serviceIndicateList.push(serviceIndicate);
    });
    this.comboServiceForm.get('medicalServiceIndicates').setValue(serviceIndicateList);
  }

  onSaveRole = (): void => {
    if (this.comboServiceForm.valid) {
      this.comboServiceForm.get('medicalServiceIndicates').setValue(
        this.comboServiceForm.get('medicalServiceIndicates').value.map((item) => item._id)
      )
      this.comboServiceForm.get('price').setValue(formatCurrencyNumber(this.comboServiceForm.get('price').value));
      if (this.comboService?._id) {
        this.store.dispatch(onUpdateMedicalComboService(this.comboServiceForm.value));
        this.isEdit = !this.isEdit;
      } else {
        this.store.dispatch(onCreateMedicalComboService(this.comboServiceForm.value));
      }
    } else {
      if (this.comboServiceForm.get('medicalServiceIndicates').errors?.required) {
        return this.store.dispatch(showNotify({ notifyType: 'warning', message: 'Vui lòng thêm chỉ định' }))
      }
      validateAllFormFields(this.comboServiceForm);
      scrollToFirstInvalidControl(this.comboServiceForm);
    }
  }

  onSelectServiceIndicate = (event): void => {
    let serviceIndicateList = [...this.comboServiceForm.get('medicalServiceIndicates').value];
    let index = serviceIndicateList.findIndex((val) => val._id == event._id);

    if (index > -1) {
      serviceIndicateList.splice(index, 1);
    } else {
      serviceIndicateList.push(event);
    }
    this.comboServiceForm.get('medicalServiceIndicates').setValue(serviceIndicateList);
    this.onChangePriceCombo();
  }

  onChangePriceCombo = () => {
    let serviceIndicateList = [...this.comboServiceForm.get('medicalServiceIndicates').value];
    let price: number = 0;
    serviceIndicateList.forEach(val => {
      price += val.price;
    });
    this.comboServiceForm.get('price').setValue(formatCurentcy(price));
  }

  checkedServiceIndicate = (item): boolean => {
    let medicalServiceIndicates = [...this.comboServiceForm.get('medicalServiceIndicates').value];
    return medicalServiceIndicates?.some(val => val._id == item._id)
  }

  onHandelUpdate = (): void => {
    this.isEdit = !this.isEdit
    if (!this.isEdit) {
      this.comboServiceForm = this.createComboServiceForm()
      this.onGetServiceIndicate();
    }
  }

  onDeleteRole = (): void => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn muốn xóa combo chỉ định <b>${this.comboService.name}</b>`;
    modal.result.then(result => {
      if (!result) return;
      this.store.dispatch(onRemoveMedicalComboService(this.comboService));
    }).catch(error => {
    })
  }

}