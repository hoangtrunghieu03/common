import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { ServiceInfor } from 'src/app/components/settings/setting-service/service-detail/service-detail.component';
import { formatCurentcy, formatCurrencyNumber, FormatDateComponent, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadMedicalSupply, onLoadMedicalSupplyById, onRemoveMedicalSupply, onUpdateMedicalSupply } from 'src/app/store/actions/medicalSupply.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalSupply from '../../../../../../../at-common/model/MedicalSupply';
import { InventoryWarehouseComponent } from '../inventory-warehouse/inventory-warehouse.component';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss'],
  providers: [FormatDateComponent]
})
export class InventoryDetailComponent implements OnInit {

  medicalSupplyForm: FormGroup;
  medicalSupply: MedicalSupply = null;
  medicalSupplyContent: ServiceInfor[] = [];
  medicalSupplyList: MedicalSupply[] = [];

  isEdit: boolean = false;

  formatCurentcy = formatCurentcy;
  validateForm = validateForm;
  formatCurrencyNumber = formatCurrencyNumber;
  validateAllFormFields = validateAllFormFields;
  scrollToFirstInvalidControl = scrollToFirstInvalidControl;

  constructor(
    public _location: Location,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private formatDate: FormatDateComponent
  ) { }

  ngOnInit(): void {
    this.medicalSupplyForm = this.createMedicalSupplyForm();
    this.onLoadMedicalSupply();
    this.route.queryParams.subscribe(param => {
      if (param && param._id) {
        this.onLoadMedicalSupplyItem(param._id);
      }
    })
  }

  onLoadMedicalSupply = () => {
    this.store.dispatch(onLoadMedicalSupply());
    this.store.select(state => state.medicalSupply.medicalSupply)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalSupplyList => {
        if (!medicalSupplyList) return this.medicalSupplyList = [];
        this.medicalSupplyList = medicalSupplyList;
      })
  }

  onLoadMedicalSupplyItem = (_id: string) => {
    this.store.dispatch(onLoadMedicalSupplyById({ _id: _id }));
    this.store.select(state => state.medicalSupply.medicalSupplyItem)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalServiceItem => {
        if (!medicalServiceItem) return;
        this.medicalSupply = medicalServiceItem;
        this.medicalSupplyForm = this.createMedicalSupplyForm();
        this.onCreateMedicalServiceContent();
      })
  }

  createMedicalSupplyForm = (): FormGroup => {
    return this._formBuilder.group({
      _id: [this.medicalSupply?._id],
      name: [this.medicalSupply?.name, [Validators.required]],
      origin: [this.medicalSupply?.origin],
      unit: [this.medicalSupply?.unit],
      quantity: [this.medicalSupply?.quantity],
      price: [formatCurentcy(this.medicalSupply?.price)],
      expDate: [this.datePipe.transform(this.medicalSupply?.expDate, 'dd-MM-yyyy')],
      minQuantity: [this.medicalSupply?.minQuantity],
    })
  }

  onCreateMedicalServiceContent = (): void => {
    this.medicalSupplyContent = [
      { label: 'Tên vật tư', value: this.medicalSupply?.name, inputType: null, isUpdate: false, formName: 'name', required: true },
      { label: 'Hạn sử dụng', value: this.datePipe.transform(this.medicalSupply?.expDate, 'dd/MM/yyyy'), inputType: 'date', isUpdate: false, formName: 'expDate', disabled: true },
      { label: 'Giá nhập', value: formatCurentcy(this.medicalSupply?.price), inputType: 'money', typeInput: 'null', isUpdate: false, formName: 'price', disabled: true },
      { label: 'Số lượng tối thiểu', value: this.medicalSupply?.minQuantity, inputType: 'number', typeInput: 'number', isUpdate: false, formName: 'minQuantity' },
      { label: 'Số lượng trong kho', value: this.medicalSupply?.quantity, isUpdate: false, inputType: 'number', formName: 'quantity', disabled: true },
      { label: 'Đơn vị', value: this.medicalSupply?.unit, isUpdate: false, inputType: null, formName: 'unit'},
      { label: 'Đơn vị cung cấp', value: this.medicalSupply?.origin, isUpdate: false, inputType: null, formName: 'origin' },
    ];
  }

  handleUpdateInventory = (): void => {
    this.medicalSupplyContent.filter(val => val.isUpdate = !val.isUpdate);
    this.isEdit = !this.isEdit;
    !this.isEdit && (this.medicalSupplyForm = this.createMedicalSupplyForm());
  }

  onSaveForm = (): void => {

    if (this.medicalSupplyForm.valid && !this.validInclude()) {
      let dataForm = this.medicalSupplyForm.value;
      dataForm.expDate = this.formatDate.formatDate(dataForm.expDate, 'yyyy-MM-dd');
      dataForm.price = formatCurrencyNumber(dataForm.price);
      dataForm.quantity = Number(dataForm.quantity);
      dataForm.minQuantity = Number(dataForm.minQuantity);

      this.store.dispatch(onUpdateMedicalSupply(this.medicalSupplyForm.value));
      this.handleUpdateInventory();
    }

    validateAllFormFields(this.medicalSupplyForm);
    scrollToFirstInvalidControl(this.medicalSupplyForm);
  }

  validInclude = (): boolean => {
    if (!this.medicalSupplyForm || !this.medicalSupplyForm.get('name').value) return false;
    return this.medicalSupplyList.some(val => val._id !== this.medicalSupply?._id && val.name?.toLocaleUpperCase() == this.medicalSupplyForm.get('name').value?.toLocaleUpperCase() &&
      val.origin?.toLocaleUpperCase() == this.medicalSupplyForm.get('origin').value?.toLocaleUpperCase())
  }

  onRemoveService = (): void => {

    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn muốn xóa vật dụng <b>${this.medicalSupply?.name}</b>`;
    modal.result.then(result => {
      if (!result) return;
      this.store.dispatch(onRemoveMedicalSupply(this.medicalSupply));
      this._location.back();
    }).catch(error => {
    })
  }

  handleEventInventoryWarehouse = (): void => {
    const modal: NgbModalRef = this.modal.open(InventoryWarehouseComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.medicalSupply = this.medicalSupply;
    modal.result.then(result => {
      if (!result) return;
      // this._location.back();
    }).catch(error => {
    })
  }
}
