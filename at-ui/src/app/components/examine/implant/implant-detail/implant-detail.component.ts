import { Location } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { pluck, takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { PATIENT_OPTION, PICTURE, SERVICE_DESIGNATE_COLDEF } from 'src/app/shared/data/examine';
import { formatCurrencyNumber } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onAddMedicalService, onExaminationFinish, onLoadMedicalRecordById, onMedicalServiceCommand, onReceiveCustomerToRoom, onTransferRoom, onUpdateMedicalRecordGeneral, onUpdateMedicalRecordImplant } from 'src/app/store/actions/medicalRecord.action';
import { onLoadMedicalService } from 'src/app/store/actions/medicalService.action';
import { onLoadMedicalServiceGroup } from 'src/app/store/actions/medicalServiceGroup.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import MedicalService from '../../../../../../../at-common/model/MedicalService';
import MedicalServiceGroup from '../../../../../../../at-common/model/MedicalServiceGroup';
import Staffs from '../../../../../../../at-common/model/Staffs';
import * as _ from 'lodash';
import { onLoadCustomerByCode } from 'src/app/store/actions/customer.action';
import Customer from '../../../../../../../at-common/model/Customer';
import { showNotify } from 'src/app/store/actions/notify.action';
import ImplantExamination from '../../../../../../../at-common/model/ImplantExamination';
import DeactivateGuard from '../../../../shared/directives/deactive-guard';
import { PatientComponent } from 'src/app/shared/components/examine-view/patient/patient.component';
import { ServiceComponent } from 'src/app/shared/components/examine-view/service/service.component';
import { ROOM_STATUS } from '../../../../../../../at-common/model/enum';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { BracesDetailComponent } from '../../braces/braces-detail/braces-detail.component';
import GeneralExamination from '../../../../../../../at-common/model/GeneralExamination';
import { MinorsurgeryCommitmentComponent } from 'src/app/components/commitment/minorsurgery-commitment/minorsurgery-commitment.component';
import { ScreenImage } from 'src/app/store/services/uploadImages.service';

@Component({
  selector: 'app-implant-detail',
  templateUrl: './implant-detail.component.html',
  styleUrls: ['./implant-detail.component.scss'],
  providers: [DestroySubsribeService, BracesDetailComponent]
})
export class ImplantDetailComponent implements OnInit {
  @Output() eventChangeTab: EventEmitter<any> = new EventEmitter();
  @ViewChild(PatientComponent, { static: false }) patientComponent: PatientComponent;
  @ViewChild(ServiceComponent, { static: false }) serviceComponent: ServiceComponent;
  implantPicture = PICTURE;
  medicalRecordImplant: MedicalRecord = new MedicalRecord();
  implantForm: FormGroup;
  implantOption = PATIENT_OPTION;
  dentalsymptoms = DENTALSYMPTOMS;
  treatmentOption = TREATMENTOPTION;
  medicalService: MedicalService[] = [];
  medicalServiceGroup: Array<MedicalServiceGroup & { collapsed: boolean }> = [];
  staffs: Staffs[] = [];
  staffLoginId: string = null;
  customerInfo: Customer = new Customer();
  implantExamination = new ImplantExamination();
  implantExaminationOld = new ImplantExamination();
  implantExaminationCurrentState = new ImplantExamination();
  serviceOnSave: Array<MedicalBaseModel> = [];
  active: number = 1;
  deleteImg: boolean;
  screenImage = ScreenImage;
  actionRole: {
    deleteImg: boolean,
  } = {
      deleteImg: false,
    };

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private modal: NgbModal,
    public location: Location,
    private router: Router,
    private activeRout: ActivatedRoute,
    private deactivate: DeactivateGuard,
    private braceDetailComponent: BracesDetailComponent,
    private destroyService: DestroySubsribeService,
  ) {
  }

  ngOnInit(): void {
    this.activeRout.queryParams
      .pipe(pluck('_id'))
      .subscribe((param) => param && this.onLoadMedicalRecord(param));
    this.onLoadMedicalServiceGroup();
    this.onLoadStaffs();
    this.onLoadStaffLogin();
    this.onLoadRoleStaff();
  }

  ngDoCheck(): void {
    if (this.active == 1) {
      if (!_.isEqual(this.implantExamination, this.implantExaminationCurrentState) && !_.isEqual(this.implantExamination, this.implantExaminationOld) && this.deactivate.canChange) {
        this.implantExaminationCurrentState = _.cloneDeep(this.implantExamination);
        return this.deactivate.setCanDeactivate(false);
      }
      if (_.isEqual(this.implantExamination, this.implantExaminationOld) && !this.deactivate.canChange) {
        this.implantExaminationCurrentState = _.cloneDeep(this.implantExamination);
        return this.deactivate.setCanDeactivate(true);
      }
    }
  }

  onChangeTab = (event) => {
    this.active = event;
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    changeEvent.preventDefault();
    if (!this.onChangeValue(changeEvent.activeId)) return this.onChangeTab(changeEvent.nextId);
    this.onConfirmChangeScreen(changeEvent.activeId, changeEvent.nextId);
  }

  onChangeValue = (currentId: number): boolean => {
    if (currentId == 1) {
      if (!_.isEqual(this.implantExamination, this.implantExaminationOld)) {
        return true;
      }
    }
    if (currentId == 3) {
      return !this.serviceComponent.deactivate.canChange;
    }
    return false;
  }

  onLoadMedicalRecord = (medicalRecordId: string):void => {
    this.store.dispatch(onLoadMedicalRecordById({id: medicalRecordId}));
    this.store.select( state => state.medicalRecord.medicalRecord )
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalRecord => {
        if (!medicalRecord) { return }
        this.medicalRecordImplant = _.cloneDeep(medicalRecord);
        if (this.medicalRecordImplant.implantExamination) {
          this.implantExamination = _.cloneDeep(this.medicalRecordImplant.implantExamination);
          this.implantExaminationOld = _.cloneDeep(this.medicalRecordImplant.implantExamination);
          this.implantExaminationCurrentState = _.cloneDeep(this.medicalRecordImplant.implantExamination);
        }
        this.onLoadCustomerByCode();
      }
      )
  }

  onLoadServices = (serviceList: Array<MedicalBaseModel>) => {
    let dataServiceDifference: Array<MedicalBaseModel> = this.serviceOnSave.filter(({ id: id1 }) => !serviceList.some(({ id: id2 }) => id2 === id1));
    if (dataServiceDifference.length == 0) return
    this.medicalRecordImplant.medicalServices = this.medicalRecordImplant?.medicalServices.concat(dataServiceDifference);
  }

  onLoadCustomerByCode = (): void => {
    this.store.select(state => state.customer.customerItem)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(customer => customer && (this.customerInfo = customer))
  }

  onLoadMedicalServiceGroup = (): void => {
    this.store.dispatch(onLoadMedicalServiceGroup());
    this.store.dispatch(onLoadMedicalService());
    this.store.select(state => state.medicalServiceGroup.medicalServiceGroups)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((serviceGroup: any) => {
        if (!serviceGroup) { return }
        this.medicalServiceGroup = serviceGroup.map((item) => { return { ...item, ...{ collapsed: false } } });
        this.onLoadMedicalService();
      })
  }

  onLoadMedicalService = (): void => {
    this.store.select(state => state.medicalService.medicalServices)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(service => service && (this.medicalService = service))
  }

  onLoadStaffs = (): void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(staff => staff && (this.staffs = staff))
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

  onLoadStaffLogin = (): void => {
    this.store.select(state => state.authencation._id)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(staffId => staffId && (this.staffLoginId = staffId))
  }

  onCreateMedicalRecordService = (index):void => {
    this.medicalRecordImplant.medicalServices = this.medicalRecordImplant?.medicalServices.filter(val => val.money = formatCurrencyNumber(val.money))
    let data = { _id: this.medicalRecordImplant?._id, medicalServicesUpdate: this.medicalRecordImplant?.medicalServices }
    if (this.medicalRecordImplant?.medicalServices?.some(val => !val.staffId)) {
      this.store.dispatch(showNotify({ notifyType: 'warning', message: 'Người thực hiện không để trống' }))
    } else {
      this.medicalRecordImplant?.medicalServices.length > 0 && (this.store.dispatch(onAddMedicalService(data)))
    }
    this.active = index
  }

  onExaminationFinish = () => {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: this.medicalRecordImplant._id,
      }
    }
    this.activeRout.queryParams
      .subscribe(param => {
        if (param && param.isUpdate) {
          return this.router.navigate(['/benh-an/chi-tiet/i'], navigationExtras);
        }
        this.router.navigate(['/kham-benh/phong-cay-implant/chi-tiet/_i'], navigationExtras);
        setTimeout(() => {
          this.store.dispatch(onExaminationFinish({ _id: this.medicalRecordImplant._id }));
        }, 100);
      });
  }

  onConfirmChangeScreen = (currentId: number, tabId: number) => {
    if (currentId == 1) {
      this.onCreateMedicalRecordPatient(null);
      this.deactivate.setCanDeactivate(true);
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

  onMoveRoom = (footerCompoent: ExaminaFooterComponent): void => {
    this.braceDetailComponent.onMoveRoom(this.medicalRecordImplant, footerCompoent, true);
  }

  onSelectedTooth = (tooth: Array<string>) => {
    this.implantExamination.tooth = tooth;
  }

  onSelectedImplantPatient = (event, first, second, action) => {
    let dataArray: string[] = null;
    if (second) {
      this.implantExamination[first] = !this.implantExamination[first] ? {} : this.implantExamination[first];
      if (action) return this.implantExamination[first][second] = event.target.checked ? true : false;
      dataArray = !this.implantExamination[first][second] ? [] : this.implantExamination[first][second];
    } else {
      dataArray = !this.implantExamination[first] ? [] : this.implantExamination[first];
    }
    let index: number = dataArray.findIndex(val => val == event.target.value || val.includes(event.target.value));
    if (event.target.checked) {
      if (index == -1) {
        dataArray.push(event.target.value);
      }
    } else {
      dataArray.splice(index, 1);
    }

    if (second) return this.implantExamination[first][second] = dataArray.length == 0 ? null : dataArray;
    this.implantExamination[first] = dataArray.length == 0 ? null : dataArray;
  };

  toothChecked = (value, first, second, action) => {
    if (action) {
      if (second && this.implantExamination[first]) return this.implantExamination[first][second];
      return this.implantExamination[first];
    }
    if (second) return this.implantExamination[first] && this.implantExamination[first][second]?.some(val => val === value || (val.includes(value)));
    return this.implantExamination[first]?.some(val => val === value || (val.includes(value)));
  }

  onInputOtherRender = (first, second, label) => {
    let value: any = null;
    if (second && this.implantExamination[first]) {
      value = this.implantExamination[first][second]?.find(val => val.includes(label));
    } else {
      value = this.implantExamination[first]?.find(val => val.includes(label));
    }
    return value ? value?.split(': ')[1] : null;
  }

  onInputOtherReason = (event, first, second, label, active) => {
    if (!active) return;
    let dataArray: string[] = second ? this.implantExamination[first][second] : this.implantExamination[first];
    let value = label + event.target.value;
    let index: number = dataArray.findIndex(val => val.includes(label));
    if (second) return this.implantExamination[first][second][index] = value;
    this.implantExamination[first][index] = value;
  }

  onCreateMedicalRecordPatient = (index) => {
    if (!this.medicalRecordImplant._id) return;
    this.store.dispatch(onUpdateMedicalRecordImplant({ _id: this.medicalRecordImplant._id, implantExamination: this.implantExamination }));
    this.deactivate.setCanDeactivate(true);
    index && (this.active = index);
  }

  onCreateGeneralExamine = () => {
    let generalExamination = this.medicalRecordImplant?.generalExamination ? this.medicalRecordImplant?.generalExamination : new GeneralExamination();
    generalExamination.reason = this.implantExamination.reason;
    generalExamination.medicalHistory = this.implantExamination.medicalHistory;
    generalExamination.personalHistory = this.implantExamination.personalHistory;
    generalExamination.tooth = this.implantExamination.tooth;
    return generalExamination;
  }

  onMedicalRecordCommitment = (): void => {
    const modal: NgbModalRef = this.modal.open(MinorsurgeryCommitmentComponent, {
      centered: true,
      size: 'xl',
      windowClass: 'modal-commitment'
    })
    modal.componentInstance.medicalRecord = this.medicalRecordImplant;
    modal.componentInstance.customer = this.customerInfo;
    modal.result.then(result => {
      if (!result) { return }
      
    }).catch(error => {
    })
  }

  onBackClick = () => {
    this.location.back();
  }
}

export const DENTALSYMPTOMS = [
  { label: 'Niêm mạc nướu', key: 'gingivalMucosa', option: ['Mỏng', 'Bình thường', 'Dày'] },
  { label: 'Mất xương', key: 'boneLoss', option: ['Chiều dọc', 'Chiều ngang'] },
]

export const TREATMENTOPTION = [
  { label: 'Ghép mô liên kết', key: 'connectiveTissue', option: [] },
  { label: 'Nướu rời', key: 'artificialGums', option: [] },
  { label: 'Nâng xoang', key: 'sinusLift', option: ['Kín', 'Hở'] },
  { label: 'Ghép xương', key: 'osteoplasty', option: ['Khối', 'Bột', 'Xương tự thân', 'Nong xương', 'Chẻ xương'] },
  { label: 'Implant', key: 'implant', option: ['Thụy Sỹ', 'Mỹ', 'Pháp', 'Đức', 'Hàn', 'Khác: '] },  
]