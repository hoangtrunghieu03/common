import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterModel } from 'src/app/shared/data/at.model';
import { OVERVIEW_REPORT_FILTER } from 'src/app/shared/data/report';
import { formatCurentcy, formatCurrencyNumber } from 'src/app/shared/functions/function-helper';
import { onLoadReportRevenueGeneral } from 'src/app/store/actions/report.action';
import { RootState } from 'src/app/store/entities/state.entity';
import ReportRevenue from '../../../../../../../at-common/model/ReportRevenue';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import { ChartModel } from '../../report.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [DestroySubsribeService]
})
export class OverviewComponent implements OnInit {

  limit: number = 10;
  columnDef = COL_DEF;
  revenueOverview: ChartModel = new ChartModel();

  conditionData = OVERVIEW_REPORT_FILTER;
  filterResult: FilterModel = {condition: 'time', conditionSelect: this.conditionData.time, value: null, fromDate: null, toDate: null}
  renderSelect: Array<any> = [];
  selected: Array<any> = [];
  filters = new ReportRevenue();

  revenueReport: Array<any> = [];

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private router: Router,
  ) {
    this.columnDef[2].summaryFunc =
    this.columnDef[3].summaryFunc = (cell: any) => `<b>${this.sumaryRevenue(cell)}</b>`;
    this.columnDef[0].summaryFunc = (cell: any) => { return '<b>Tổng</b>'}
  }

  ngOnInit(): void {
    this.onLoadReportGeneral();
  }

  onLoadReportGeneral = () => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadReportRevenueGeneral(this.filters));
    this.store.select(state => state.report.generals)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe((reportGeneral: ReportRevenue) => {
      if (!reportGeneral || !reportGeneral.general) return this.revenueReport = [];
      this.handleData(reportGeneral.general);
      this.onLoadChartConfig(reportGeneral.general);
    })
  }

  onLoadChartConfig = (data):void => {
    let chartData: any[] = [];
    this.revenueOverview.data = [];
    this.revenueOverview.label = [];
    data.filter(val => {
      chartData.push(val.revenue);
      this.revenueOverview.label.push(val.examinationDate);
    });
    this.revenueOverview.data = [
      {
        data: chartData,      
        label: null,
        fill: false,
        lineTension: 0.1,
        borderColor: "#00a8ff", // The main line color
        borderDashOffset: 0.0,
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        pointBackgroundColor: "#f99f2a"
      }
    ]
    this.revenueOverview.option = {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display : false
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          top: 0,
          bottom: 0
        },
      },
      scales: {
        xAxes: [{
          display: true,
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function (value) {
              let formatLabel: any = (value.toLocaleString() + ' ₫').split(',').join('.');
              return [formatLabel];
            }
          },
          barPercentage: 2
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let value: any = 'Tổng thu: ' + data.datasets[0].data[tooltipItem.index].
              toLocaleString().split(',').join('.') + ' ₫';
            return value;
          },
        },
      },

    };
  }

  handleData = (data): void => {
    this.revenueReport = _.cloneDeep(data);
    this.revenueReport.filter(val => {
      val.examinationDate = val.examinationDate
      val.revenue = formatCurentcy(val.revenue);
      val.income = formatCurentcy(val.income);
      val.debt = formatCurentcy(val.debt);
    })
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
      this.onLoadReportGeneral();
    }
  }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter }
    filter.fromDate = null;
    filter.toDate = null;
    this.filters.filter = filter;
    this.onLoadReportGeneral();
  }

  sumaryRevenue = (cell):number | string => {
    const sum = cell.reduce( (sum,cell) => (sum += formatCurrencyNumber(cell)), 0)
    return formatCurentcy(sum)
  }

  onSelectRow = (row) => {
    if (!row.examinationDate) return;
    let date = row.examinationDate.split('/')
    let navigationExtras: NavigationExtras = {
      queryParams: {
        date: date[2] + '-' + date[1] + '-' + date[0],
      }
    }
    this.router.navigate(['/bao-cao/doanh-thu/tong-quan/I'], navigationExtras);
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Ngày',
    prop: 'examinationDate',
    width: 100,
    colType: 'date',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: null,
    summaryFunc: cell => { return '<b>Tổng</b>' }
  },
  {
    name: 'Số bệnh nhân',
    prop: 'totalCustomer',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
    summaryFunc: (cell) => null
  },
  {
    name: 'Doanh thu',
    prop: 'revenue',
    width: 100,
    colType: 'money',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
    summaryFunc: null
  },
  {
    name: 'Nợ',
    prop: 'debt',
    width: 100,
    colType: 'money',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  }
];
