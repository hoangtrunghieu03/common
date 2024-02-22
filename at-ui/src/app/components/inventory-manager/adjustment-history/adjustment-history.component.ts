import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterModel } from 'src/app/shared/data/at.model';
import { OVERVIEW_REPORT_FILTER } from 'src/app/shared/data/report';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadMedicalSupplyHistory } from 'src/app/store/actions/medicalEquipment.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { ADJUST_WAREHORSE_REASON } from '../../../../../../at-common/model/enum';
import MedicalSupplyHistoryReport from '../../../../../../at-common/model/MedicalSupplyHistoryReport';
import MedicalSupplyHistoryReportDatas from '../../../../../../at-common/model/MedicalSupplyHistoryReportDatas';

@Component({
  selector: 'app-adjustment-history',
  templateUrl: './adjustment-history.component.html',
  styleUrls: ['./adjustment-history.component.scss']
})
export class AdjustmentHistoryComponent implements OnInit {
  colDef: Array<ColDef> = COL_DEF;
  adjustHistory: MedicalSupplyHistoryReportDatas[] = [];

  conditionData = OVERVIEW_REPORT_FILTER;
  filterResult: FilterModel = { condition: 'time', conditionSelect: this.conditionData.time, value: null, fromDate: null, toDate: null }
  renderSelect: Array<any> = [];
  filters = new MedicalSupplyHistoryReport();

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.onLoadMedicalSupplyHistory();
  }

  onLoadMedicalSupplyHistory = () => {
    let filter = { ...this.filters.filter }
    filter.reason = ADJUST_WAREHORSE_REASON.ADJUST;
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalSupplyHistory(this.filters));
    this.store.select(state => state.medicalEquipment.medicalSupplyHistory)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalSupplyHistory => {
        if (!medicalSupplyHistory || !medicalSupplyHistory['datas']) return;
        this.adjustHistory = medicalSupplyHistory['datas'];
      })
  }

  onSearch(event): void {
    let filter = { ...this.filters.filter }
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadMedicalSupplyHistory();
  }

  onAddCondiotion = (): void => {
    if (this.filterResult.condition &&
      this.filterResult.fromDate &&
      this.filterResult.toDate) {
      let newFilter: any = {
        id: Date.now(),
        key: this.filterResult.condition,
        firstCondition: this.filterResult.conditionSelect,
        secondCondition: null,
        from: this.filterResult.fromDate,
        to: this.filterResult.toDate,
      };
      let isIncludes = this.renderSelect.findIndex((item) => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }
      let filter = { ...this.filters.filter }
      filter.dateFrom = this.filterResult.fromDate;
      filter.dateTo = this.filterResult.toDate;
      this.filters.filter = filter;
      this.onLoadMedicalSupplyHistory();
    }
  };

  onFilterConditionChange = (): void => {

  };

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter((x) => x.key != param.key);
    let filter = { ...this.filters.filter }
    filter.dateFrom = null;
    filter.dateTo = null;
    this.filters.filter = filter;
    this.onLoadMedicalSupplyHistory();
  };
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Ngày',
    prop: 'date',
    width: 200,
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
    name: 'Số lượng điều chỉnh',
    prop: 'qty',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Đơn vị',
    prop: 'unit',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Người điều chỉnh',
    prop: 'staff',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
];