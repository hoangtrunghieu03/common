import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { hiddenModal } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadChair } from 'src/app/store/actions/chair.action';
import { onMedicalCustomerChair } from 'src/app/store/actions/medicalRecord.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { CHAIR_STATUS } from '../../../../../../../../at-common/model/enum';
import Staffs from '../../../../../../../../at-common/model/Staffs';
import { ChairModalComponent } from '../chair-modal/chair-modal.component';
import MedicalRecord from '../../../../../../../../at-common/model/MedicalRecord';
import Chair from '../../../../../../../../at-common/model/Chair';

@Component({
  selector: 'at-chair-content',
  templateUrl: './chair-content.component.html',
  styleUrls: ['./chair-content.component.scss'],
  providers: [DestroySubsribeService, DatePipe]
})
export class ChairContentComponent implements OnInit {

  @Input() medicalRecord: MedicalRecord;
  @Input() _view: boolean = false;
  chairStatus = CHAIR_STATUS;
  staffs: Staffs[] = [];
  staffLoginId: string = null;
  chairList: Array<any> = [];
  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private datePipe: DatePipe,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.store.dispatch(loadStaff());
    this.onloadChair();
    this.onLoaIdStaffLogin();
  }

  onloadChair = (): void => {
    this.store.dispatch(onLoadChair());
    this.store.select(state => state.chair.chairList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(chairList => {
        if (!chairList) return;
        this.chairList = chairList;
        this.onloadStaff();
      });
  }

  onloadStaff = (): void => {
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(staff => {
        if (!staff) return;
        this.staffs = staff;
      });
  }

  onLoaIdStaffLogin = () => {
    this.store.select(state => state.authencation._id)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(_id => {
        if (!_id) return;
        this.staffLoginId = _id;
      })
  }

  getStaffName = (staffId: string): string => {
    if (!staffId) return '--';
    return this.staffs.find(staff => staff._id === staffId)?.fullName;
  }

  getTimeInChair = (updateDateTime: string): string => {
    if (!updateDateTime) return '--';
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    let dayTimeCurrent = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    let serviceTime = new Date(dayTimeCurrent.split('.')[0]).getTime() - new Date(updateDateTime.split('.')[0]).getTime();
    var days = Math.floor(serviceTime / (60 * 60 * 24 * 1000));
    var hours = Math.floor(serviceTime / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(serviceTime / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    return days > 0 ? `${days} Ngày` : `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}`;
  }

  getItemColor = (chairStatus: string): string => {
    if (chairStatus === this.chairStatus.IN_PROGRESS) return 'violet';
    if (chairStatus === this.chairStatus.IN_TEST) return 'chartreuse';
    if (chairStatus === this.chairStatus.TODO) return 'orange';
    return 'white';
  }

  onSelectChair = (chair: Chair) => {
    if (this._view) return;
    if (chair.medicalRecordId === this.medicalRecord._id || chair.chairStatus === this.chairStatus.IN_PROGRESS) return this.onSelectChairActive(chair);
    hiddenModal(true);
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = ` Xác nhận đưa bệnh nhân vào ghế <b>${chair.name}</b>`;
    modal.result.then(result => {
      hiddenModal(false);
      if (!result) { return }
      let medicalRecord = {
        _id: this.medicalRecord._id, chair: {
          chairId: chair._id,
          status: (!this.medicalRecord.chair || this.medicalRecord.chair?.status === this.chairStatus.FINISH) ? this.chairStatus.TODO : this.medicalRecord.chair.status
        }
      };
      this.store.dispatch(onMedicalCustomerChair(medicalRecord));
    }).catch(error => {
      hiddenModal(false);
    })
  }

  onSelectChairActive = (chair) => {
    if (this._view) return;
    if (chair.chairStatus === this.chairStatus.AVAILABLE) return;
    hiddenModal(true);
    const modal: NgbModalRef = this.modal.open(ChairModalComponent, {
      centered: true,
      size: 'lg',
    })
    modal.componentInstance.medicalRecord = this.medicalRecord;
    modal.componentInstance.chairInfo = chair;
    modal.result.then(result => {
      hiddenModal(false);
      if (!result) { return }
      this.store.dispatch(onMedicalCustomerChair(result));
    }).catch(error => {
      hiddenModal(false);
    })
  }

  checkActiveChair = (chair: Chair) => {
    if (this._view) return true;
    if (!this.medicalRecord.chair || this.medicalRecord.chair?.status === this.chairStatus.FINISH) {
      if (chair.staffId && chair.staffId !== this.staffLoginId) return false;
      return true;
    }
    if (chair._id === this.medicalRecord.chair?.chairId) return true;
    return false;
  }

}
