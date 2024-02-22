import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { formatCurrencyNumber, FormatDateComponent, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { onImportMedicalSupply } from 'src/app/store/actions/medicalSupply.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalSupply from '../../../../../../../at-common/model/MedicalSupply';

@Component({
  selector: 'app-inventory-warehouse',
  templateUrl: './inventory-warehouse.component.html',
  styleUrls: ['./inventory-warehouse.component.scss'],
  providers: [FormatDateComponent]
})
export class InventoryWarehouseComponent implements OnInit {

  @Input() medicalSupply: MedicalSupply = null;

  medicalSupplyWarehouseForm: FormGroup;
  formContent = FORM_CONTENT;

  validateForm = validateForm;
  formatCurrencyNumber = formatCurrencyNumber;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private formatDate: FormatDateComponent,
  ) { }

  ngOnInit(): void {
    this.medicalSupplyWarehouseForm = this.createmedicalSupplyWarehouseForm();
  }

  createmedicalSupplyWarehouseForm = (): FormGroup => {
    return this._formBuilder.group({
      _id: [this.medicalSupply?._id],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      expDate: [null],
    })
  }

  onSaveForm = (): void => {
    if (this.medicalSupplyWarehouseForm.valid) {
      let dataForm = this.medicalSupplyWarehouseForm.value;
      dataForm.expDate = this.formatDate.formatDate(dataForm.expDate, 'yyyy-MM-dd');
      dataForm.price = formatCurrencyNumber(dataForm.price);
      dataForm.quantity = Number(dataForm.quantity);
      
      this.store.dispatch(onImportMedicalSupply(this.medicalSupplyWarehouseForm.value));
      this.activeModal.close();
    }

    validateAllFormFields(this.medicalSupplyWarehouseForm);
    scrollToFirstInvalidControl(this.medicalSupplyWarehouseForm);
  }
}

const FORM_CONTENT = [
  {
    label: 'Số lượng',
    formName: 'quantity',
    inputType: 'number',
    typeInput: 'number',
    required: true
  },
  {
    label: 'Đơn giá',
    formName: 'price',
    inputType: 'money',
    required: true
  },
  {
    label: 'Hạn sử dụng',
    formName: 'expDate',
    inputType: 'date',
    required: false
  },
];