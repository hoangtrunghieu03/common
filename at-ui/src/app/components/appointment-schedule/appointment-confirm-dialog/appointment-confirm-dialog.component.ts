import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import MedicalScheduleReport from '../../../../../../at-common/model/MedicalScheduleReport';
import { SCHEDULE_STATUS } from '../../../../../../at-common/model/enum';
import { onLoadMedicalScheduleStatusWait, onUpdateMedicalScheduleStatus } from 'src/app/store/actions/medicalSchedule.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { DatePipe } from '@angular/common';
import { formatPhoneNumber, hiddenModal } from 'src/app/shared/functions/function-helper';
import MedicalSchedule from '../../../../../../at-common/model/MedicalSchedule';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { NavigationExtras, Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-appointment-confirm-dialog',
  templateUrl: './appointment-confirm-dialog.component.html',
  styleUrls: ['./appointment-confirm-dialog.component.scss']
})
export class AppointmentConfirmDialogComponent implements OnInit {

  limit: number = 10;
  columnDef: Array<ColDef> = COL_DEF;
  scheduleListWait: Array<any> = [];
  scheduleStatus = SCHEDULE_STATUS;
  formatPhoneNumber = formatPhoneNumber;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private datePipe: DatePipe,
    private _modal : NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.onLoadMedicalScheduleStatusWait();
  }
  handleConfirmSchedule(medicalSchedule: MedicalSchedule) {
    if (!medicalSchedule._id) return;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: medicalSchedule._id,
      }
    }

    this.router.navigate(['/lich-hen/confirm/I'], navigationExtras);
    this.activeModal.close()
  }
  onSelectRow(row, prop) {
    if (prop != 'customerCode' && prop != 'customerName') return;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: prop == 'customerCode' ? row.customerId : row._id,
      }
    }

    this.router.navigate([prop == 'customerCode' ? '/benh-an/I' : '/lich-hen/I'], navigationExtras);
    this.activeModal.close()
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
  handleCloseSchedule(medicalSchedule: MedicalSchedule) {
    hiddenModal(true);
    const modal: NgbModalRef = this._modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    })
    modal.componentInstance.title = 'Hủy lịch hẹn';
    modal.componentInstance.content = `Hủy lịch hẹn bệnh nhân <b>${medicalSchedule.customerSchedule.fullName}</b>`;
    modal.result.then(result => {
      hiddenModal(false);
      if (!result) { return }
      let medicalScheduleData = _.cloneDeep(medicalSchedule);
      medicalScheduleData.status = this.scheduleStatus.CANCEL;
      this.store.dispatch(onUpdateMedicalScheduleStatus(medicalScheduleData));
    }).catch(error => {
    })
  }
  onLoadMedicalScheduleStatusWait = (): void => {
    let filters =  new MedicalScheduleReport();
    let filter = { ...filters.filter }
    filter.status = SCHEDULE_STATUS.WAIT_ACCEPT
    filters.filter = filter;
    this.store.dispatch(onLoadMedicalScheduleStatusWait(filters));
    this.store.select(state => state.medicalSchedule.medicalScheduleFilterStatusWait)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalScheduleFilter => {
        if (!medicalScheduleFilter) return this.scheduleListWait = [];
        this.scheduleListWait =  medicalScheduleFilter?.map((item) => { return { ...item, ...{ date: this.getDayOfDate(item.scheduleTime)}}});;
      }
      )
  }

}



const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên bệnh nhân',
    prop: 'customerSchedule.fullName',
    width: 5,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: true,
    path: '',
  },
  {
    name: 'Thời gian hẹn',
    prop: 'date',
    width: 10,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Nội dung',
    prop: 'content',
    width: 10,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'SĐT',
    prop: 'customerSchedule.tel',
    width: 10,
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
