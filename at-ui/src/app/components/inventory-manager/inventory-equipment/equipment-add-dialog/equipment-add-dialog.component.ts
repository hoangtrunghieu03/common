import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UNIT, SOURCE } from 'src/app/shared/data/inventory';
import { formatCurrencyNumber, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { RoleService } from 'src/app/shared/service/setting.service';
import { Store } from '@ngrx/store';
import { RootState } from '../../../../store/entities/state.entity';
import { onCreatMedicalEquipment } from 'src/app/store/actions/medicalEquipment.action';

@Component({
  selector: 'app-equipment-add-dialog',
  templateUrl: './equipment-add-dialog.component.html',
  styleUrls: ['./equipment-add-dialog.component.scss']
})
export class EquipmentAddDialogComponent implements OnInit {

  inventoryForm: FormGroup;
  formContent = FORMCOTENT;
  formatCurrencyNumber = formatCurrencyNumber;
  validateForm = validateForm;
  _id: string;
  equipmentItem: any;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private dataService: RoleService,
    private store: Store<RootState>
  ) {
    this.inventoryForm = this.createInventoryForm();
  }

  ngOnInit(): void {
    this._id && this.dataService.onLoadEquipById(this._id).subscribe(val => {
      val && (this.equipmentItem = val[0]);
      this.inventoryForm = this.createInventoryForm();
    })
  }

  createInventoryForm = (): FormGroup => {
    return this._formBuilder.group({
      _id: [!this.equipmentItem?._id],
      name: [this.equipmentItem?.name, [Validators.required]],
      origin: [this.equipmentItem?.origin, [Validators.required]],
      unit: [this.equipmentItem?.unit, [Validators.required]],
      quantity: [this.equipmentItem?.quantity, [Validators.required]],
      price: [this.equipmentItem?.price],
      date: [null]
    })
  }

  onSaveForm = (): void => {
    if (this.inventoryForm.valid) {
      let dataForm = this.inventoryForm.value;

      dataForm.price = formatCurrencyNumber(dataForm.price);
      dataForm.quantity = Number(dataForm.quantity);

      this.store.dispatch(onCreatMedicalEquipment(dataForm));
      this.activeModal.close();
    }
    validateAllFormFields(this.inventoryForm);
    scrollToFirstInvalidControl(this.inventoryForm);
  }

}

const FORMCOTENT = [
  { label: 'Tên trang thiết bị', formName: 'name', require: true, inputType: '', typeInput: '' },
  { label: 'Số lượng', formName: 'quantity', require: true, inputType: 'number' },
  { label: 'Đơn giá', formName: 'price', require: false, inputType: 'money', typeInput: '' },
  { label: 'Đơn vị', formName: 'unit', require: true, inputType: '', typeInput: '' },
  { label: 'Nguồn gốc', formName: 'origin', require: true, inputType: '', typeInput: '' },
]