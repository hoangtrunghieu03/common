import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { UNIT, SOURCE } from 'src/app/shared/data/inventory';
import { formatCurrencyNumber } from 'src/app/shared/functions/function-helper';

@Component({
  selector: 'app-combo-add-dialog',
  templateUrl: './combo-add-dialog.component.html',
  styleUrls: ['./combo-add-dialog.component.scss']
})
export class ComboAddDialogComponent implements OnInit {

  comboForm: FormGroup;
  units = UNIT;
  sources = SOURCE;
  formatCurrencyNumber = formatCurrencyNumber;
  consumable = CONSUMABLE;
  colDef = _COLDEF;
  data = DATA;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.comboForm = this.createServiceForm();
  }

  createServiceForm = ():FormGroup => {
    return this._formBuilder.group({
      name: [null],
      consumable: [null],
      wage: [0],
      totalService: [0],
      note: [null],
      totalPrice: [0]
    })
  }

  onSelectItem = (param):void => {
    this.comboForm.get('consumable').setValue(param.value)
  }

  onSaveForm = ():void => {
    this.comboForm
    .get('totalPrice')
    .setValue(
      this.formatCurrencyNumber(this.comboForm.get('totalPrice').value)
    )

    this.activeModal.close(this.comboForm.value)
  }

  handleEventDeleteRow = (event):void => {

  }

}

const DATA = [
  {code: 'DV1', name: 'Nhổ răng', price: 100000},
  {code: 'DV2', name: 'Làm trắng răng', price: 100000},
]

const CONSUMABLE = [
  {label: 'Nhổ răng', value: 'Nhổ răng'},
  {label: 'Làm trắng răng', value: 'Làm trắng răng'},
]

const _COLDEF: Array<ColumnDef> = [
  {
    label: 'Mã dịch vụ',
    title: 'code',
    colType: '',
    style: null,
    headerStyle: null,
    canUpdate: false,
    fieldUpdate: null,
    updateType: null,
  },
  {
    label: 'Tên dịch vụ',
    title: 'name',
    colType: '',
    style: '',
    headerStyle: '',
    canUpdate: false,
    fieldUpdate: null,
    updateType: null,
  },
  {
    label: 'Giá dịch vụ',
    title: 'price',
    colType: 'money',
    style: '',
    headerStyle: '',
    canUpdate: false,
    fieldUpdate: null,
    updateType: null,
  },
];