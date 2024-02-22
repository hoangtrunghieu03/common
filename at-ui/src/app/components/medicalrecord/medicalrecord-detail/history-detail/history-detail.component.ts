import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { DESIGNATION_COLDEF, SERVICE_COLDEF } from 'src/app/components/examine/braces/braces-medical-record/braces-medical-record.component';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { ATContent } from 'src/app/shared/data/at.model';
import { onLoadExamineContent, onLoadFunctionContent, onLoadJawBeforeContent, onLoadOralExamineContent, onLoadOrthopedicContent, onLoadPlanContent } from 'src/app/shared/functions/braceExamination';
import { formatPhoneNumber } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { PaymentModalComponent } from 'src/app/shared/modal/payment-modal/payment-modal.component';
import { ScheduleModalComponent } from 'src/app/shared/modal/schedule-modal/schedule-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onDeletePayHistoryMedicalRecord, onLoadMedicalRecordDetailById, onMedicalRecordFinish, onMedicalRecordPayment, onReceiveCustomerToRoom, onReExamination, onRemoveExamination, onUpdateMedicalRecordName } from 'src/app/store/actions/medicalRecord.action';
import { onCreateMedicalSchedule } from 'src/app/store/actions/medicalSchedule.action';
import { onLoadMedicalService } from 'src/app/store/actions/medicalService.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import AngleRank from '../../../../../../../at-common/model/AngleRank';
import BraceExamination from '../../../../../../../at-common/model/BraceExamination';
import BraceExaminationDiagnostic from '../../../../../../../at-common/model/BraceExaminationDiagnostic';
import Customer from '../../../../../../../at-common/model/Customer';
import { ANGLE_POSITION, ANGLE_TOOTH, ANGLE_TYPE, MEDICAL_SERVICE_STATUS, MEDICAL_SERVICE_TYPE, OPERATOR_SERVICE_STATUS, PAYMENT_STATUS, ROOM_STATUS } from '../../../../../../../at-common/model/enum';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import MedicalService from '../../../../../../../at-common/model/MedicalService';
import PaymentHistory from '../../../../../../../at-common/model/PaymentHistory';
import Staffs from '../../../../../../../at-common/model/Staffs';
import { onMedicalRecordOldPayment } from '../../../../store/actions/medicalRecord.action';
import { showNotify } from '../../../../store/actions/notify.action';
import { PaymentHistoryModalComponent } from '../payment-history-modal/payment-history-modal.component';
import { ScreenImage } from 'src/app/store/services/uploadImages.service';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss'],
})
export class HistoryDetailComponent implements OnInit {

  @ViewChild('medicalRecordNameInput') medicalRecordNameInput: ElementRef;

  PAYMENT_STATUS = PAYMENT_STATUS;
  medicalRecordData: MedicalRecord = new MedicalRecord();
  braceExamination: BraceExamination = new BraceExamination();
  generalMedicalRecordContent: (ATContent & { class?: string; type?: boolean })[] = [];
  implantMedicalRecordContent: (ATContent & { class?: string; type?: string, typeName?: { label: string, value: string }[] })[] = [];

  customer: Customer = new Customer();
  paymentHistoryData: PaymentHistory[] = [];
  diagnostic = new BraceExaminationDiagnostic();
  medicalRecordFee: { name: string; price: number }[] = [];

  orthopedic: any = null;
  examineContent: any = null;
  oralExamineContent: any = null;
  jawBeforeContent: any = null;
  functionalContent: any = null;
  planContent: any = null;
  deleteImg : boolean;
  firstIndexWithPaymentStatus : any;
  designationColDef: Array<ColumnDef> = DESIGNATION_COLDEF;
  serviceColDef: Array<ColumnDef> = SERVICE_COLDEF;
  paymentColumnDef: Array<ColDef> = PAYMENT_COLDEF;
  treatmenColumnDef: Array<ColumnDef> = TREAMENT_COLDEF;
  treatmentHistoryColumnDef: Array<ColDef> = TREAMENT_HISTORY_COLDEF;
  supplyColumnDef: Array<ColumnDef> = SUPPLY_COLDEF;

  staffs: Staffs[] = [];

  header = ['', 'Trước sau', 'Ngang', 'Đứng'];
  angleType = ANGLE_TYPE;
  medicalServiceStatus = MEDICAL_SERVICE_STATUS;
  tooth: number[] | string[] = [];

  medicalService: MedicalService[] = [];

  medicalServiceType = MEDICAL_SERVICE_TYPE;
  screenImage = ScreenImage;

  formUpdate: {
    serviceType: {
      isUpdate: boolean, value: string
    },
    medicalRecordName: {
      isUpdate: boolean, value: string
    }
  } = {
    serviceType: {
      isUpdate: false, value: null
    },
    medicalRecordName: {
      isUpdate: false, value: null
    }
  };

  formatPhoneNumber = formatPhoneNumber;

  actionRole: {
    payment: boolean,
    reExamine: boolean,
    goOut: boolean,
    removeExamine: boolean,
    finishExamine: boolean,
    createSchedule: boolean,
    updateExamine: boolean,
    deleteImg :boolean,
  } = {
      payment: false,
      reExamine: false,
      goOut: false,
      removeExamine: false,
      finishExamine: false,
      createSchedule: false,
      updateExamine: false,
      deleteImg : false,
    };

  constructor(
    public location: Location,
    private activeRoute: ActivatedRoute,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private modal: NgbModal,
    private router: Router,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.onLoadRoleStaff();
    this.onLoadMedicalService();
    this.onLoadStaffs();
    this.activeRoute.queryParams
      .subscribe(param => {
        if (param && param._id) {
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
            this.actionRole.payment = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Thanh toán');
            this.actionRole.goOut = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Cho về');
            this.actionRole.reExamine = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Tái khám');
            this.actionRole.removeExamine = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Xóa hồ sơ');
            this.actionRole.finishExamine = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Hoàn thành');
            this.actionRole.createSchedule = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Tạo lịch hẹn');
            this.actionRole.updateExamine = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Cập nhật hồ sơ');
            this.actionRole.deleteImg = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Xoá Hình ảnh');
            this.deleteImg = this.actionRole.deleteImg;
          })
      })
  }

  onLoadMedicalRecord = (_id: string) => {
    this.store.dispatch(onLoadMedicalRecordDetailById({ id: _id }));
    this.store.select(state => state.medicalRecord.medicalRecordDetail)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalRecord => {
        if (!medicalRecord) return;
        this.medicalRecordData = _.cloneDeep(medicalRecord);

        this.formUpdate.medicalRecordName.value = this.medicalRecordData.medicalRecordName;
        this.formUpdate.serviceType.value = this.medicalRecordData.serviceType;

        this.onLoadCustomer();
        this.onLoadPaymentHistory();

        this.medicalRecordFee = this.medicalRecordData.medicalServiceIndicates
          ?.concat(this.medicalRecordData?.medicalServices)
          .map((item) => ({ name: item.name, price: item.money }));

        this.medicalRecordData.generalExamination && this.onLoadGeneralMedicalRecord();
        this.medicalRecordData.implantExamination && this.onLoadImplantMedicalRecord();

        if (this.medicalRecordData.braceExamination) {
          this.braceExamination = this.medicalRecordData.braceExamination;

          this.diagnostic = !this.braceExamination?.diagnostic ? this.diagnostic : this.braceExamination.diagnostic;
          this.orthopedic = onLoadOrthopedicContent(this.braceExamination);
          this.examineContent = onLoadExamineContent(this.braceExamination);
          this.oralExamineContent = onLoadOralExamineContent(this.braceExamination);
          this.jawBeforeContent = onLoadJawBeforeContent(this.braceExamination);
          this.functionalContent = onLoadFunctionContent(this.braceExamination);
          this.planContent = onLoadPlanContent(this.braceExamination);
        }

        this.medicalRecordData.medicalServiceIndicates = this.medicalRecordData.medicalServiceIndicates?.map((item) => { return { ...item, ...{ staffName: this.onGetStaffName(item.staffId) } } });
        this.medicalRecordData.medicalServices = this.medicalRecordData.medicalServices?.map((item) => { return { ...item, ...{ staffName: this.onGetStaffName(item.staffId) } } })

      })
  }

  onLoadCustomer = (): void => {
    this.store.select(state => state.customer.customerItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(customer => customer && (this.customer = customer))
  }
  onDeletePayHistory(paymentHistory: PaymentHistory){
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Xác nhận hủy lịch sử thanh toán này?`;
    modal.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onDeletePayHistoryMedicalRecord(paymentHistory));
    })
  }
  onLoadPaymentHistory = (): void => {
    this.store.select(state => state.medicalRecord.medicalRecordPaymentHistory)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(paymentHistory => {
        this.paymentHistoryData = paymentHistory;
        this.findIndexByPaymentStatus();
        this.sortTreatmentProcessByDateTime(
          this.medicalRecordData.treatmentProcesses = this.medicalRecordData.treatmentProcesses?.map((item) => {
            return {
              ...item,
              ...{
                staffName: this.onSetStaff(item.staffId),
                serviceName: this.getMedicalServiceName(item.serviceId),
              }
            }
          }));
      });
  }
  findIndexByPaymentStatus() {
    if (!this.paymentHistoryData || this.paymentHistoryData?.length <= 0) return;
    this.firstIndexWithPaymentStatus = this.paymentHistoryData.findIndex(item => !item.paymentStatus);
  }

  onLoadStaffs = (): void => {
    this.store.dispatch(loadStaff());
    this.store.select((state) => state.staff.staffList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((staff) => {
        if (!staff) { return }
        this.staffs = staff;
      })
  };

  onLoadMedicalService = ():void => {
    this.store.dispatch(onLoadMedicalService());
    this.store.select(state => state.medicalService.medicalServices)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(service => service && ( this.medicalService = service))
  }

  onLoadGeneralMedicalRecord = () => {
    const generalExamination = this.medicalRecordData?.generalExamination;
    this.tooth = generalExamination?.tooth;
    this.generalMedicalRecordContent = [
      {
        label: 'Lý do đến khám',
        value: generalExamination?.reason,
        type: true,
      },
      {
        label: 'Bệnh sử y khoa',
        value: generalExamination?.medicalHistory,
        type: true,
      },
      {
        label: 'Tiền sử bản thân',
        value: generalExamination?.personalHistory,
        type: true,
      },
      {
        label: 'Triệu chứng y khoa',
        value: generalExamination?.dentalSymptoms,
        class: 'd-flex flex-column',
      },
      {
        label: 'Chẩn đoán',
        value: generalExamination?.diagnostic,
        class: 'd-flex flex-column',
      },
      {
        label: 'Điều trị',
        value: generalExamination?.treatment,
        class: 'd-flex flex-column',
      },
      {
        label: 'Lời khuyên',
        value: generalExamination?.advice,
        class: 'd-flex flex-column',
      },
    ];
  }

  onLoadImplantMedicalRecord = () => {
    const implantExamination = this.medicalRecordData?.implantExamination;
    this.tooth = implantExamination?.tooth;
    this.implantMedicalRecordContent = [
      {
        label: 'Lý do đến khám',
        value: implantExamination?.reason,
        type: 'array',
      },
      {
        label: 'Bệnh sử y khoa',
        value: implantExamination?.medicalHistory,
        type: 'array',
      },
      {
        label: 'Tiền sử bản thân',
        value: implantExamination?.personalHistory,
        type: 'array',
      },
      {
        label: 'Triệu chứng y khoa',
        value: implantExamination?.dentalSymptoms,
        class: 'd-flex flex-column',
        type: 'object',
        typeName: [
          { label: 'gingivalMucosa', value: 'Niêm mạc nướu' },
          { label: 'boneLoss', value: 'Xương mắt' },
        ],
      },
      {
        label: 'Chẩn đoán',
        value: implantExamination?.diagnostic,
        class: 'd-flex flex-column',
      },
      {
        label: 'Điều trị',
        value: implantExamination?.treatment,
        class: 'd-flex flex-column',
        type: 'object',
        typeName: [
          { label: 'connectiveTissue', value: 'Ghép mô liên kết' },
          { label: 'artificialGums', value: 'Nướu rời' },
          { label: 'sinusLift', value: 'Nâng xoang' },
          { label: 'osteoplasty', value: 'Ghép xương' },
          { label: 'implant', value: 'Implant' },
        ],
      },
      {
        label: 'Lời khuyên',
        value: implantExamination?.advice,
        class: 'd-flex flex-column',
      },
    ];
  }

  sortTreatmentProcessByDateTime = (arrayData: Array<any>) => {
    // return arrayData.sort((a, b) => Date.parse(a.processDay) - Date.parse(b.processDay));
    let arrayFinish = arrayData.filter(x => x.treatmentStatus === OPERATOR_SERVICE_STATUS.FINISH).sort(
      (a, b) => (Date.parse(a.processDay) - Date.parse(b.processDay))
    );
    let arrayNotFinish = arrayData.filter(x => x.treatmentStatus === OPERATOR_SERVICE_STATUS.NOT_FINISH).sort(
      (a, b) => (Date.parse(a.processDay) - Date.parse(b.processDay))
    );

    this.medicalRecordData.treatmentProcesses = [...arrayNotFinish.concat(arrayFinish)];
  }

  checkIncludeNum = (num, rowInd, colInd): boolean => {
    let data: any = this.braceExamination.braceExaminationCheckMount.toothCheck;
    return data?.some(val => val === Number(num + '' + rowInd + '' + colInd))
  }

  checkIncludeCharacters = (characters, rowInd, colInd): boolean => {
    let data: any = this.braceExamination.braceExaminationCheckMount.toothCheckChild;
    return data?.some(val => val === characters + '' + rowInd + '' + colInd)
  }

  handleRenderTitle = (key: boolean): Array<string> => {
    let data = ['A', 'B', 'C', 'D', 'E', '', '', '']
    return key ? data : data.reverse();
  }

  handleRenderData = (key: boolean): Array<number> => {
    let data = [1, 2, 3, 4, 5, 6, 7, 8]
    return key ? data : data.reverse();
  }

  handleRenderColumn = (event: any, indexClass: number, indexPosition: number) => {
    let dataArray: AngleRank[] = !this.braceExamination.braceExaminationCheckMount.correlationTeethSideAngleRank ? [] : this.braceExamination.braceExaminationCheckMount.correlationTeethSideAngleRank;
    let data: AngleRank = {
      position: indexPosition % 2 == 0 ? ANGLE_POSITION.RIGHT : ANGLE_POSITION.LEFT,
      class: this.getClassByIndex(indexClass),
      tooth: indexPosition < 2 ? ANGLE_TOOTH.FANG : ANGLE_TOOTH.MOLAR,
      value: event.target.value,
    }
    dataArray.push(data);
    this.braceExamination.braceExaminationCheckMount.correlationTeethSideAngleRank = dataArray;
  }

  onGetStaffName = (staffId: string): string => {
    return this.staffs?.find(val => val._id == staffId)?.fullName
  }

  onSetStaff = (staffId) => {
    if (!staffId || staffId.length == 0) return '--';
    let staffValue = '';
    staffId?.forEach(staff => {
      staffValue = `${staffValue} ${this.onGetStaffName(staff)} <br>`;
    });
    return staffValue;
  }

  getValueColumn = (className: string, indexPosition: number): boolean => {
    let dataArray = this.medicalRecordData.braceExamination?.braceExaminationCheckMount?.correlationTeethSideAngleRank;
    if (!dataArray) return null;
    let value = dataArray?.find(x =>
    (x?.class === className &&
      x?.tooth === (indexPosition < 2 ? ANGLE_TOOTH.FANG : ANGLE_TOOTH.MOLAR) &&
      x?.position === (indexPosition % 2 == 0 ? ANGLE_POSITION.RIGHT : ANGLE_POSITION.LEFT)));
    return !value ? false : value.value;
  }

  getClassByIndex = (index: number) => {
    return Object.values(ANGLE_TYPE)[index];
  }

  onBackClick = () => {
    this.location.back();
    // let navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     _id: this.customer._id,
    //   }
    // }
    // this.router.navigate(['/benh-an/I'], navigationExtras);
  }

  onReExamination = () => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Xác nhận tái khám bệnh nhân`;
    modal.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onReExamination({ _id: this.medicalRecordData._id }));
    })
  }

  onMedicalRecordFinish = (): void => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Hoàn thành';
    modal.componentInstance.content = `Hoàn thành hồ sơ bệnh án bệnh nhân <b>${this.customer?.fullName}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onMedicalRecordFinish({ _id: this.medicalRecordData._id, medicalRecord: this.medicalRecordData }));
    })
  }

  onMedicalSchedule = (): void => {
    const modalRef = this.modal.open(ScheduleModalComponent, {
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'appointment-backdrop',
      windowClass: 'appointment-window',
      centered: true
    })
    modalRef.componentInstance.medicalRecordData = this.medicalRecordData;
    modalRef.result.then(result => {
      if (!result) { return };
      this.store.dispatch(onCreateMedicalSchedule({ medicalSchedule: result, scheduleReport: null }));
    }).catch(error => { return console.log(error) })
  }

  onRemoveExamination = () => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Xác nhận xóa hồ sơ bệnh án`;
    modal.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onRemoveExamination({ _id: this.medicalRecordData._id }));
    })
  }

  onPayment = (): void => {
    if (this.medicalRecordData?.payment?.moneyPayment == 0) {
      const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
        centered: true,
        size: 'md'
      })
      modal.componentInstance.title = 'Thanh toán';
      modal.componentInstance.content = 'Hiện tại bệnh nhân không có phát sinh nào cần thanh toán';
      modal.result.then(result => {
        if (!result) { return }
      })
    } else {
      this.onShowModalPayment();
    }
  }

  onShowModalPayment = ():void => {
    const modal: NgbModalRef = this.modal.open(PaymentModalComponent, {
      size: 'xl',
      centered: true,
      windowClass: 'modal-commitment',
    });
    modal.componentInstance.medicalRecord = this.medicalRecordData;
    modal.result.then(result => {
      if ( !result ) { return }
      this.store.dispatch(onMedicalRecordOldPayment({medicalRecord: result[0], print: result[1]}))
    }
    ).catch( error => console.log(error))
  }

  onUpdateRoomStatus = () => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn có muốn chuyển trạng thái bệnh nhân thành <b>${ROOM_STATUS.SEE_YOU}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      let data = { _id: this.medicalRecordData._id, roomStatus: ROOM_STATUS.SEE_YOU };
      this.store.dispatch(onReceiveCustomerToRoom(data));
      this.location.back();
    })
  }

  onNavigateViewDetail = (row) => {
    if (Date.parse(row.processDay) > Date.parse(String(new Date()))) {
      return this.store.dispatch(showNotify({ notifyType: 'warning', message: 'Hồ sơ bệnh án không tồn tại' }))
    }

    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: this.medicalRecordData._id,
        date: this.datePipe.transform(row.processDay, 'yyyy-MM-dd')
      }
    }
    this.router.navigate(['/benh-an/lich-su/i'], navigationExtras);
  }

  onUpdateMedicalRecord = () => {
    if (!this.medicalRecordData.serviceType) {
      return this.store.dispatch(showNotify({ notifyType: 'warning', message: 'Hồ sơ bệnh án chưa thực hiện khám bệnh' }));
    }

    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: this.medicalRecordData._id,
        isUpdate: this.medicalRecordData.serviceType
      }
    }

    if (this.medicalRecordData.serviceType == MEDICAL_SERVICE_TYPE.GENERAL) {
      return this.router.navigate(['/kham-benh/phong-tong-quat/I'], navigationExtras);
    }
    if (this.medicalRecordData.serviceType == MEDICAL_SERVICE_TYPE.BRACES) {
      return this.router.navigate(['/kham-benh/phong-nieng-rang/I'], navigationExtras);
    }
    this.router.navigate(['/kham-benh/phong-cay-implant/I'], navigationExtras);
  }

  onSaveUpdate = (type) => {
    this.store.dispatch(onUpdateMedicalRecordName({ _id: this.medicalRecordData._id, medicalRecordName: this.formUpdate.medicalRecordName.value, serviceType: this.formUpdate.serviceType.value }));
    this.formUpdate[type].isUpdate = !this.formUpdate[type].isUpdate;
  }

  cancelUpdate = (type) => {
    this.formUpdate[type].value = this.medicalRecordData[type];
    this.formUpdate[type].isUpdate = !this.formUpdate[type].isUpdate;
  }

  getMedicalServiceName = (id: string): string => {
    return this.medicalService.find(service => service._id === id)?.name;
  }

  onViewDetailPayment = (paymentHistory: PaymentHistory) => {
    const modal: NgbModalRef = this.modal.open(PaymentHistoryModalComponent, {
      size: 'xl',
      centered: true,
      scrollable: true,
      windowClass: 'modal-commitment',
    });
    modal.componentInstance.medicalRecord = this.medicalRecordData;
    modal.componentInstance.paymentHistory = paymentHistory;
    modal.result.then(result => {
      if (!result) { return }
    }
    ).catch(error => console.log(error))
  }

  correctOrder() {
    return 1;
  }

}

const PAYMENT_COLDEF: Array<ColDef> = [
  {
    name: 'Ngày',
    prop: 'paymentDate',
    width: 200,
    colType: 'date'
  },
  {
    name: 'Số tiền thanh toán',
    prop: 'moneyCustomerProvide',
    width: 200,
    colType: 'money'
  },
  {
    name: 'Phương thức',
    prop: 'paymentMethod',
    width: 150,
  },
];

const TREAMENT_HISTORY_COLDEF: Array<ColDef> = [
  {
    name: 'Ngày',
    prop: 'processDay',
    colType: 'date',
    width: '120',
    router: true
  },
  {
    name: 'Dịch vụ',
    prop: 'serviceName',
    width: '150'
  },
  {
    name: 'Chỉ định thực hiện',
    prop: 'note',
    width: '200'
  },
  {
    name: 'Người thực hiện',
    prop: 'staffName',
    width: '150',
    colType: 'innerHTML',
  },
  {
    name: 'Trạng thái',
    prop: 'treatmentStatus',
    width: '100'
  },
];

export const TREAMENT_COLDEF: Array<ColumnDef> = [
  {
    label: 'Ngày',
    title: 'processDay',
    colType: 'date',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Dịch vụ',
    title: 'serviceName',
    colType: 'service',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Chỉ định thực hiện',
    title: 'note',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Người thực hiện',
    title: 'staffName',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
    colType: 'innerHTML',
  },
  {
    label: 'Trạng thái',
    title: 'treatmentStatus',
    colType: 'text',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
];

export const SUPPLY_COLDEF: Array<ColumnDef> = [
  {
    label: 'Tên vật tư',
    title: 'name',
  },
  {
    label: 'Số lượng',
    title: 'qty',
  },
];
