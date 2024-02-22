import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onMedicalCustomerChair } from 'src/app/store/actions/medicalRecord.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Chair from '../../../../../../../../at-common/model/Chair';
import { CHAIR_STATUS } from '../../../../../../../../at-common/model/enum';
import Staffs from '../../../../../../../../at-common/model/Staffs';
import MedicalRecord from '../../../../../../../../at-common/model/MedicalRecord';

@Component({
  selector: 'app-chair-modal',
  templateUrl: './chair-modal.component.html',
  styleUrls: ['./chair-modal.component.scss'],
  providers: [DestroySubsribeService, DatePipe]
})
export class ChairModalComponent implements OnInit {

  @Input() medicalRecord: MedicalRecord;
  @Input() chairInfo: Chair;
  statusList = CHAIR_STATUS;
  staffs: Staffs[] = [];
  staffLoginId: string = null;
  chairContent: { label: string, value: string | any }[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private datePipe: DatePipe,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.onloadStaff();
    this.onLoaIdStaffLogin();
  }

  onloadStaff = (): void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(staff => {
        if (!staff) return;
        this.staffs = staff;
        this.onCreateContent();
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

  onCreateContent = (): void => {
    this.chairContent = [
      { label: 'Trạng thái:', value: this.chairInfo.chairStatus },
      { label: 'Người thực hiện:', value: this.getStaffName(this.chairInfo.staffId) },
      { label: 'Bệnh nhân:', value: this.chairInfo.customerName },
      { label: 'Thời gian bắt đầu:', value: this.datePipe.transform(this.chairInfo.updateDateTime, 'HH:mm', 'GMT') },
      { label: 'Tổng thời gian đã dùng:', value: this.getTimeInChair(this.chairInfo.updateDateTime) }
    ]
  }

  getStaffName = (staffId: string): string => {
    if (!staffId) return '--';
    return this.staffs.find(staff => staff._id === staffId)?.fullName;
  }

  getTimeInChair = (updateDateTime: any): string => {
    if (!updateDateTime) return '--';
    let orderTime = new Date(this.datePipe.transform(updateDateTime, 'yyyy-MM-dd hh:mm:ss a', 'GMT'));
    let serviceTime = new Date().getTime() - orderTime.getTime();
    var days = Math.floor(serviceTime / (60 * 60 * 24 * 1000));
    var hours = Math.floor(serviceTime / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(serviceTime / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    return days > 0 ? `${days} Ngày` : `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}`;
  }

  changeStatusChair = (status: string) => {
    let medicalRecord = {
      _id: this.medicalRecord._id,
      chair: {
        chairId: this.chairInfo._id,
        status: status
      }
    };
    this.activeModal.close(medicalRecord);
  }

}