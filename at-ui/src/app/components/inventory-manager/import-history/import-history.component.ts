import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { onLoadMedicalSupplyHistory, onLoadUnitSupplyHistory } from 'src/app/store/actions/medicalEquipment.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalSupplyHistoryReport from '../../../../../../at-common/model/MedicalSupplyHistoryReport';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from '../../../shared/service/destroySubscribe.service';
import { OVERVIEW_REPORT_FILTER } from 'src/app/shared/data/report';
import { FilterModel, PRINT_TYPE } from 'src/app/shared/data/at.model';
import MedicalSupplyHistoryReportDatas from '../../../../../../at-common/model/MedicalSupplyHistoryReportDatas';
import { ADJUST_WAREHORSE_REASON } from '../../../../../../at-common/model/enum';
import MedicalSupplyHistory from '../../../../../../at-common/model/MedicalSupplyHistory';
import * as _ from 'lodash';
import { PrintService } from 'src/app/shared/service/print.service';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import Room from '../../../../../../at-common/model/Room';

enum IMPORT_HISTORY_FILTER {
  time = 'Khoảng thời gian',
  unit = 'Đơn vị cung cấp',
  reason = 'Loại hàng'
}
enum TYPE_WAREHORSE_REASON {
  input = ADJUST_WAREHORSE_REASON.INPUT,
  return = ADJUST_WAREHORSE_REASON.RETURN,
}
@Component({
  selector: 'app-import-history',
  templateUrl: './import-history.component.html',
  styleUrls: ['./import-history.component.scss'],
})
export class ImportHistoryComponent implements OnInit {

  colDef: Array<ColDef> = COL_DEF;
  importHistory: MedicalSupplyHistoryReportDatas[] = [];

  conditionData = IMPORT_HISTORY_FILTER;
  typeWarahorse = TYPE_WAREHORSE_REASON;
  filterResult: FilterModel = { condition: 'reason', conditionSelect: this.conditionData.reason, value: null, fromDate: null, toDate: null }
  renderSelect: Array<any> = [];
  filters = new MedicalSupplyHistoryReport();
  rooms: Room[] = [];
  unitList: MedicalSupplyHistory[] = [];

  importHistorySelected = [];

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private printService: PrintService
  ) { }

  ngOnInit(): void {
    let filter = { ...this.filters.filter }
    filter.reason = ADJUST_WAREHORSE_REASON.INPUT;
    this.filters.filter = filter;
    this.onLoadRooms();
    this.onLoadMedicalSupplyHistory();
    this.onLoadUnits();
  }
  onLoadRooms = (): void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(room => {
        this.rooms = room;
      })
  }
  onLoadUnits = (): void => {
    this.store.dispatch(onLoadUnitSupplyHistory());
    this.store.select(state => state.medicalEquipment.medicalUnitSupplyHistory)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(unit => {
        if (!unit) return;
        this.unitList = unit;
      })
  }

  onLoadMedicalSupplyHistory = () => {
    this.store.dispatch(onLoadMedicalSupplyHistory(this.filters));
    this.store.select(state => state.medicalEquipment.medicalSupplyHistory)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalSupplyHistory: MedicalSupplyHistoryReport) => {
        if (!medicalSupplyHistory || !medicalSupplyHistory.datas) return;
        this.importHistory = medicalSupplyHistory.datas;
      })
  }

  onSearch(event): void {
    let filter = { ...this.filters.filter }
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadMedicalSupplyHistory();
  }

  onAddCondiotion = (): void => {
    if ((this.filterResult.condition && this.filterResult.value) || (this.filterResult.condition &&
      this.filterResult.fromDate && this.filterResult.toDate)) {
      let newFilter;

      if (this.filterResult.condition == 'time') {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: null,
          from: this.filterResult.fromDate,
          to: this.filterResult.toDate,
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

      let filter = { ...this.filters.filter }
      if (this.filterResult.conditionSelect == IMPORT_HISTORY_FILTER.time) {
        filter.dateFrom = this.filterResult.fromDate;
        filter.dateTo = this.filterResult.toDate;
      } else if(this.filterResult.conditionSelect == IMPORT_HISTORY_FILTER.reason) {
        filter.reason = this.filterResult.value;
      } else {
        filter.origin = this.filterResult.value;
      }
      this.filters.filter = filter;
      this.onLoadMedicalSupplyHistory();
    }
  };
  checkConditions(): boolean {
    return this.renderSelect.some((obj) => obj.key === 'reason' && obj.secondCondition === ADJUST_WAREHORSE_REASON.RETURN);
  }
  onFilterConditionChange = (): void => {
    Object.entries(IMPORT_HISTORY_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.fromDate = null;
    this.filterResult.toDate = null;
  };

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter((x) => x.key != param.key);
    let filter = { ...this.filters.filter }
    if (param.firstCondition == IMPORT_HISTORY_FILTER.time) {
      filter.dateFrom = null;
      filter.dateTo = null;
    } else if(param.firstCondition == IMPORT_HISTORY_FILTER.reason) {
      filter.reason = null;
    } else {
      filter.origin = null;
    }
    this.filters.filter = filter;
    this.onLoadMedicalSupplyHistory();
  };

  onSelectRow = (rowSelected) => {
    this.importHistorySelected = _.cloneDeep(rowSelected);
  }

  onHandlePrint = () => {
    let printDatas = {
      title: 'Lịch sử nhập',
      data: this.importHistorySelected,
      columnDef: this.colDef
    };
    this.printService.onGetExportHistoryDataPrint(JSON.stringify(printDatas));
    this.printService.onPrint(null, PRINT_TYPE.INVENTORY_HISTORY);
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Ngày',
    prop: 'date',
    width: 150,
    colType: 'date',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Tên vật tư',
    prop: 'name',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Số lượng nhập',
    prop: 'qty',
    width: 100,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: center',
  },
  {
    name: 'Đơn vị cung cấp',
    prop: 'origin',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Người nhập',
    prop: 'staff',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
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
    name: 'Tổng',
    prop: 'total',
    width: 150,
    colType: 'money',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  }
];
