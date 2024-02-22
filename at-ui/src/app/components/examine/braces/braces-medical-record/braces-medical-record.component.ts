import { Location } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { BracesCommitmentComponent } from 'src/app/components/commitment/braces-commitment/braces-commitment.component';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { ChairComponent } from 'src/app/shared/components/examine-view/chair/chair.component';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { PictureAdditonModalComponent } from 'src/app/shared/components/examine-view/examine-picture/picture-addition-modal/picture-addition-modal.component';
import { TreatmentModalComponent } from 'src/app/shared/components/examine-view/treatment/treatment-modal/treatment-modal.component';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { formatPhoneNumber } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onAddTreatmentProcess, onLoadMedicalRecordById, onMedicalRecordNote } from 'src/app/store/actions/medicalRecord.action';
import { UploadImageService } from 'src/app/store/services/uploadImages.service';
import BraceExamination from '../../../../../../../at-common/model/BraceExamination';
import Customer from '../../../../../../../at-common/model/Customer';
import { CHAIR_STATUS } from '../../../../../../../at-common/model/enum';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import Role from '../../../../../../../at-common/model/Role';
import Staffs from '../../../../../../../at-common/model/Staffs';
import { RootState } from '../../../../store/entities/state.entity';
import { BracesDetailComponent } from '../braces-detail/braces-detail.component';

@Injectable()
@Component({
  selector: 'app-braces-medical-record',
  templateUrl: './braces-medical-record.component.html',
  styleUrls: ['./braces-medical-record.component.scss'],
  providers: [BracesDetailComponent]
})
export class BracesMedicalRecordComponent implements OnInit {

  medicalRecordData: MedicalRecord = new MedicalRecord();
  braceExamination: BraceExamination = new BraceExamination();
  customer: Customer = new Customer();

  tabActive: number = 1;

  chairStatus = CHAIR_STATUS;

  roomList = RoomList;

  formatPhoneNumber = formatPhoneNumber;

  actionRole: {
    continueCheck: boolean,
    actionTreatment: boolean
  } = {
      continueCheck: false,
      actionTreatment: false
    };

  constructor(
    public location: Location,
    private activeRoute: ActivatedRoute,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private modal: NgbModal,
    private uploadImgService: UploadImageService,
    private braceDetailComponent: BracesDetailComponent
  ) { }

  ngOnInit(): void {
    this.onLoadRoleStaff();
    this.activeRoute.queryParams.subscribe(param => {
      if (param) {
        this.onLoadMedicalRecord(param._id);
      }
    });
  }

  onLoadRoleStaff = () => {
    this.store.select(state => state.role.roleStaffLogin)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((role) => {
        if (!role) return;
        this.store.select(state => state.staff.staffLogin)
          .pipe(takeUntil(this.destroyService.destroySub$))
          .subscribe((staff: any) => {
            if (!staff) return;
            this.actionRole.continueCheck = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Đợi thực hiện - Tiếp tục khám');
            this.actionRole.actionTreatment = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Thao tác quá trình điều trị');
          })
      })
  }

  onLoadMedicalRecord = (_id) => {
    this.store.dispatch(onLoadMedicalRecordById({ id: _id }));
    this.store.select(state => state.medicalRecord.medicalRecord)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalRecord => {
        if (!medicalRecord) return;
        this.medicalRecordData = _.cloneDeep(medicalRecord);
        this.braceExamination = this.medicalRecordData.braceExamination;
        this.onLoadCustomer();
      })
  }

  onLoadCustomer = (): void => {
    this.store.select(state => state.customer.customerItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(customer => customer && (this.customer = customer));
  }

  onConfirmMedicalRecordCommitment = (): void => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Đồng ý thực hiện <b>niềng răng</b>`;
    modal.result.then(result => {
      if (!result) { return }
      this.onMedicalRecordCommitment();
    }).catch(error => {
    })
  }

  onMedicalRecordCommitment = (): void => {
    const modal: NgbModalRef = this.modal.open(BracesCommitmentComponent, {
      centered: true,
      size: 'xl',
      windowClass: 'modal-commitment'
    })
    modal.componentInstance.medicalRecord = this.medicalRecordData;
    modal.componentInstance.customer = this.customer;
    modal.result.then(result => {
      if (!result) { return }

    }).catch(error => {
    })
  }

  onMedicalRecordDehiscent = (): void => {
    const modal: NgbModalRef = this.modal.open(PictureAdditonModalComponent, {
      centered: true,
      size: 'lg'
    })
    modal.componentInstance.title = 'Hình ảnh tự khai';
    modal.result.then(result => {
      if (!result) { return }
      this.uploadImgService.uploadFileDehiscent(result, this.medicalRecordData._id);
    }).catch(error => {
    })
  }

  handleTreatmentProcess = (): void => {
    const modal: NgbModalRef = this.modal.open(TreatmentModalComponent, {
      centered: true,
      size: 'lg'
    })
    modal.componentInstance.medicalRecordData = this.medicalRecordData;
    modal.result.then(result => {
      if (!result) return;
      this.store.dispatch(onAddTreatmentProcess({ _id: this.medicalRecordData?._id, treatmentProcess: result }))
    }).catch(error => {
    })
  }

  onMedicalRecordChair = (): void => {
    const modal: NgbModalRef = this.modal.open(ChairComponent, {
      centered: true,
      size: 'xl'
    })
    modal.componentInstance._idMedicalRecord = this.medicalRecordData._id;
    modal.result.then(result => {
      if (!result) { return }
    }).catch(error => {
    })
  }

  onHandleMoveRoome = (footerCompoent: ExaminaFooterComponent): void => {
    this.braceDetailComponent.onMoveRoom(this.medicalRecordData, footerCompoent, true);
  }

  onSaveNote = () => {
    let medicalRecordNote = {
      _id: this.medicalRecordData._id,
      note: this.medicalRecordData.note
    }
    this.store.dispatch(onMedicalRecordNote(medicalRecordNote));
  }

  onBackClick = () => {
    this.location.back();
  }

  correctOrder() {
    return 1;
  }

}

export const DESIGNATION_COLDEF: Array<ColumnDef> = [
  {
    label: 'Tên chỉ định',
    title: 'name',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
  },
  {
    label: 'Giá',
    title: 'money',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
    colType: 'money',
  },
  {
    label: 'Nơi làm',
    title: 'executeOutSide',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
    colType: 'checkbox'
  },
  {
    label: 'Ghi chú',
    title: 'comment',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
  },
  {
    label: 'Người thực hiện',
    title: 'staffName',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
  },
];

export const SERVICE_COLDEF: Array<ColumnDef> = [
  {
    label: 'Tên dịch vụ',
    title: 'name',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
  },
  {
    label: 'Giá dịch vụ',
    title: 'money',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
    colType: 'money',
  },
  {
    label: 'Ghi chú',
    title: 'comment',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
  },
];

export const TREATMENT_PROCESS_COLDEF: Array<ColumnDef> = [
  {
    label: 'Ngày',
    title: 'processDay',
    colType: 'date',
  },
  {
    label: 'Thực hiện và tiến triển',
    title: 'order',
    headerStyle: 'width: 40%;text-align: center',
    style: 'width: 40%;text-align: center',
  },
  {
    label: 'Ghi chú',
    title: 'note',
  },
  {
    label: 'Người thực hiện',
    title: 'staffName',
  },
];
