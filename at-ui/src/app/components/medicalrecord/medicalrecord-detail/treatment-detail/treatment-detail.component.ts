import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { BracesMedicalRecordComponent, DESIGNATION_COLDEF, SERVICE_COLDEF, TREATMENT_PROCESS_COLDEF } from 'src/app/components/examine/braces/braces-medical-record/braces-medical-record.component';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { ATContent } from 'src/app/shared/data/at.model';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadCustomerByCode } from 'src/app/store/actions/customer.action';
import { onLoadMedicalRecordByDate, onReExamination } from 'src/app/store/actions/medicalRecord.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import AngleRank from '../../../../../../../at-common/model/AngleRank';
import BraceExamination from '../../../../../../../at-common/model/BraceExamination';
import BraceExaminationDiagnostic from '../../../../../../../at-common/model/BraceExaminationDiagnostic';
import Customer from '../../../../../../../at-common/model/Customer';
import { ANGLE_POSITION, ANGLE_TOOTH, ANGLE_TYPE, MEDICAL_SERVICE_TYPE, OPERATOR_SERVICE_STATUS } from '../../../../../../../at-common/model/enum';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import Staffs from '../../../../../../../at-common/model/Staffs';
import { onLoadExamineContent, onLoadFunctionContent, onLoadJawBeforeContent, onLoadOralExamineContent, onLoadOrthopedicContent, onLoadPlanContent } from 'src/app/shared/functions/braceExamination';
import { formatPhoneNumber } from 'src/app/shared/functions/function-helper';
import { SUPPLY_COLDEF, TREAMENT_COLDEF } from '../history-detail/history-detail.component';
import MedicalService from '../../../../../../../at-common/model/MedicalService';
import { onLoadMedicalService } from 'src/app/store/actions/medicalService.action';
import { ScreenImage } from 'src/app/store/services/uploadImages.service';


@Component({
  selector: 'app-treatment-detail',
  templateUrl: './treatment-detail.component.html',
  styleUrls: ['./treatment-detail.component.scss'],
  providers: [BracesMedicalRecordComponent]
})
export class TreatmentDetailComponent implements OnInit {

  medicalRecordData: MedicalRecord = new MedicalRecord();
  braceExamination: BraceExamination = new BraceExamination();
  generalMedicalRecordContent: (ATContent & { class?: string; type?: boolean })[] = [];
  implantMedicalRecordContent: (ATContent & { class?: string; type?: string, typeName?: { label: string, value: string }[] })[] = [];

  customer: Customer = new Customer();
  diagnostic = new BraceExaminationDiagnostic();

  orthopedic: any = null;
  examineContent: any = null;
  oralExamineContent: any = null;
  jawBeforeContent: any = null;
  functionalContent: any = null;
  planContent: any = null;

  designationColDef: Array<ColumnDef> = DESIGNATION_COLDEF;
  serviceColDef: Array<ColumnDef> = SERVICE_COLDEF;
  supplyColumnDef: Array<ColumnDef> = SUPPLY_COLDEF;
  treatmenColumnDef: Array<ColumnDef> = TREAMENT_COLDEF;

  staffs: Staffs[] = [];
  medicalService: MedicalService[] = [];

  header = ['', 'Trước sau', 'Ngang', 'Đứng'];
  angleType = ANGLE_TYPE;
  tooth: number[] | string[] = [];

  medicalServiceType = MEDICAL_SERVICE_TYPE;
  screenImage = ScreenImage;

  date: string = null;

  formatPhoneNumber = formatPhoneNumber;

  constructor(
    public location: Location,
    private activeRoute: ActivatedRoute,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private modal: NgbModal,
  ) { }

  ngOnInit(): void {
    this.onLoadStaffs();
    this.onLoadMedicalService();
    this.activeRoute.queryParams
      .subscribe(param => {
        if (param._id && param.date) {
          this.onLoadMedicalRecord(param._id, param.date);
          this.date = param.date;
        }
      });
  }

  onLoadMedicalRecord = (_id, date) => {
    this.store.dispatch(onLoadMedicalRecordByDate({ id: _id, examinationDate: date }));
    this.store.select(state => state.medicalRecord.medicalRecordByDate)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalRecord => {
        if (!medicalRecord) return;
        this.medicalRecordData = _.cloneDeep(medicalRecord);

        this.onLoadCustomer(this.medicalRecordData.customerCode);

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
      })
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

  onLoadCustomer = (customerCode: string): void => {
    this.store.select(state => state.customer.customerItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(customer => {
        if (!customer) return;
        this.customer = customer;
        this.medicalRecordData.medicalServiceIndicates = this.medicalRecordData.medicalServiceIndicates?.map((item) => { return { ...item, ...{ staffName: this.onGetStaffName(item.staffId) } } });
        this.medicalRecordData.medicalServices = this.medicalRecordData.medicalServices?.map((item) => { return { ...item, ...{ staffName: this.onGetStaffName(item.staffId) } } })
        this.sortTreatmentProcessByDateTime(this.medicalRecordData.treatmentProcesses?.map((item) => { return { ...item, ...{ staffName: this.onSetStaff(item.staffId), serviceName: this.getMedicalServiceName(item.serviceId), } } }));
      });
  }

  onLoadMedicalService = ():void => {
    this.store.dispatch(onLoadMedicalService());
    this.store.select(state => state.medicalService.medicalServices)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(service => service && ( this.medicalService = service))
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

  onLoadStaffs = (): void => {
    this.store.dispatch(loadStaff());
    this.store
      .select((state) => state.staff.staffList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((staff) => {
        if (!staff) { return }
        this.staffs = staff;
      }
      )
  };

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

  getMedicalServiceName = (id: string): string => {
    return this.medicalService.find(service => service._id === id)?.name;
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

  correctOrder() {
    return 1;
  }

}
