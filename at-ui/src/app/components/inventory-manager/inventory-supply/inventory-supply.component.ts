import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterModel, PRINT_TYPE } from 'src/app/shared/data/at.model';
import { INVENTORY_SUPPLY, SOURCE } from 'src/app/shared/data/inventory';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onAdjustMedicalInput, onCreateMedicalSupply, onExportMedicalSupply, onLoadMedicalSupplyFilter , onLoadMedicalSupplyUnit } from 'src/app/store/actions/medicalSupply.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import MedicalSupply from '../../../../../../at-common/model/MedicalSupply';
import MedicalSupplyCriterial from '../../../../../../at-common/model/MedicalSupplyCriterial';
import MedicalSupplyReport from '../../../../../../at-common/model/MedicalSupplyReport';
import Room from '../../../../../../at-common/model/Room';
import { RootState } from '../../../store/entities/state.entity';
import { InventoryAddDialogComponent } from './inventory-add-dialog/inventory-add-dialog.component';
import { InventorySupplyAdjustmentComponent } from './inventory-supply-adjustment/inventory-supply-adjustment.component';
import { InventorySupplyExportComponent } from './inventory-supply-export/inventory-supply-export.component';
import { PrintService } from 'src/app/shared/service/print.service';

enum COMPARISON_VALUE {
  BEFORE = 'Trước',
  DURING = 'Trong khoảng',
  AFTER = 'Sau',
}
@Component({
  selector: 'app-inventory-supply',
  templateUrl: './inventory-supply.component.html',
  styleUrls: ['./inventory-supply.component.scss']
})
export class InventorySupplyComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF;
  medicalSupplyList: Array<MedicalSupply> = [];
  conditionData = INVENTORY_SUPPLY;
  secondConditionData = COMPARISON_VALUE;
  originList: any = SOURCE;
  filterResult: FilterModel = { condition: 'expDate', conditionSelect: this.conditionData.expDate, secondConditionSelect: COMPARISON_VALUE.DURING, value: null, fromDate: null, toDate: null };
  renderSelect: Array<any> = [];
  filters = new MedicalSupplyReport()
  rooms: Room[] = [];
  medicalSupply :{label : string , value: string | any}[] = [];

  limit: number = 10;

  selected = [];

  constructor(
    private _modal: NgbModal,
    private store: Store<RootState>,
    private modal: NgbModal,
    private printService: PrintService,
    private destroyService: DestroySubsribeService
  ) {
  }

  ngOnInit(): void {
    this.onLoadMedicalSupplyReport();
    this.onLoadRooms();
    this.onLoadMedicalSupplyUnit();
  }

  onLoadRooms = (): void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(room => {
        if (!room) return;
        this.rooms = room;
      });
  }

  onLoadMedicalSupplyUnit = () =>{
    this.store.dispatch(onLoadMedicalSupplyUnit());
    this.store.select(state => state.medicalSupply.medicalSupplyUnit)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(medicalSupplyUnit =>{
      if(!medicalSupplyUnit) return this.medicalSupply = [];
      this.medicalSupply = [];
       medicalSupplyUnit.forEach((item) =>{
        this.medicalSupply.push({label: item.medicalSupplyOrigin , value : item.medicalSupplyOrigin})
       })
    })
  }

  onLoadMedicalSupplyReport = () => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalSupplyFilter(this.filters));

    this.store.select(state => state.medicalSupply.medicalSupplyFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSupplyList => {
        if (!medicalSupplyList) return this.medicalSupplyList = [];
        this.medicalSupplyList = _.cloneDeep(medicalSupplyList.slice().sort((a, b) => a.name?.trim()?.localeCompare(b?.name?.trim())));
      })
  }

  onSearch(event): void {
    let filter = { ...this.filters.filter };
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadMedicalSupplyReport();
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onFrintFile= () => {
    let printDatas = {
      title: 'Danh sách vật dụng tiêu hao',
      data: this.selected,
      columnDef: this.columnDef
    };
    this.printService.onGetExportHistoryDataPrint(JSON.stringify(printDatas));
    this.printService.onPrint(null, PRINT_TYPE.INVENTORY_HISTORY);
  }

  onFilterConditionChange = (): void => {
    Object.entries(INVENTORY_SUPPLY).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.fromDate = null;
    this.filterResult.toDate = null;
  }

  onAddCondition = (): void => {
    if ((this.filterResult.condition && this.filterResult.value) ||
      (this.filterResult.condition == 'expDate' && ((this.filterResult.secondConditionSelect == COMPARISON_VALUE.DURING && this.filterResult.fromDate && this.filterResult.toDate) ||
      (this.filterResult.secondConditionSelect == COMPARISON_VALUE.BEFORE && this.filterResult.fromDate) ||
      (this.filterResult.secondConditionSelect == COMPARISON_VALUE.AFTER && this.filterResult.toDate)))) {
      let newFilter: any = null;
      if (this.filterResult.condition == 'expDate') {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: this.filterResult.secondConditionSelect,
          from: this.filterResult.fromDate,
          to: this.filterResult.toDate
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
      let isIncludes = this.renderSelect.findIndex((item) => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }

      let filter = { ...this.filters.filter };
      if (this.filterResult.conditionSelect == INVENTORY_SUPPLY.expDate) {
        filter.expDateFrom = null;
        filter.expDateTo = null;
        filter.expBeforeDate = null;
        filter.expAfterDate = null;
        if (this.filterResult.secondConditionSelect == COMPARISON_VALUE.DURING) {
          filter.expDateFrom = this.filterResult.fromDate;
          filter.expDateTo = this.filterResult.toDate;
        } else if (this.filterResult.secondConditionSelect == COMPARISON_VALUE.BEFORE) {
          filter.expBeforeDate = this.filterResult.fromDate;
        } else {
          filter.expAfterDate = this.filterResult.toDate;
        }
      } else if (this.filterResult.conditionSelect == INVENTORY_SUPPLY.origin) {
        filter.origin = this.filterResult.value
      } else if (this.filterResult.conditionSelect == INVENTORY_SUPPLY.quantity){
        filter.alertSupply = true
      }else {
        filter.roomId = this.filterResult.value;
      }
      this.filters.filter = filter;
      this.onLoadMedicalSupplyReport();
    }
  };

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter };
    if (param.firstCondition == INVENTORY_SUPPLY.expDate) {
      filter.expDateFrom = null;
      filter.expDateTo = null;
      filter.expBeforeDate = null;
      filter.expAfterDate = null;
    }
    else if(param.firstCondition == INVENTORY_SUPPLY.origin){
      filter.origin = null;
    }
    else if(param.firstCondition == INVENTORY_SUPPLY.quantity){
      filter.alertSupply = null;
    }
    else {
      filter.roomId = null;
    }
    this.filters.filter = filter;
    this.onLoadMedicalSupplyReport();
  }

  handleEventInventory = (): void => {
    const modalRef = this._modal.open(InventoryAddDialogComponent, {
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-backdrop',
      windowClass: 'inventory-window',
      centered: true
    }).result.then(result => {
      if (!result) { return }
      this.store.dispatch(onCreateMedicalSupply({ medicalSupply: result, medicalSupplyFilter: _.cloneDeep(this.filters) }));
    }).catch(error => { return error })
  }

  handleEventAdjust = () => {
    const modalRef = this._modal.open(InventorySupplyAdjustmentComponent, {
      scrollable: true,
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-backdrop',
      windowClass: 'inventory-window',
      centered: true
    }).result.then(result => {
      if (!result) { return }
      this.store.dispatch(onAdjustMedicalInput({ medicalSupply: result, medicalSupplyFilter: _.cloneDeep(this.filters) }));
    }).catch(error => { return error })
  }

  handleEventExport = () => {
    const modalRef = this._modal.open(InventorySupplyExportComponent, {
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-backdrop',
      windowClass: 'inventory-window',
      centered: true
    }).result.then(result => {
      if (!result) { return }
      this.store.dispatch(onExportMedicalSupply({ medicalSupply: result, medicalSupplyFilter: _.cloneDeep(this.filters) }));
    }).catch(error => { return error })
  }

  getRoomId = (id: string): string => {
    return this.rooms?.find(room => room._id == id)?.name;
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên vật dụng',
    prop: 'name',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
    router: true,
  },
  {
    name: 'Đơn giá',
    prop: 'price',
    width: 150,
    colType: 'money',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Đơn vị cung cấp',
    prop: 'origin',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'HSD',
    prop: 'expDate',
    width: 150,
    colType: 'date',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Số lượng',
    prop: 'quantity',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Số lượng tối thiểu',
    prop: 'minQuantity',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
];
