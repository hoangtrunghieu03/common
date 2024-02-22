import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { formatCurentcy, formatCurrencyNumber, FormatDateComponent, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { RoleService } from 'src/app/shared/service/setting.service';
import { InventoryAddDialogComponent } from '../../inventory-supply/inventory-add-dialog/inventory-add-dialog.component';
import { EquipmentAddDialogComponent } from '../equipment-add-dialog/equipment-add-dialog.component';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { ServiceInfor } from 'src/app/components/settings/setting-service/service-detail/service-detail.component';
import { MedicalEquipmentService } from 'src/app/store/services/medicalEquipment.service';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/entities/state.entity';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { takeUntil } from 'rxjs/operators';
import { loadMedicalEquipmentById, onRemoveMedicalEquipment, onUpdateMedicalEquipment } from 'src/app/store/actions/medicalEquipment.action';
import MedicalEquipment from '../../../../../../../at-common/model/MedicalEquipment';
@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.scss'],
  providers: [FormatDateComponent]
})
export class EquipmentDetailComponent implements OnInit {

  columnDef: ColDef[] = COL_DEF;
  inventoryContent: ServiceInfor[] = [];
  formatCurentcy = formatCurentcy;
  equipmentForm: FormGroup;
  equipmentItem: MedicalEquipment=null;

  validateForm = validateForm;
  isEdit: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private modal: NgbModal,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dataService: RoleService,
    public location: Location,
    private store: Store<RootState>,
    private medical:MedicalEquipmentService,
    private destroy: DestroySubsribeService,
    private formatDate: FormatDateComponent
  ) { }

  ngOnInit(): void {
    this.equipmentForm = this.createEquipmentForm();
    this.route.queryParams.subscribe(param => {
      if (param && param._id) {
        this.onLoadMedicalSEquipment(param._id);
      }
    })
  }

  onLoadMedicalSEquipment = (_id: string) => {
    this.store.dispatch(loadMedicalEquipmentById({ _id: _id }));
    this.store.select(state => state.medicalEquipment.medicalEquipmentDetails)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalEquipmentDetails => {
        if (!medicalEquipmentDetails) return;
        this.equipmentItem = medicalEquipmentDetails;
        this.equipmentForm = this.createEquipmentForm();
        this.onCreateMedicalEquipmentContent();
      })
  }

  onCreateMedicalEquipmentContent = (): void => {
    this.inventoryContent = [
      { label: 'Tên thiết bị', value: this.equipmentItem?.name, inputType: null, isUpdate: false, formName: 'name', required: true },
      { label: 'Ngày nhập', value: this.datePipe.transform(this.equipmentItem?.createDateTime, 'dd/MM/yyyy', 'UTC'), inputType: 'date', isUpdate: false, formName: 'createDate', required: true },
      { label: 'Đơn giá', value: formatCurentcy(this.equipmentItem?.price), inputType: 'money', isUpdate: false, formName: 'price', required: false },
      { label: 'Số lượng', value: this.equipmentItem?.quantity, isUpdate: false, inputType: 'number', formName: 'quantity', required: true },
      { label: 'Đơn vị', value: this.equipmentItem?.unit, isUpdate: false, inputType: null, formName: 'unit', required: true },
      { label: 'Nguồn gốc', value: this.equipmentItem?.origin, isUpdate: false, inputType: null, formName: 'origin', required: true },
    ];
  }

  createEquipmentForm = ():FormGroup => {
    return this._formBuilder.group({
      _id: [this.equipmentItem?._id,[Validators.required]],
      name: [this.equipmentItem?.name, [Validators.required]],
      createDate: [this.datePipe.transform(this.equipmentItem?.createDateTime, 'dd-MM-yyyy', 'UTC')],
      quantity: [this.equipmentItem?.quantity,[Validators.required]],
      unit: [this.equipmentItem?.unit,[Validators.required]],
      origin: [this.equipmentItem?.origin,[Validators.required]],
      price: [this.equipmentItem?.price]
    })
  }

  handleUpdateInventory = (): void => {
    this.inventoryContent.filter(val => val.isUpdate = !val.isUpdate);
    this.isEdit = !this.isEdit;
    !this.isEdit && (this.equipmentForm = this.createEquipmentForm());
  }

  onSaveForm = (): void => {
    if (this.equipmentForm.valid) {
      let dataForm = this.equipmentForm.value;
      
      dataForm.price = formatCurrencyNumber(dataForm.price);
      dataForm.quantity = Number(dataForm.quantity);
      
      this.store.dispatch(onUpdateMedicalEquipment(this.equipmentForm.value));
      this.handleUpdateInventory();
    }
    validateAllFormFields(this.equipmentForm);
    scrollToFirstInvalidControl(this.equipmentForm);
  }

  onRemoveService = (): void => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn muốn xóa Trang thiết bị <b>${this.equipmentItem?.name}</b>`;
    modal.result.then(result => {
      if (!result) return;
      this.store.dispatch(onRemoveMedicalEquipment(this.equipmentItem));
      this.location.back();
    }).catch(error => {
    })
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Ngày',
    prop: 'createDate',
    width: 100,
    colType: 'date',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Số lượng',
    prop: 'quantity',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Đơn giá',
    prop: 'price',
    width: 100,
    colType: 'money',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Nguồn gốc',
    prop: 'origin',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Người nhập',
    prop: 'importer',
    width: 150,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  }
];