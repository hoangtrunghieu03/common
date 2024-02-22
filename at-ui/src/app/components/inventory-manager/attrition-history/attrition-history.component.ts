import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterModel } from 'src/app/shared/data/at.model';
import { onLoadMedicalSupplyHistory } from 'src/app/store/actions/medicalEquipment.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { ADJUST_WAREHORSE_REASON } from '../../../../../../at-common/model/enum';
import MedicalSupplyHistoryReport from '../../../../../../at-common/model/MedicalSupplyHistoryReport';
import MedicalSupplyHistoryReportDatas from '../../../../../../at-common/model/MedicalSupplyHistoryReportDatas';
import Room from '../../../../../../at-common/model/Room';
import { DestroySubsribeService } from '../../../shared/service/destroySubscribe.service';
import * as _ from 'lodash';

enum IMPORT_HISTORY_FILTER {
  time = 'Khoảng thời gian',
  room = 'Phòng'
}
@Component({
  selector: 'app-attrition-history',
  templateUrl: './attrition-history.component.html',
  styleUrls: ['./attrition-history.component.scss'],
})
export class AttritionHistoryComponent implements OnInit {

  colDef: Array<ColDef> = COL_DEF;
  importHistory: MedicalSupplyHistoryReportDatas[] = [];

  conditionData = IMPORT_HISTORY_FILTER;
  filterResult: FilterModel = null;
  renderSelect: Array<any> = [];
  filters = new MedicalSupplyHistoryReport();
  totalFooter: Array<{label: string, value: number}>;
  rooms: Room[] = [];

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.onAddFilterDate();
    this.onLoadRooms();
  }

  onLoadRooms = (): void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(room => {
        if (!room) return;
        this.rooms = room;
      })
  }

  onAddFilterDate = () => {
    let today = new Date();
    this.filterResult = {
      condition: 'time',
      conditionSelect: this.conditionData.time,
      value: null,
      fromDate: this.datePipe.transform(today.setDate(today.getDate() - 31), 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    }
    this.onAddCondiotion();
  }

  onLoadMedicalSupplyHistory = () => {
    let filter = { ...this.filters.filter }
    filter.reason = ADJUST_WAREHORSE_REASON.COMSUME;
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalSupplyHistory(this.filters));
    this.store.select(state => state.medicalEquipment.medicalSupplyHistory)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalSupplyHistory: MedicalSupplyHistoryReport) => {
        this.totalFooter = [];
        if (!medicalSupplyHistory || !medicalSupplyHistory.datas) return;
        const totalQty:number = _.sumBy(medicalSupplyHistory.datas, 'qty');
        const dataShowFooter: { label: string; value: number } = {
          label: 'Tổng số lượng tiêu hao',
          value: totalQty
        }
        this.totalFooter.push(dataShowFooter)
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
      } else {
        filter.room = this.filterResult.value;
      }
      this.filters.filter = filter;
      this.onLoadMedicalSupplyHistory();
    }
  };

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
    } else {
      filter.room = null;
    }
    this.filters.filter = filter;
    this.onLoadMedicalSupplyHistory();
  };

  getRoomId = (id: string): string => {
    return this.rooms?.find(room => room._id == id)?.name;
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
    router: false,
    path: '',
  },
  {
    name: 'MBN',
    prop: 'customerCode',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
    router: true,
    urlRoot: ["/benh-an/I", 'customerId']
  },
  {
    name: 'Tên vật tư',
    prop: 'name',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
    router: false,
    path: '',
  },
  {
    name: 'Số lượng tiêu hao',
    prop: 'qty',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
    router: false,
    path: '',
  },
  {
    name: 'Đơn vị',
    prop: 'unit',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
    router: false,
    path: '',
  },
  {
    name: 'Phòng tiêu hao',
    prop: 'room',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
    router: false,
    path: '',
  },
];
