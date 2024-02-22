import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { GENERAL_FILTER } from 'src/app/shared/data/examine';
import { INVENTORY } from 'src/app/shared/data/inventory';
import { InventoryAddDialogComponent } from './inventory-supply/inventory-add-dialog/inventory-add-dialog.component';

@Component({
  selector: 'app-inventory-manager',
  templateUrl: './inventory-manager.component.html',
  styleUrls: ['./inventory-manager.component.scss']
})
export class InventoryManagerComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF;
  inventorys = INVENTORY;
  conditionData = GENERAL_FILTER;
  filterResult: { condition: string, conditionSelect: string, value: string } = {condition: 'sex', conditionSelect: this.conditionData.sex, value: null}
  renderSelect: Array<any> = [];

  constructor(
    private _modal: NgbModal,
  ) {
  }

  ngOnInit(): void {
  }

  onSearch(event):void {

  }

  onFilterConditionChange = ():void => {
    Object.entries(GENERAL_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
  }

  onAddCondiotion = ():void => {
    if ( this.filterResult.condition && this.filterResult.value ) {
      let newFilter = {
        id: Date.now(),
        key: this.filterResult.condition,
        firstCondition: this.filterResult.conditionSelect,
        secondCondition: this.filterResult.value,
      }
      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }
    }
  }

  onRemoveFilter = (param):void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
  }

  handleEventInventory = ():void => {
    const modalRef = this._modal.open(InventoryAddDialogComponent, {
      scrollable: true,
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-backdrop',
      windowClass: 'inventory-window',
      centered: true
    }).result.then( result => {
      if ( !result ) { return }
      this.inventorys.push(result)
      this.inventorys = [...this.inventorys]
    }).catch( error => { return error})
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Mã',
    prop: 'code',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: true,
    path: 'i',
  },
  {
    name: 'Tên vật dụng',
    prop: 'name',
    width: 200,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Đơn vị',
    prop: 'unit',
    width: 100,
    colType: '',
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
    width: 150,
    colType: 'money',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Nguồn gốc',
    prop: 'source',
    width: 150,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'NSX',
    prop: 'producerDate',
    width: 150,
    colType: 'date',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'HSD',
    prop: 'expiry',
    width: 150,
    colType: 'date',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  }
];