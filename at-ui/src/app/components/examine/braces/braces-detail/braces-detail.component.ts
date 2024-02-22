import { Location } from '@angular/common';
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { BracesCommitmentComponent } from 'src/app/components/commitment/braces-commitment/braces-commitment.component';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { PictureAdditonModalComponent } from 'src/app/shared/components/examine-view/examine-picture/picture-addition-modal/picture-addition-modal.component';
import { ServiceComponent } from 'src/app/shared/components/examine-view/service/service.component';
import { RoomInfo } from 'src/app/shared/data/at.model';
import { PICTURE } from 'src/app/shared/data/examine';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { formatCurrencyNumber, formatPhoneNumber } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { TransferRoomModalComponent } from 'src/app/shared/modal/transfer-room-modal/transfer-room-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { ScreenImage, UploadImageService } from 'src/app/store/services/uploadImages.service';
import Customer from '../../../../../../../at-common/model/Customer';
import { CHAIR_STATUS, ROOM_STATUS } from '../../../../../../../at-common/model/enum';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import { DesignatModalComponent } from '../../../../shared/modal/designat-modal/designat-modal.component';
import { onAddMedicalServiceIndicates, onAddMedicalServiceIndicatesAndTranferRoom, onExaminationFinish, onLoadMedicalRecordById, onMedicalCustomerChair, onTransferRoom, onTransferRoomAndResetChair } from '../../../../store/actions/medicalRecord.action';
import { showNotify } from '../../../../store/actions/notify.action';
import { RootState } from '../../../../store/entities/state.entity';
import { BracesPatientComponent } from './patient/patient.component';

@Injectable()
@Component({
  selector: 'app-braces-detail',
  templateUrl: './braces-detail.component.html',
  styleUrls: ['./braces-detail.component.scss']
})
export class BracesDetailComponent implements OnInit {
  @ViewChild(BracesPatientComponent, { static: false }) patientComponent: BracesPatientComponent;
  @ViewChild(ServiceComponent, { static: false }) serviceComponent: ServiceComponent;
  statusList = CHAIR_STATUS;
  generalPicture = []
  serviceColdef = []
  bracesForm: FormGroup;
  bracesImg = PICTURE;
  medicalRecordData: MedicalRecord = new MedicalRecord();
  customerInfo: Customer = new Customer();
  active: number = 1;
  deleteImg: boolean;
  screenImage = ScreenImage;
  actionRole: {
    deleteImg: boolean,
  } = {
      deleteImg: false,
    };

  formatPhoneNumber = formatPhoneNumber;

  constructor(
    private _formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    public location: Location,
    private router: Router,
    private modal: NgbModal,
    private uploadImgService: UploadImageService
  ) { }

  ngOnInit(): void {
    this.bracesForm = this.createBracesForm();
    this.activeRoute.queryParams.subscribe(param => {
      if (param) {
        this.onLoadMedicalRecord(param._id);
      }
    });
    this.onLoadRoleStaff();
  }

  onChangeTab($event) {
    this.active = $event
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    changeEvent.preventDefault();
    if (!this.onChangeValue(changeEvent.activeId)) return this.onChangeTab(changeEvent.nextId);
    this.onConfirmChangeScreen(changeEvent.activeId, changeEvent.nextId);
  }

  onChangeValue = (currentId: number): boolean => {
    if (currentId == 1) {
      if (!_.isEqual(this.patientComponent.braceExamination, this.patientComponent.braceExaminationOld)) {
        return true;
      }
    }
    if (currentId == 3) {
      return !this.serviceComponent.deactivate.canChange;
    }
    return false;
  }

  onConfirmChangeScreen = (currentId: number, tabId: number) => {
    if (currentId == 1) {
      this.patientComponent.onCreateMedicalRecordBrace();
      this.patientComponent.deactivate.setCanDeactivate(true);
    }
    if (currentId == 3) {
      if (this.serviceComponent.activeId == 1) {
        this.serviceComponent.onSaveDesignat(null);
      }
      if (this.serviceComponent.activeId == 2) {
        this.serviceComponent.onSaveService(4);
      }
      this.serviceComponent.deactivate.setCanDeactivate(true);
    }
    this.onChangeTab(tabId);
  }

  onLoadMedicalRecord = (_id) => {
    this.store.dispatch(onLoadMedicalRecordById({ id: _id }));
    this.store.select(state => state.medicalRecord.medicalRecord)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalRecord => {
        if (!medicalRecord) return;
        this.medicalRecordData = medicalRecord;
        this.onLoadCustomerByCode();
      })
  }

  onLoadCustomerByCode = (): void => {
    this.store.select(state => state.customer.customerItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(customer => customer && (this.customerInfo = customer))
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
            this.actionRole.deleteImg = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Xoá Hình ảnh');
            this.deleteImg = this.actionRole.deleteImg;
          })
      })
  }

  createBracesForm = ():FormGroup => {
    return this._formBuilder.group({
      fullName: [],
      birthDate: [],
      sex: [],
      job: [],
      address: [],
      tel: [],
      firstDate: [],
      status: [null]
    })
  }

  onExaminationFinish = () => {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: this.medicalRecordData._id,
      }
    }
    this.activeRoute.queryParams
      .subscribe(param => {
        if (param && param.isUpdate) {
          return this.router.navigate(['/benh-an/chi-tiet/i'], navigationExtras);
        }
        this.router.navigate(['/kham-benh/phong-nieng-rang/chi-tiet/_i'], navigationExtras);
        setTimeout(() => {
          this.store.dispatch(onExaminationFinish({ _id: this.medicalRecordData._id }));
        }, 100);
      });
  }

  changeStatusChair = (event) => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Xác nhận đổi trạng thái thành <b>${this.statusList[event]}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      let medicalRecord = {
        _id: this.medicalRecordData._id,
        chair: {
          chairId: this.medicalRecordData.chair.chairId,
          status: this.statusList[event]
        }
      };
      this.store.dispatch(onMedicalCustomerChair(medicalRecord));
    }).catch(error => {
    })
  }

  public onHandleMoveRoom = (footerCompoent: ExaminaFooterComponent): void => {
    this.onMoveRoom(this.medicalRecordData, footerCompoent, true);
  }

  onMoveRoom = (medicalRecord: MedicalRecord, footerCompoent: ExaminaFooterComponent, isAddIndicate: boolean): void => {
    if (footerCompoent.examineForm.get('roomList').value) {

      if (medicalRecord.chair && medicalRecord.chair.status === CHAIR_STATUS.IN_PROGRESS) {
        return this.store.dispatch(showNotify({ notifyType: 'warning', message: 'Bệnh nhân đang được thực hiện trên ghế!!!' }))
      }

      const roomInfo: RoomInfo = {
        _id: medicalRecord._id,
        fromRoom: medicalRecord.currentRoom,
        toRoom: footerCompoent.examineForm.get('roomList').value,
        roomName: footerCompoent?.currentRoom,
        toRoomName: footerCompoent?.getRoomName(),
        roomStatus: medicalRecord.roomStatus,
        noteTranfer: null,
      };

      if (footerCompoent?.getRoomName() === RoomList.designat && isAddIndicate) {
        return this.handleAddDesignation(medicalRecord, footerCompoent);
      }

      const modal: NgbModalRef = this.modal.open(TransferRoomModalComponent, {
        centered: true,
        size: 'md'
      })
      modal.componentInstance.content = `Bạn có muốn chuyển đến phòng <b>${footerCompoent?.getRoomName()}</b>`;
      modal.componentInstance.medicalRecord = medicalRecord;
      modal.componentInstance.roomInfo = roomInfo;
      modal.result.then(result => {
        if (!result) { return }
        if (result.roomName == RoomList.braces && result?.roomStatus == ROOM_STATUS.SEE_YOU) {
          this.store.dispatch(onTransferRoomAndResetChair(result));
          this.location.back();
        } else {
          this.store.dispatch(onTransferRoom(result));
        }
      }).catch(error => console.log(error))
    }
  }

  handleAddDesignation(medicalRecord: MedicalRecord, footerCompoent: ExaminaFooterComponent): void {
    const medicalRecordData = _.cloneDeep(medicalRecord)
    const modal = this.modal.open(DesignatModalComponent, {
      scrollable: true,
      windowClass: 'service-indicate-modal modal-commitment',
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
    });
    modal.componentInstance.serviceIndicateSelected = medicalRecordData.medicalServiceIndicates;

    modal.result.then(result => {
      if (!result) { return }
      if (result[0]) {
        let serviceData = _.cloneDeep(result[1]);
        serviceData.forEach(val => {
          val.money = formatCurrencyNumber(val.totalMoney);
          val.totalMoney = formatCurrencyNumber(val.totalMoney);
        });
        this.store.dispatch(onAddMedicalServiceIndicates({ _id: medicalRecordData?._id, medicalServiceIndicatesUpdate: serviceData }));
      }

      this.onMoveRoom(medicalRecordData, footerCompoent, false);
    }).catch(error => console.log(error))
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
    modal.componentInstance.customer = this.customerInfo;
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

  onBackClick = () => {
    this.location.back();
  }

}