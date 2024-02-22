import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { STAFF_DETAIL_REPORT_FILTER } from 'src/app/shared/data/report';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { ReportService } from 'src/app/shared/service/report.service';
import { onLoadReportStaffDetail } from 'src/app/store/actions/report.action';
import { RootState } from 'src/app/store/entities/state.entity';
import ReportRevenue from '../../../../../../../at-common/model/ReportRevenue';
import ReportRevenueStaffDetail from '../../../../../../../at-common/model/ReportRevenueStaffDetail';
import { FilterContent } from '../../report.model';
import { loadStaffItem } from 'src/app/store/actions/staffs.action';
import Staffs from '../../../../../../../at-common/model/Staffs';


@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.scss']
})
export class StaffDetailComponent implements OnInit {

  columnDef = COL_DEF;
  conditionData = STAFF_DETAIL_REPORT_FILTER;
  filterResult: FilterContent = { condition: 'date', conditionSelect: this.conditionData.date, value: null, from: null, to: null }
  renderSelect: Array<any> = [];

  filters = new ReportRevenue();

  staffReport: Array<ReportRevenueStaffDetail> = null;

  staffItem: Staffs = new Staffs();

  constructor(
    private activeRoute: ActivatedRoute,
    public location: Location,
    private destroyService: DestroySubsribeService,
    private store: Store<RootState>,
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(param => {
      if (param) {
        let filter = { ...this.filters.filter };
        if (param._id) {
          filter.staffId = param._id;
          this.onLoadStaffItem(param._id);
        }
        if (param.fromDate && param.toDate) {
          filter.fromDate = param.fromDate;
          filter.toDate = param.toDate;
        }

        this.filters.filter = filter;
        this.onLoadReportStaffs();
      }
    })
  }

  onLoadStaffItem = (_id: string) => {
    this.store.dispatch(loadStaffItem({ staffId: _id }));
    this.store.select(state => state.staff.staffItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((staffs: Staffs) => {
        if (!staffs) return;
        this.staffItem = staffs;
      })
  }

  onLoadReportStaffs = () => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadReportStaffDetail(this.filters));
    this.store.select(state => state.report.staffDetail)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((reportStaffs: ReportRevenue) => {
        if (!reportStaffs || !reportStaffs.staffs) return this.staffReport = null;
        this.staffReport = reportStaffs.staffDetails;
      })
  }

  changeFilter = (): void => {

  }

  onAddFilter = (): void => {
    let newFilter;
    if ((this.filterResult.condition && this.filterResult.value) ||
      (this.filterResult.condition && this.filterResult.from && this.filterResult.to)) {
      newFilter = {
        id: Date.now(),
        key: this.filterResult.condition,
        firstCondition: this.filterResult.conditionSelect,
        secondCondition: null,
        from: this.filterResult.from,
        to: this.filterResult.to
      }
      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }

      let filter = { ...this.filters.filter };

      filter.fromDate = String(this.filterResult.from);
      filter.toDate = String(this.filterResult.to);

      this.filters.filter = filter;
      this.onLoadReportStaffs();
    }
  }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter };

    filter.fromDate = null;
    filter.toDate = null;

    this.filters.filter = filter;
    this.onLoadReportStaffs();
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Thời gian',
    prop: 'examinationDate',
    width: 100,
  },
  {
    name: 'Bệnh nhân',
    prop: 'customerName',
    width: 100,
  },
  {
    name: 'Chỉ định thực hiện',
    prop: 'performIndicate',
    width: 100,
  },
  {
    name: 'Dịch vụ',
    prop: 'serviceName',
    width: 100,
  }
];