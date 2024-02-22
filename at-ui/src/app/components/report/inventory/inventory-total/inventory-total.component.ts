import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterModel } from 'src/app/shared/data/at.model';
import { INVENTORY_REPORT_FILTER } from 'src/app/shared/data/report';
import { ReportService } from 'src/app/shared/service/report.service';
import ReportSupply from '../../../../../../../at-common/model/ReportSupply';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import { onLoadReportSupplyInventory } from '../../../../store/actions/report.action';
import { RootState } from '../../../../store/entities/state.entity';
import { formatCurentcy, formatCurrencyNumber } from 'src/app/shared/functions/function-helper';
import * as _ from 'lodash';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory-total.component.html',
  styleUrls: ['./inventory-total.component.scss'],
  providers: [DestroySubsribeService]
})
export class InventoryTotalComponent implements OnInit {

  columnDef: ColDef[] = COL_DEF;
  conditionData = INVENTORY_REPORT_FILTER;
  filterResult: FilterModel = {condition: 'time', conditionSelect: this.conditionData.time, value: null, fromDate: null, toDate: null}
  inventory: any[] = [];
  renderSelect: Array<any> = [];
  filters = new ReportSupply();

  constructor(
    private dataService: ReportService,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService
  ) {
      this.columnDef[5].summaryFunc = (cell: any) => `<b>${this.sumaryRevenue(cell)}</b>`;
      this.columnDef[0].summaryFunc = (cell: any) => { return '<b>Tổng</b>'}
  }

  ngOnInit(): void {
    this.onLoadReportInventory();
  }

  onLoadReportInventory = () => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadReportSupplyInventory(this.filters));
    this.store.select(state => state.report.inventory)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(reportInventory => {
      if (!reportInventory || !reportInventory['supplies']) return this.inventory = [];
      this.handleData(reportInventory['supplies']);
    })
  }

  onSearch(event):void{
    let filter = { ...this.filters.filter}
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadReportInventory();
  }

  onFilterConditionChange = ():void => {

  }

  onAddCondiotion = (): void => {
    let newFilter;
    if ((this.filterResult.condition && this.filterResult.value) ||
      (this.filterResult.condition && this.filterResult.fromDate && this.filterResult.toDate)) {
      newFilter = {
        id: Date.now(),
        key: this.filterResult.condition,
        firstCondition: this.filterResult.conditionSelect,
        secondCondition: null,
        from: this.filterResult.fromDate,
        to: this.filterResult.toDate
      }
      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }
      let filter = { ...this.filters.filter }
      filter.fromDate = this.filterResult.fromDate;
      filter.toDate = this.filterResult.toDate;
      this.filters.filter = filter;
      this.onLoadReportInventory();
    }
  }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter }
    filter.fromDate = null;
    filter.toDate = null;
    this.filters.filter = filter;
    this.onLoadReportInventory();
  }

  sumaryRevenue = (cell): number | string => {
    const sum = cell.reduce((sum, cell) => (sum += formatCurrencyNumber(cell)), 0)
    return formatCurentcy(sum)
  }

  handleData = (data): void => {
    this.inventory = _.cloneDeep(data)
    this.inventory.filter(val => {
      val.totalUse = formatCurentcy(val.totalUse);
    })
    this.inventory.sort((a, b) => a.name.trim().localeCompare(b.name.trim()));
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên',
    prop: 'name',
    width: 150,
    summaryFunc: cell => { return '<b>Tổng</b>' }
  },
  {
    name: 'Số lượng đầu kỳ',
    prop: 'quantity',
    width: 150,
    summaryFunc: (cell) => null
  },
  {
    name: 'Đơn vị',
    prop: 'unit',
    width: 100,
    summaryFunc: (cell) => null
  },
  {
    name: 'Số lượng tiêu thụ',
    prop: 'quantityUsed',
    width: 150,
    summaryFunc: (cell) => null
  },
  {
    name: 'Số lượng cuối kỳ',
    prop: 'quantityRemain',
    width: 150,
    summaryFunc: (cell) => null
  },
  {
    name: 'Phí',
    prop: 'totalUse',
    colType: 'money',
    width: 150
  }
];
