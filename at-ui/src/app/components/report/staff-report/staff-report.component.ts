import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { STAFF_REPORT_FILTER } from 'src/app/shared/data/report';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { ReportService } from 'src/app/shared/service/report.service';
import { onLoadStaffFilter } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import StaffCriterial from '../../../../../../at-common/model/StaffCriterial';
import StaffData from '../../../../../../at-common/model/StaffData';
import StaffReport from '../../../../../../at-common/model/StaffReport';
import { ChartModel, FilterContent } from "../report.model";
import ReportRevenue from '../../../../../../at-common/model/ReportRevenue';
import { onLoadReportStaffs } from 'src/app/store/actions/report.action';
import DashBoardChartData from '../../../../../../at-common/model/DashBoardChartData';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-staffs',
  templateUrl: './staff-report.component.html',
  styleUrls: ['./staff-report.component.scss']
})
export class StaffReportComponent implements OnInit {

  columnDef = COL_DEF;
  staffAttr: ChartModel = new ChartModel();
  conditionData = STAFF_REPORT_FILTER;
  filterResult: FilterContent = { condition: 'date', conditionSelect: this.conditionData.date, value: null, from: null, to: null }
  staffReport: DashBoardChartData[] = null;
  renderSelect: Array<any> = [];
  staffList: Array<StaffData> = [];
  isLoading: boolean = false;
  limit: number = 10;

  filters = new ReportRevenue();

  constructor(
    private dataService: ReportService,
    private destroyService: DestroySubsribeService,
    private store: Store<RootState>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.onLoadReportStaffs();
    this.onLoadStaffs();
  }

  onLoadReportStaffs = () => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadReportStaffs(this.filters));
    this.store.select(state => state.report.staffs)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((reportStaffs: ReportRevenue) => {
        if (!reportStaffs || !reportStaffs.staffs) return this.staffReport = null;
        this.staffReport = reportStaffs.staffs
        this.isLoading = true;
        this.onLoadChartConfig(reportStaffs.staffs);
      })
  }

  onLoadStaffs = (): void => {
    let filter = new StaffReport();
    filter.filter = new StaffCriterial();
    this.store.dispatch(onLoadStaffFilter(filter))
    this.store.select(state => state.staff.staffFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(staff => staff && (this.staffList = staff.datas));
  }

  onLoadChartConfig = (data): void => {
    this.staffAttr.data = [];
    this.staffAttr.label = [];
    data.filter(val => {
      this.staffAttr.data.push(val.value);
      this.staffAttr.label.push(val.name);
    });
    this.staffAttr.option = {
      responsive: true,
      maintainAspectRatio: false,
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
              // let formatLabel: any = (value.toLocaleString() + ' ₫').split(',').join('.');
              return [value];
            }
          },
          barPercentage: 2
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let value: any = 'Số luợng: ' + data.datasets[0].data[tooltipItem.index];
            return value;
          },
        },
      },

    };
    this.staffAttr.color = [
      {
        borderColor: 'black',
        backgroundColor: '#006199',
        hoverBackgroundColor: '#f99f2a'
      }]
  }

  changeFilter = (): void => {
    Object.entries(STAFF_REPORT_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.from = null;
    this.filterResult.to = null;
  }

  onAddFilter = (): void => {
    let newFilter;
    if ((this.filterResult.condition && this.filterResult.value) ||
      (this.filterResult.condition && this.filterResult.from && this.filterResult.to)) {
      if (this.filterResult.condition == 'staff') {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: this.filterResult.value,
          from: null,
          to: null
        }
      } else {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: null,
          from: this.filterResult.from,
          to: this.filterResult.to
        }
      }
      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }

      let filter = { ...this.filters.filter };
      if (this.filterResult.condition == 'staff') {
        filter.staffId = this.filterResult.value;
      } else {
        filter.fromDate = String(this.filterResult.from);
        filter.toDate = String(this.filterResult.to);
      }

      this.filters.filter = filter;
      this.onLoadReportStaffs();
    }
  }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter };
      if (param.firstCondition == STAFF_REPORT_FILTER.staff) {
        filter.staffId = null;
      } else {
        filter.fromDate = null;
        filter.toDate = null;
      }

      this.filters.filter = filter;
      this.onLoadReportStaffs();
  }

  onSelectRow(row) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: row.id,
        fromDate: this.filters.filter.fromDate,
        toDate: this.filters.filter.toDate,
      }
    }

    this.router.navigate(['/bao-cao/nhan-vien/I'], navigationExtras);
  }

  getStaffNameById = (id): string => {
    let staffName: string = this.staffList.find(x => x.staffId === id)?.fullName;
    return staffName;
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Nhân viên',
    prop: 'name',
    width: 100,
    router: true,
    path: 'I',
  },
  {
    name: 'Số bệnh nhân',
    prop: 'value',
    width: 100,
  },
  {
    name: 'Doanh thu',
    prop: 'revenue',
    width: 100,
    colType: 'money'
  }
];