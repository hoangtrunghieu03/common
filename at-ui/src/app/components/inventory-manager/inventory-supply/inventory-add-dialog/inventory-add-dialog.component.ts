import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { formatCurrencyNumber, FormatDateComponent, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { onCreateMedicalSupply, onLoadMedicalSupply , onLoadMedicalSupplyUnit } from 'src/app/store/actions/medicalSupply.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import MedicalSupply from '../../../../../../../at-common/model/MedicalSupply';
import MedicalSupplyHistory from '../../../../../../../at-common/model/MedicalSupplyHistory';


@Component({
  selector: 'app-inventory-add-dialog',
  templateUrl: './inventory-add-dialog.component.html',
  styleUrls: ['./inventory-add-dialog.component.scss'],
  providers: [FormatDateComponent]
})
export class InventoryAddDialogComponent implements OnInit {

  medicalSupplyForm: FormGroup;
  formContent = FORM_CONTENT;
  medicalSupplyList: MedicalSupply[] = [];
  medicalSupplyUnit: MedicalSupplyHistory[] = [];

  medicalServiceIndicates: {label: string, value: string | any}[] = [];
  medicalSupply :{label : string , value: string | any}[] = [];

  validateForm = validateForm;
  formatCurrencyNumber = formatCurrencyNumber;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private formatDate: FormatDateComponent,
    private destroyService: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.onLoadMedicalSupply();
    this.onLoadMedicalSupplyUnit();
    this.medicalSupplyForm = this.createmedicalSupplyForm();
  }


  onLoadMedicalSupply = () : void=> {
    this.store.dispatch(onLoadMedicalSupply());
    this.store.select(state => state.medicalSupply.medicalSupply)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSupplyList => {
        if (!medicalSupplyList) return this.medicalSupplyList = [];
        this.medicalSupplyList = medicalSupplyList;
        this.medicalSupply = [];
        medicalSupplyList.forEach((item) =>{
          this.medicalSupply.push({label : item.name , value : item.name})
        })
      })
  }

  onLoadMedicalSupplyUnit = () =>{
    this.store.dispatch(onLoadMedicalSupplyUnit());
    this.store.select(state => state.medicalSupply.medicalSupplyUnit)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(medicalSupplyUnit =>{
      if(!medicalSupplyUnit) return this.medicalSupplyUnit = [];
      this.medicalSupplyUnit = medicalSupplyUnit;
      this.medicalServiceIndicates = [];
      medicalSupplyUnit.forEach((item) =>{
        this.medicalServiceIndicates.push({label : item.medicalSupplyOrigin, value : item.medicalSupplyOrigin})
      });
    })
  }

  createmedicalSupplyForm = (): FormGroup => {
    return this._formBuilder.group({
      name: [null, [Validators.required]],
      origin: [null],
      unit: [null],
      quantity: [null],
      price: [null],
      expDate: [null],
      minQuantity: [null],
    })
  }

  onSaveForm = (): void => {
    if (this.medicalSupplyForm.valid && !this.validInclude()) {
      let dataForm = this.medicalSupplyForm.value;
      dataForm.expDate = this.formatDate.formatDate(dataForm.expDate, 'yyyy-MM-dd');
      dataForm.price = formatCurrencyNumber(dataForm.price);
      dataForm.quantity = Number(dataForm.quantity);
      dataForm.minQuantity = Number(dataForm.minQuantity);
      dataForm.price = formatCurrencyNumber(dataForm.price);

      this.activeModal.close(dataForm);
    }

    validateAllFormFields(this.medicalSupplyForm);
    scrollToFirstInvalidControl(this.medicalSupplyForm);
  }

  validInclude = (): boolean => {
    if (!this.medicalSupplyForm || !this.medicalSupplyForm.get('name').value) return false;
    return this.medicalSupplyList.some(val => val.name?.toLocaleUpperCase() == this.medicalSupplyForm.get('name').value?.toLocaleUpperCase() &&
      val.origin?.toLocaleUpperCase() == this.medicalSupplyForm.get('origin').value?.toLocaleUpperCase())
  }

}

const FORM_CONTENT = [
  {
    label: 'Tên vật dụng',
    formName: 'name',
    inputType: null,
    require: true
  },
  {
    label: 'Đơn vị cung cấp',
    formName: 'origin',
    inputType: null,
  },
  {
    label: 'Đơn vị',
    formName: 'unit',
    inputType: null,
  },
  {
    label: 'Hạn sử dụng',
    formName: 'expDate',
    inputType: 'date',
  },
  {
    label: 'Số lượng',
    formName: 'quantity',
    inputType: 'number',
    typeInput: 'number',
  },
  {
    label: 'Số lượng tối thiểu',
    formName: 'minQuantity',
    inputType: 'number',
    typeInput: 'number',
  },
  {
    label: 'Đơn giá',
    formName: 'price',
    inputType: 'money',
  }
];
