import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterModel, FilterParam } from 'src/app/shared/data/at.model';
import { APPOINTMENT_FILTER, APPOINTMENT_STATUS } from 'src/app/shared/data/schedule';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { ScheduleModalComponent } from 'src/app/shared/modal/schedule-modal/schedule-modal.component';
import { AppointmentScheduleService } from 'src/app/shared/service/appointment-schedule.service';
import { onCreateMedicalSchedule, onLoadMedicalScheduleFilter, onLoadMedicalScheduleStatusWait, onMedicalScheduleReminder } from 'src/app/store/actions/medicalSchedule.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { SCHEDULE_STATUS, TYPE_SCHEDULE } from '../../../../../at-common/model/enum';
import MedicalSchedule from '../../../../../at-common/model/MedicalSchedule';
import MedicalScheduleReport from '../../../../../at-common/model/MedicalScheduleReport';
import Staffs from '../../../../../at-common/model/Staffs';
import { DestroySubsribeService } from '../../shared/service/destroySubscribe.service';
import { RootState } from '../../store/entities/state.entity';
import { DatePipe } from '@angular/common';
import { onLoadServiceRequest } from '../../store/actions/serviceRequest.action';
import { formatPhoneNumber } from 'src/app/shared/functions/function-helper';
import * as _ from 'lodash';
import { NavigationExtras, Router } from '@angular/router';
import { AppointmentConfirmDialogComponent } from './appointment-confirm-dialog/appointment-confirm-dialog.component';

@Component({
  selector: 'app-appointment-schedule',
  templateUrl: './appointment-schedule.component.html',
  styleUrls: ['./appointment-schedule.component.scss'],
  providers: [DestroySubsribeService, DatePipe]
})
export class AppointmentScheduleComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF;
  scheduleList: Array<any> = [];
  lenghtScheduleWait: number;
  staffs: Staffs[] = [];

  conditionData = APPOINTMENT_FILTER;
  filterResult: FilterParam = {condition: 'status', conditionSelect: this.conditionData.status, value: null, fromDate: null, toDate: null}
  renderSelect: Array<any> = [];
  status = APPOINTMENT_STATUS;
  scheduleType = TYPE_SCHEDULE;
  filters = new MedicalScheduleReport();
  textSearch : string = '';
  inDataStart: boolean = false;
  scheduleStatus = SCHEDULE_STATUS;
  limit: number = 10;

  formatPhoneNumber = formatPhoneNumber;

  constructor(
    private appService: AppointmentScheduleService,
    private _modal: NgbModal,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private datePipe: DatePipe,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.onLoadMedicalScheduleStatusWait();
    this.onLoadMedicalSchedule();

  }

  onAddFilterDate = () => {
    let today = new Date();
    this.filterResult = {
      condition: 'time',
      conditionSelect: this.conditionData.time,
      value: null,
      fromDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(today.setDate(today.getDate() + 7), 'yyyy-MM-dd')
    }
    this.onAddCondiotion();
  }

  onLoadMedicalSchedule = (): void => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalScheduleFilter(this.filters));
    this.store.select(state => state.medicalSchedule.medicalScheduleFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalScheduleFilter => {
        if (!medicalScheduleFilter) return this.scheduleList = [];
        this.scheduleList = medicalScheduleFilter?.map((item) => { return { ...item, ...{ date: this.getDayOfDate(item.scheduleTime)}}});
      }
      )
  }
  onLoadMedicalScheduleStatusWait = (): void => {
    let filters =  new MedicalScheduleReport();
    let filter = { ...filters.filter }
    filter.status = SCHEDULE_STATUS.WAIT_ACCEPT
    filters.filter = filter;
    this.store.dispatch(onLoadMedicalScheduleStatusWait(filters));
    this.store.select(state => state.medicalSchedule.medicalScheduleFilterStatusWait)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSchedule => {
        if (!medicalSchedule) return this.lenghtScheduleWait = 0;
        this.lenghtScheduleWait = medicalSchedule.length;
      }
      )
  }
  onloadStaff = (): void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(staff => {
        if (!staff) return;
        this.staffs = staff;
      });
  }

  onSearch(event): void {
    this.textSearch = event;
    let filter = { ...this.filters.filter }
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadMedicalSchedule();
  }

  onFilterConditionChange = ():void => {
    Object.entries(APPOINTMENT_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.fromDate = null;
    this.filterResult.toDate = null;
  }

  onAddCondiotion = (): void => {
    let newFilter;
    if ((this.filterResult.condition && this.filterResult.value) ||
      (this.filterResult.condition && this.filterResult.fromDate && this.filterResult.toDate)) {
      if (this.filterResult.condition == 'status' ||
        this.filterResult.condition == 'type') {
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
          from: this.filterResult.fromDate,
          to: this.filterResult.toDate
        }
      }
      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }
      let filter = { ...this.filters.filter }
      if (this.filterResult.conditionSelect == APPOINTMENT_FILTER.time) {
        filter.fromDate = this.filterResult.fromDate;
        filter.toDate = this.filterResult.toDate;
      } else if (this.filterResult.conditionSelect == APPOINTMENT_FILTER.type) {
        filter.typeSchedule = this.filterResult.value;
      } else {
        filter.status = this.filterResult.value;
      }
      this.filters.filter = filter;
      this.onLoadMedicalSchedule();
    }
  }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter }
    if (param.firstCondition == APPOINTMENT_FILTER.time) {
      filter.fromDate = null;
      filter.toDate = null;
    } else if (param.firstCondition == APPOINTMENT_FILTER.type) {
      filter.typeSchedule = null;
    } else {
      filter.status = null;
    }
    this.filters.filter = filter;
    this.onLoadMedicalSchedule();
  }

  handleEventAppointment = ():void => {
    const modalRef = this._modal.open(ScheduleModalComponent, {
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'appointment-backdrop',
      windowClass: 'appointment-window',
      centered: true
    })
    modalRef.result.then( result => {
      if ( !result ) { return }
      this.store.dispatch(onCreateMedicalSchedule({ medicalSchedule: result, scheduleReport: _.cloneDeep(this.filters) }));
    })
    .catch( error => { return console.log(error)})
  }
  handleEventAppointmentWait() {
    const modalRef = this._modal.open(AppointmentConfirmDialogComponent, {
      size: 'xl', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'appointment-backdrop',
      windowClass: 'appointment-window',
      centered: true
    })
    modalRef.result.then( result => {

    })
    .catch( error => { return console.log(error)})
  }
  getStaffName = (staffId: string): string => {
    return this.staffs.find(staff => staff._id === staffId)?.fullName;
  }

  getDayOfDate = (date: Date) => {
    let dateValue: Date = new Date(date);
    let day: string = null;
    switch (dateValue.getDay()) {
      case 0:
        day = 'Chủ nhật'
        break;
      case 1:
        day = 'Thứ hai'
        break;
      case 2:
        day = 'Thứ ba'
        break;
      case 3:
        day = 'Thứ tư'
        break;
      case 4:
        day = 'Thứ năm'
        break;
      case 5:
        day = 'Thứ sáu'
        break;
      case 6:
        day = 'Thứ bảy'
        break;
      default:
        break;
    }
    return day ? (day + ', ' + this.datePipe.transform(date, 'dd/MM/yyyy')) : this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  onMedicalScheduleReminder = (medicalSchedule: MedicalSchedule, index:any) => {
    const modal: NgbModalRef = this._modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = ` Xác nhận gửi lời nhắc lịch hẹn cho bệnh nhân <b>${medicalSchedule.customerName}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onMedicalScheduleReminder({ _id: medicalSchedule._id }));
      this.scheduleList[index].countRemind = this.scheduleList[index].countRemind + 1;
    }).catch(error => {
    })
  }
  getIndex(row: any): number {
    const arrayData = this.scheduleList; // Thay thế yourDataArray bằng mảng dữ liệu thực tế của bạn
    return arrayData.findIndex(item => item._id === row._id);
  }
  onSelectRow(row, prop) {
    if (prop != 'customerCode' && prop != 'customerName') return;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: prop == 'customerCode' ? row.customerId : row._id,
      }
    }

    this.router.navigate([prop == 'customerCode' ? '/benh-an/I' : '/lich-hen/I'], navigationExtras);
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Mã bệnh nhân',
    prop: 'customerCode',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: true,
    path: 'I',
  },
  {
    name: 'Tên bệnh nhân',
    prop: 'customerName',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: true,
    path: 'I',
  },
  {
    name: 'Thời gian hẹn',
    prop: 'date',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Nội dung',
    prop: 'content',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'SĐT',
    prop: 'customerTel',
    width: 80,
    colType: 'tel',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: '',
    prop: 'action',
    width: 80,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  }
];
