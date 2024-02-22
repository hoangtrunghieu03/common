import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import MedicalRecord from '../../../../../../../../at-common/model/MedicalRecord';
import ServiceRequest from '../../../../../../../../at-common/model/ServiceRequest';
import Staffs from '../../../../../../../../at-common/model/Staffs';
import TreatmentProcess from '../../../../../../../../at-common/model/TreatmentProcess';
import { RootState } from '../../../../../store/entities/state.entity';
import { formatCurrencyNumber, FormatDateComponent, formatTextLating, isEmpty, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from '../../../../functions/function-helper';
import * as _ from 'lodash';
import { OPERATOR_SERVICE_STATUS, SERVICE_REQUEST, STATUS_STAFF, TYPE_SERVICEINDICATE, UNIT } from '../../../../../../../../at-common/model/enum';
import MedicalSupplyReport from '../../../../../../../../at-common/model/MedicalSupplyReport';
import { onLoadMedicalSupplyFilter } from 'src/app/store/actions/medicalSupply.action';
import MedicalSupply from '../../../../../../../../at-common/model/MedicalSupply';
import ColumnDef from '../../../at-base-table/at-base-table.component';
import { showNotify } from 'src/app/store/actions/notify.action';
import MedicalService from '../../../../../../../../at-common/model/MedicalService';
import MedicalServiceIndicate from '../../../../../../../../at-common/model/MedicalServiceIndicate';
import MedicalBaseModel from '../../../../../../../../at-common/model/MedicalBaseModel';

@Component({
  selector: 'app-treatment-modal',
  templateUrl: './treatment-modal.component.html',
  styleUrls: ['./treatment-modal.component.scss'],
  providers: [FormatDateComponent, DestroySubsribeService, DatePipe]
})
export class TreatmentModalComponent implements OnInit {

  @Input() medicalRecordData: MedicalRecord = null;
  @Input() treatmentProcess: TreatmentProcess = null;
  @Input() title: string = 'Thêm quá trình điều trị';
  @Input() roomId: string = null;
  staffsList: Staffs[] = [];
  staffLoginId: string = null;
  typeServiceRequest = SERVICE_REQUEST;

  serviceStatus = OPERATOR_SERVICE_STATUS;

  treatmentForm: FormGroup;
  scheduleForm: FormGroup;

  staffCreactSelectCurrent:{label: string, value: string | any};
  medicalSupplyList: MedicalSupply[] = [];
  medicalSupplyFilter: MedicalSupply[] = [];

  medicalServices: {label: string, value: string | any}[] = [];

  medicalServiceIndicates: {label: string, value: string | any}[] = [];
  medicalServiceIndicateData: MedicalServiceIndicate[] = [];

  medicalServiceList: MedicalService[] = [];

  staffs: Staffs[] = [];
  staffFilter: {label: string, value: string | any}[] = [];
  textStaffSearch: string = null;
  staffCreateList: {label: string, value: string | any}[] = [];
  columnDef: ColumnDef[] = COL_DEF;

  validateForm = validateForm;
  formatCurrencyNumber = formatCurrencyNumber;
  validateAllFormFields = validateAllFormFields;
  scrollToFirstInvalidControl = scrollToFirstInvalidControl;

  minProcessDay: { year: number; month: number; day: number; };
  minScheduleTime: { year: number; month: number; day: number; };

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private formatDate: FormatDateComponent,
    private destroy: DestroySubsribeService,
    private datePipe: DatePipe
  ) {
    let today = new Date();
   }

  ngOnInit(): void {
    this.onLoadStaffLogin();
    this.onLoadStaffs();
    this.treatmentForm = this.createtreatmentForm();
    this.scheduleForm = this.createScheduleForm();



    this.onLoadMedicalSupplyReport();
    this.onLoadMedicalServivce();
    this.onLoadMedicalServivceIndicate();
    this.getLimitedDate();
  }

  onLoadStaffLogin = ():void => {
    this.store.select(state => state.authencation._id)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(staffId => staffId && (this.staffLoginId = staffId))
  }

  onLoadStaffs = (): void => {
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(staff => {
        if (!staff) return;
        this.staffsList = _.cloneDeep(staff);
        this.staffs = staff.filter(staff => !staff.status || staff.status == STATUS_STAFF.ACTIVE);
        this.staffFilter = this.staffs.map((item) => ({ label: item.fullName, value: item._id }))
        this.staffCreateList = this.staffs.map((item) => ({ label: item.fullName, value: item._id }))
        this.staffCreactSelectCurrent = this.staffCreateList.find(item => item.value === this.staffLoginId);
      })
  }

  onLoadMedicalServivce = () => {
    this.store.select(state => state.medicalService.medicalServices)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalService => {
        if (!medicalService) return;
        this.medicalServices = medicalService.map((item) => ({ label: item.name, value: item._id }));
        this.medicalServiceList = medicalService;
      })
  }

  onLoadMedicalServivceIndicate = () => {
    this.store.select(state => state.serviceIndicate.serviceIndicates)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalService => {
        if (!medicalService) return;
        this.medicalServiceIndicateData = _.cloneDeep(medicalService);
        this.medicalServiceIndicates = [];
        medicalService.forEach((item) => {
          if (item.typeIndicate == TYPE_SERVICEINDICATE.ARCMAKING) {
            this.medicalServiceIndicates.push({ label: item.name, value: item._id })
          }
        });
      })
  }

  onLoadMedicalSupplyReport = () => {
    let filters = new MedicalSupplyReport();
    let filter = { ...filters.filter };
    filter.roomId = this.roomId;
    filters.filter = filter;
    this.store.dispatch(onLoadMedicalSupplyFilter(filters));

    this.store.select(state => state.medicalSupply.medicalSupplyFilter)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalSupplyList => {
        if (!medicalSupplyList) {
          this.medicalSupplyList = [];
          this.medicalSupplyFilter = [];
          return
        }
        this.medicalSupplyList = _.cloneDeep(medicalSupplyList);
        this.medicalSupplyFilter = _.cloneDeep(medicalSupplyList);
      })
  }

  createtreatmentForm = (): FormGroup => {
    return this._formBuilder.group({
      id: [this.treatmentProcess?.id],
      processDay: [this.treatmentProcess?.processDay ? this.datePipe.transform(this.treatmentProcess?.processDay, 'dd-MM-yyyy') : this.datePipe.transform(new Date(), 'dd-MM-yyyy'), [Validators.required]],
      serviceId: [this.treatmentProcess?.serviceId],
      serviceIndicateId: [this.treatmentProcess?.serviceIndicateId ? (typeof this.treatmentProcess?.serviceIndicateId == 'string' ?
        [this.treatmentProcess?.serviceIndicateId] : this.treatmentProcess?.serviceIndicateId) : []],
      staffId: [this.treatmentProcess?.staffId],
      staffCreateId: [this.treatmentProcess?.staffCreateId ? this.treatmentProcess?.staffCreateId : this.staffCreactSelectCurrent.value],
      note: [this.treatmentProcess?.note, [Validators.required]],
      order: [this.treatmentProcess?.order],
      medicalSupply: [this.treatmentProcess?.medicalSupply],
      medicalService: [null],
      medicalServiceIndicate: [[]],
      treatmentSchedule: [null],
      executeOutSide: [this.treatmentProcess?.executeOutSide],
    })
  }

  createScheduleForm = (): FormGroup => {
    return this._formBuilder.group({
      scheduleTime: [this.treatmentProcess?.treatmentSchedule?.scheduleTime ?
        this.datePipe.transform(this.treatmentProcess?.treatmentSchedule?.scheduleTime, 'dd-MM-yyyy') :
        this.datePipe.transform(new Date().setDate(new Date().getDate() + 1), 'dd-MM-yyyy'), [Validators.required]],
      content: [this.treatmentProcess?.treatmentSchedule?.content],
    })
  }

  onSearchStaff = (name: string) => {
    this.staffFilter = this.staffs.filter(
      (staff) => (name
        ? formatTextLating(staff.fullName).indexOf(formatTextLating(name)) > -1
        : true)
    ).map((item) => ({ label: item.fullName, value: item._id }));
  }

  onSearchServiceIndicate = (name: string) => {
    this.medicalServiceIndicates = this.medicalServiceIndicateData.filter(
      (staff) => (name
        ? formatTextLating(staff.name).indexOf(formatTextLating(name)) > -1
        : true)
    ).map((item) => ({ label: item.name, value: item._id }));
  }

  handleStaffSelected = (value, control) => {
    let staffSelected = !this.treatmentForm.get(control).value ? [] : [...this.treatmentForm.get(control).value];
    let index = staffSelected.findIndex(x => x == value);
    if (index == -1) {
      staffSelected.push(value);
    } else {
      staffSelected.splice(index, 1);
    }
    this.treatmentForm.get(control).setValue(staffSelected);
  }

  onCheckStaffSelected = (value: string, control) => {
    return this.treatmentForm.get(control).value?.some(x => x == value);
  }

  onSearchSupply = (name: string) => {
    this.medicalSupplyFilter = this.medicalSupplyList.filter(
      (supply) => (name
        ? formatTextLating(supply.name).indexOf(formatTextLating(name)) > -1
        : true)
    );
  }

  onSelectSupply = (event) => {
    let medicalSupplySelected = !this.treatmentForm.get('medicalSupply').value ? [] : [...this.treatmentForm.get('medicalSupply').value];
    if (medicalSupplySelected.findIndex(x => x.supplyId === event._id) !== -1) return;

    let supplyDate = { supplyId: event._id, name: event.name, quantity: event.quantity, qty: 1 };
    medicalSupplySelected.push(supplyDate);
    this.treatmentForm.get('medicalSupply').setValue(medicalSupplySelected);
  }

  onRemoveSupply = (event) => {
    let medicalSupplySelected = [...this.treatmentForm.get('medicalSupply').value];
    medicalSupplySelected = medicalSupplySelected.filter(x => x.supplyId !== event.supplyId);
    this.treatmentForm.get('medicalSupply').setValue(medicalSupplySelected);
  }

  onSaveForm = (): void => {
    if (this.treatmentForm.valid) {
      let dataTreatment = _.cloneDeep(this.treatmentForm.value);
      let dataSchedule = _.cloneDeep(this.scheduleForm.value);
      if (dataTreatment.medicalSupply && dataTreatment.medicalSupply.length != 0 && this.onCheckInventory(dataTreatment.medicalSupply)) {
        return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Không thể dùng nhiều hơn số lượng hiện có' }));
      }

      dataTreatment.processDay = this.formatDate.formatDate(dataTreatment.processDay, 'yyyy-MM-dd');
      dataTreatment.note = isEmpty(dataTreatment.note) ? null : dataTreatment.note;

      if (isEmpty(dataSchedule.content)) {
        dataSchedule = null;
      } else {
        dataSchedule.scheduleTime = this.formatDate.formatDate(dataSchedule.scheduleTime, 'yyyy-MM-dd');
        dataSchedule.content = isEmpty(dataSchedule.content) ? null : dataSchedule.content;
      }

      dataTreatment.treatmentSchedule = dataSchedule;

      if (!dataTreatment.id && dataTreatment.serviceId && (this.medicalRecordData.medicalServices?.length == 0 || !this.medicalRecordData.medicalServices.some(x => x.id == dataTreatment.serviceId))) {
        dataTreatment.medicalService = this.onAddService(this.medicalServiceList.find(x => x._id == dataTreatment.serviceId), false);
      }

      if (dataTreatment.id && dataTreatment.serviceId && (this.medicalRecordData.medicalServices?.length == 0 || !this.medicalRecordData.medicalServices.some(x => x.id == dataTreatment.serviceId)) && this.treatmentProcess?.serviceId != dataTreatment.serviceId) {
        dataTreatment.medicalService = this.onAddService(this.medicalServiceList.find(x => x._id == dataTreatment.serviceId), false);
      }

      dataTreatment.serviceIndicateId.forEach(service => {
        if (!dataTreatment.id && (this.medicalRecordData.medicalServiceIndicates?.length == 0 || !this.medicalRecordData.medicalServiceIndicates.some(x => x.id == service))) {
          dataTreatment.medicalServiceIndicate.push(this.onAddService(this.medicalServiceIndicateData.find(x => x._id == service), dataTreatment.executeOutSide));
        }
        if (dataTreatment.id && (this.medicalRecordData.medicalServiceIndicates?.length == 0 || !this.medicalRecordData.medicalServiceIndicates.some(x => x.id == service)) && this.treatmentProcess?.serviceIndicateId != service) {
          dataTreatment.medicalServiceIndicate.push(this.onAddService(this.medicalServiceIndicateData.find(x => x._id == service), dataTreatment.executeOutSide));
        }
      });
      let timeout = setTimeout(() => {
        this.activeModal.close(dataTreatment);
        clearTimeout(timeout);
      }, 100);
    }

    validateAllFormFields(this.treatmentForm);
    scrollToFirstInvalidControl(this.treatmentForm);
  }

  onCheckInventory = (medicalSupply) => {
    let check: boolean = false;
    for (const val of medicalSupply) {
      if (this.medicalSupplyList.some(x => x._id == val.supplyId && Number(x.quantity) < Number(val.qty))) {
        return check = true;
      }
    }
    return check;
  }

  onAddService = (service, executeOutSide) => {
    let designat: MedicalBaseModel = new MedicalBaseModel();
    designat.name = service.name;
    designat.name_en = service.name_en;
    designat.status = OPERATOR_SERVICE_STATUS.NOT_FINISH;
    designat.id = service._id;
    designat.money = service.price;
    designat.indicater = this.staffLoginId;
    designat.totalMoney = service.price;
    designat.isCombo = false;
    designat.listIndicate = [];
    designat.groupIndicateShortName = service.medicalServiceIndicateGroupShortName;
    designat.indicateShortName = service.shortName;
    designat.groupIndicateName = service.tagService;
    designat.typeIndicate = service.typeIndicate;
    designat.executeOutSide = executeOutSide;
    return designat;
  }

  getLimitedDate = () => {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minProcessDay = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    this.minScheduleTime = { year: today.getFullYear(), month: today.getMonth() + 1, day: tomorrow.getDate() };
  }

  getStaffName = (staffId: string): string => {
    let staffActive = this.staffs.find( staff => staff._id === staffId)?.fullName;
    if(staffActive) {
      return staffActive;
    } else {
      return this.staffsList.find( staff => staff._id === staffId)?.fullName;

    }

  }

  getServiceIndicateName = (serviceIndicateId: string): string => {
    return this.medicalServiceIndicateData.find(service => service._id === serviceIndicateId)?.name;
  }

}


const COL_DEF: Array<ColumnDef> = [
  {
    label: 'Tên vật dụng',
    title: 'name',
  },
  {
    label: 'Số lượng còn lại',
    title: 'quantity',
  },
  {
    label: 'Số lượng',
    title: 'qty',
    colType: 'quantity',
    canUpdate: true,
    fieldUpdate: 'qty',
    updateType: 'quantity',
    style: 'width: 300px',
    headerStyle: 'text-align: center',
    fieldCompare: 'quantity'
  },
];
