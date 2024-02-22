import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterModel, PRINT_TYPE } from 'src/app/shared/data/at.model';
import { OVERVIEW_REPORT_FILTER } from 'src/app/shared/data/report';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadMedicalSupplyHistory } from 'src/app/store/actions/medicalEquipment.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { ADJUST_WAREHORSE_REASON } from '../../../../../../at-common/model/enum';
import MedicalSupplyHistoryReport from '../../../../../../at-common/model/MedicalSupplyHistoryReport';
import MedicalSupplyHistoryReportDatas from '../../../../../../at-common/model/MedicalSupplyHistoryReportDatas';
import Room from '../../../../../../at-common/model/Room';
import * as _ from 'lodash';
import { PrintService } from 'src/app/shared/service/print.service';

enum EXPORT_HISTORY_FILTER {
  time = 'Khoảng thời gian',
  room = 'Phòng xuất'
}
@Component({
  selector: 'app-export-history',
  templateUrl: './export-history.component.html',
  styleUrls: ['./export-history.component.scss'],
})
export class ExportHistoryComponent implements OnInit {
  colDef: Array<ColDef> = COL_DEF;
  exportHistory: MedicalSupplyHistoryReportDatas[] = [];

  conditionData = EXPORT_HISTORY_FILTER;
  filterResult: FilterModel = { condition: 'time', conditionSelect: this.conditionData.time, value: null, fromDate: null, toDate: null }
  renderSelect: Array<any> = [];
  filters = new MedicalSupplyHistoryReport();

  exportHistorySelected = [];

  rooms: Room[] = [];

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private printService: PrintService
  ) { }

  ngOnInit(): void {
    this.onLoadMedicalSupplyHistory();
    this.onLoadRooms();
  }

  onLoadRooms = (): void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(room => {
        this.rooms = room;
      })
  }

  onLoadMedicalSupplyHistory = () => {
    let filter = { ...this.filters.filter }
    filter.reason = ADJUST_WAREHORSE_REASON.EXPORT;
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalSupplyHistory(this.filters));
    this.store.select(state => state.medicalEquipment.medicalSupplyHistory)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalSupplyHistory: MedicalSupplyHistoryReport) => {
        if (!medicalSupplyHistory || !medicalSupplyHistory.datas) return;
        this.exportHistory = medicalSupplyHistory.datas;
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
      if (this.filterResult.conditionSelect == EXPORT_HISTORY_FILTER.time) {
        filter.dateFrom = this.filterResult.fromDate;
        filter.dateTo = this.filterResult.toDate;
      } else {
        filter.room = this.filterResult.value;
      }
      this.filters.filter = filter;
      this.onLoadMedicalSupplyHistory();
    }
  };

  onFilterConditionChange = (): void => {
    Object.entries(EXPORT_HISTORY_FILTER).map(([key, value]) => {
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
    if (param.firstCondition == EXPORT_HISTORY_FILTER.time) {
      filter.dateFrom = null;
      filter.dateTo = null;
    } else {
      filter.room = null;
    }
    this.filters.filter = filter;
    this.onLoadMedicalSupplyHistory();
  };

  onSelectRow = (rowSelected) => {
    this.exportHistorySelected = _.cloneDeep(rowSelected);
  }

  onHandlePrint = () => {
    let printDatas = {
      title: 'Lịch sử xuất',
      data: this.exportHistorySelected,
      columnDef: this.colDef
    };
    this.printService.onGetExportHistoryDataPrint(JSON.stringify(printDatas));
    this.printService.onPrint(null, PRINT_TYPE.INVENTORY_HISTORY);
  }

  getRoomId = (id: string): string => {
    return this.rooms?.find(room => room._id == id)?.name;
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Ngày',
    prop: 'date',
    width: 100,
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
    name: 'Số lượng đề xuất',
    prop: 'reqQty',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Số lượng xuất',
    prop: 'qty',
    width: 100,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: center ',
  },
  {
    name: 'Đơn vị',
    prop: 'unit',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Phòng xuất đến',
    prop: 'room',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Người xuất',
    prop: 'staff',
    width: 160,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
];
