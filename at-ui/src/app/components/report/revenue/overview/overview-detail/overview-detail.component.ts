import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { formatCurentcy, formatCurrencyNumber } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadReportRevenueGeneralDetail } from 'src/app/store/actions/report.action';
import { RootState } from 'src/app/store/entities/state.entity';
import ReportRevenue from '../../../../../../../../at-common/model/ReportRevenue';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import ReportRevenueCriterial from '../../../../../../../../at-common/model/ReportRevenueCriterial';
import { Location } from '@angular/common';

@Component({
  selector: 'app-overview-detail',
  templateUrl: './overview-detail.component.html',
  styleUrls: ['./overview-detail.component.scss'],
  providers: [DestroySubsribeService]
})
export class OverviewDetailComponent implements OnInit {

  columnDef = COL_DEF;
  revenueReport: Array<any> = [];
  conditionData = [{ value: 'Đã thu' }];
  filterResult = { condition: 'Tất cả'}
  collectMoney = true;
  hasTreatment = false;

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private activeRoute: ActivatedRoute,
    public location: Location
  ) {
    this.columnDef[1].summaryFunc = null;
    this.columnDef[2].summaryFunc = null;
    this.columnDef[3].summaryFunc = (cell: any) => `<b>${this.sumaryRevenue(cell)}</b>`;
    this.columnDef[4].summaryFunc = (cell: any) => `<b>${this.sumaryRevenue(cell)}</b>`;
    this.columnDef[0].summaryFunc = (cell: any) => { return '<b>Tổng</b>' }
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(param => {
      if (param && param.date) {
        this.onLoadReportGeneralDetail(param.date);
      }
    })
  }

  onLoadReportGeneralDetail = (date: string) => {
    let filters = new ReportRevenue();
    filters.filter = new ReportRevenueCriterial();
    filters.filter.fromDate = date;
    filters.filter.toDate = date;
    filters.filter.collectMoney = this.collectMoney;
    filters.filter.hasTreatment = this.hasTreatment;
    this.store.dispatch(onLoadReportRevenueGeneralDetail(filters));
    this.store.select(state => state.report.generalDetail)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((reportGeneral: ReportRevenue) => {
        if (!reportGeneral || !reportGeneral.generalDetails) return this.revenueReport = [];
        this.handleData(reportGeneral.generalDetails);
      })
  }

  onFilterHasTreatment(){
    this.hasTreatment = true;
    this.collectMoney = false
    this.activeRoute.queryParams.subscribe(param => {
      if (param && param.date) {
        this.onLoadReportGeneralDetail(param.date);
      }
    })
  }

  onFilterCollectMoney(){
    this.collectMoney = true;
    this.hasTreatment = false;
    this.activeRoute.queryParams.subscribe(param => {
      if (param && param.date) {
        this.onLoadReportGeneralDetail(param.date);
      }
    })
  }

  onAddCondiotion = (): void => {
    this.filterResult.condition === 'Chọn điều kiện' && this.collectMoney === true ? this.filterResult.condition = 'Đã thu' : "";
    let filter;
    filter = {
      key: this.filterResult.condition,
    }
    filter.key === 'Đã thu' ? this.collectMoney = true : "";
    this.activeRoute.queryParams.subscribe(param => {
      if (param && param.date) {
        this.onLoadReportGeneralDetail(param.date);
      }
    })
  }

  handleData = (data): void => {
    this.revenueReport = _.cloneDeep(data);
    this.revenueReport.filter(val => {
      val.income = formatCurentcy(val.income);
      val.debt = formatCurentcy(val.debt);
    })
  }

  onRemoveFilter = () =>{
     this.collectMoney = false;
     this.activeRoute.queryParams.subscribe(param => {
      if (param && param.date) {
        this.onLoadReportGeneralDetail(param.date);
      }
    })
  }

  sumaryRevenue = (cell): number | string => {
    const sum = cell.reduce((sum, cell) => (sum += formatCurrencyNumber(cell)), 0)
    return formatCurentcy(sum)
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên bệnh nhân',
    prop: 'customerName',
    width: 100,
    summaryFunc: cell => { return '<b>Tổng</b>' }
  },
  {
    name: 'Mã bệnh nhân',
    prop: 'customerCode',
    width: 100,
  },
  {
    name: 'Nội dung thực hiện',
    prop: 'treatment',
    width: 100,
  },
  {
    name: 'Đã thu',
    prop: 'income',
    width: 100,
    colType: 'money',
    router: false,
  },
  {
    name: 'Còn lại',
    prop: 'debt',
    width: 100,
    colType: 'money',
  },
];
