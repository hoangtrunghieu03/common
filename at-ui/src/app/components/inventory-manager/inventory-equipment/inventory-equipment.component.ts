import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { EQUIPMENT, INVENTORY, INVENTORY_EQUIPMENT } from 'src/app/shared/data/inventory';
import { formatTextLating } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { RoleService } from 'src/app/shared/service/setting.service';
import { loadMedicalEquipment } from 'src/app/store/actions/medicalEquipment.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalEquipment from '../../../../../../at-common/model/MedicalEquipment';
import { InventoryAddDialogComponent } from '../inventory-supply/inventory-add-dialog/inventory-add-dialog.component';
import { EquipmentAddDialogComponent } from './equipment-add-dialog/equipment-add-dialog.component';

@Component({
  selector: 'app-inventory-equipment',
  templateUrl: './inventory-equipment.component.html',
  styleUrls: ['./inventory-equipment.component.scss']
})
export class InventoryEquipmentComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF;
  inventorys = [];
  inventoryFilter = [];
  nameSearch: string = null;
  conditionData = INVENTORY_EQUIPMENT;
  filterResult: { condition: string, conditionSelect: string, value: string, from: string, to: string } =
    { condition: 'date', conditionSelect: this.conditionData.date, value: null, from: null, to: null }
  renderSelect: Array<any> = [];
  medicalEquipmentList: MedicalEquipment[] = []
  constructor(
    private _modal: NgbModal,
    private dataService: RoleService,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService
  ) {
  }

  ngOnInit(): void {
    // this.getEquipment();
    this.onLoadMedicalEquipment();

  }

  onLoadMedicalEquipment = (): void => {
    this.store.dispatch(loadMedicalEquipment());
    this.store.select(state => state.medicalEquipment.medicalEquipmentList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalEquipment => {
        if (!medicalEquipment) return;
        this.inventorys = medicalEquipment;
        this.inventoryFilter = medicalEquipment;
        // medicalEquipment && (this.medicalEquipmentList = medicalEquipment)
        this.onFilter();
      })
  }

  getEquipment = (): void => {
    this.dataService.getEquipment().subscribe(equi => (equi && (this.inventorys = [...equi])))
  }

  onSearch(event): void {
    this.nameSearch = event;
    this.onFilter();
  }

  onFilterConditionChange = (): void => {
    Object.entries(INVENTORY_EQUIPMENT).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
  }

  onAddCondiotion = (): void => {
    let newFilter: any;
    if ((this.filterResult.condition && this.filterResult.value) ||
      (this.filterResult.condition && this.filterResult.from && this.filterResult.to)) {
      if (this.filterResult.condition == 'date') {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: null,
          from: this.filterResult.from,
          to: this.filterResult.to
        }
      } else {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: this.filterResult.value,
          from: null,
          to: null
        }
      }

      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }
      this.onFilter();
    }
  }

  onFilter = (): void => {
    let toDate = new Date(this.filterResult.to);
    toDate.setDate(toDate.getDate() + 1)

    this.inventorys = this.inventoryFilter.filter(
      (tag) =>
        (this.filterResult.from && this.filterResult.to
          ? Date.parse(this.filterResult.from) <= Date.parse(tag.createDateTime) &&
          Date.parse(toDate.toString()) >= Date.parse(tag.createDateTime)
          : true)
        &&
        (this.nameSearch
          ? (formatTextLating(tag.name).indexOf(formatTextLating(this.nameSearch)) > -1 ||
            formatTextLating(tag.origin).indexOf(formatTextLating(this.nameSearch)) > -1)
          : true)
    );
  }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    this.filterResult.from = null;
    this.filterResult.to = null;
    this.onFilter();

  }

  handleEventInventory = (): void => {
    const modalRef = this._modal.open(EquipmentAddDialogComponent, {
      scrollable: true,
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-equipment-backdrop',
      windowClass: 'inventory-equipment-window',
      centered: true
    }).result.then(result => {
      if (!result) { return }
    }).catch(error => { return error })
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên trang thiết bị',
    prop: 'name',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
    router: true,
  },
  {
    name: 'Đơn vị',
    prop: 'unit',
    width: 100,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Số lượng',
    prop: 'quantity',
    width: 100,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Đơn giá',
    prop: 'price',
    width: 100,
    colType: 'money',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Nguồn gốc',
    prop: 'origin',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Ngày nhập',
    prop: 'createDateTime',
    width: 150,
    colType: 'dateIso',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  }
];
