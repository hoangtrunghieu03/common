import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { FormatDateComponent, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { AppointmentScheduleService } from 'src/app/shared/service/appointment-schedule.service';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadCustomerByCode } from 'src/app/store/actions/customer.action';
import { onLoadMedicalScheduleById, onRemoveMedicalSchedule, onUpdateMedicalSchedule } from 'src/app/store/actions/medicalSchedule.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../../at-common/model/Customer';
import { SCHEDULE_STATUS, SERVICE_REQUEST, TYPE_SCHEDULE } from '../../../../../../at-common/model/enum';
import MedicalSchedule from '../../../../../../at-common/model/MedicalSchedule';
import Staffs from '../../../../../../at-common/model/Staffs';
import { onUpdateMedicalScheduleStatus } from '../../../store/actions/medicalSchedule.action';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.scss'],
  providers: [DatePipe, DestroySubsribeService, FormatDateComponent]
})
export class AppointmentDetailComponent implements OnInit {

  @ViewChild('footer', {static: false}) _footerAction: ExaminaFooterComponent;
  customerContent: any[] = []
  medicalSchedule: MedicalSchedule = new MedicalSchedule();
  customer: Customer = new Customer();
  staffs: Staffs[] = [];
  isEdit: boolean = false;
  scheduleStatus = SCHEDULE_STATUS;
  typeServiceRequest = SERVICE_REQUEST;
  scheduleType = TYPE_SCHEDULE;

  scheduleForm: FormGroup;
  validateForm = validateForm;

  scheduleTypeList: {label: string, value: string | any}[] = [];

  minDate: { year: number; month: number; day: number; };

  constructor(
    private rout: ActivatedRoute,
    private appointmentService: AppointmentScheduleService,
    private datePipe: DatePipe,
    private router: Router,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    public location: Location,
    private formatDate: FormatDateComponent,
    private cdr: ChangeDetectorRef
  ) { 
    this.scheduleForm = this.creatScheduleForm();
  }

  ngOnInit(): void {
    this.rout.queryParams.subscribe(param => {
      if ( param && param._id ) {
        this.onLoadStaffs();
        this.onLoadMedicalSchedule(param._id);
      }
    })

    this.scheduleTypeList = Object.values(TYPE_SCHEDULE).map((item) => ({ label: item, value: item }))
  }

  onLoadMedicalSchedule = (_id) => {
    this.store.dispatch(onLoadMedicalScheduleById({_id: _id}));
    this.store.select(state => state.medicalSchedule.medicalSchedule)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSchedule => {
        if (!medicalSchedule) return;
        this.medicalSchedule = medicalSchedule;
        this.onLoadCustomer(this.medicalSchedule.customerCode);
        this.scheduleForm = this.creatScheduleForm();
        this.getLimitedDate();
      })
  }

  onLoadCustomer = (customerCode: string): void => {
    this.store.dispatch(onLoadCustomerByCode({ customerCode: customerCode }));
    this.store
      .select((state) => state.customer.customerItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((customer) => {
        if (!customer) return
        this.customer = customer;
        this.customerContent = [
          { label: 'Mã bệnh nhân', value: this.customer.customerCode },
          { label: 'Họ tên bệnh nhân', value: this.customer.fullName },
          { label: 'Địa chỉ', value: this.customer.address },
          { label: 'SDT', value: this.customer.tel },
          { label: 'Ngày sinh', value: this.datePipe.transform(this.customer.birthday, 'dd/MM/yyyy') },
        ]
      });
  };

  onLoadStaffs = (): void => {
    this.store.dispatch(loadStaff());
    this.store
      .select((state) => state.staff.staffList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((staff) => {
        if ( !staff ) { return }
        this.staffs = staff;
      }
    )
  };

  creatScheduleForm = (): FormGroup => {
    return this.formBuilder.group({
      _id: [this.medicalSchedule?._id],
      medicalRecordCode: [this.medicalSchedule?.medicalRecordCode],
      customerCode: [this.medicalSchedule?.customerCode],
      serviceType: [this.medicalSchedule?.serviceType],
      content: [this.medicalSchedule.content],
      typeSchedule: [this.medicalSchedule.typeSchedule, [Validators.required]],
      contentArea: [this.medicalSchedule.contentArea],
      note: [this.medicalSchedule?.note],
      staff: [this.medicalSchedule?.staff],
      scheduleTime: [this.datePipe.transform(this.medicalSchedule?.scheduleTime, 'dd-MM-yyyy'), [Validators.required]]
    })
  }

  handleUpdate = () => {
    this.isEdit = !this.isEdit;
    !this.isEdit && (this.scheduleForm = this.creatScheduleForm());
  }

  onGetStaffName = (staffId: string): string => {    
    return this.staffs?.find(val => val._id == staffId)?.fullName
  }

  getDateTime = (event) => {
    this.scheduleForm.get('scheduleTime').setValue(event);
  }

  onSaveForm = () => {
    if (this.scheduleForm.valid) {
      let scheduleData = this.scheduleForm.value;
      scheduleData.scheduleTime = this.formatDate.formatDate(scheduleData.scheduleTime, 'yyyy-MM-dd');
      this.store.dispatch(onUpdateMedicalSchedule(scheduleData));
      this.isEdit = !this.isEdit;
      return;
    };
    validateAllFormFields(this.scheduleForm);
    scrollToFirstInvalidControl(this.scheduleForm);
    this.cdr.detectChanges();
  }

  onRemoveMedicalSchedule = () => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn có muốn xóa lịch hẹn`;
    modal.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onRemoveMedicalSchedule(this.medicalSchedule));
      this.location.back();
    }).catch(error => { return console.log(error) })
  }

  onUpdateStatus = (status: string) => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Xác nhận bệnh nhân <b>${status}</b> phòng khám`;
    modal.result.then(result => {
      if (!result) { return }
      let medicalScheduleData = _.cloneDeep(this.medicalSchedule);
      medicalScheduleData.status = status;
      this.store.dispatch(onUpdateMedicalScheduleStatus(medicalScheduleData));
      this.location.back();
    }).catch( error => { return console.log(error)})
    
  }

  getLimitedDate = () => {
    let today = new Date();
    if (this.datePipe.transform(this.medicalSchedule?.scheduleTime, 'dd-MM-yyyy') !== this.datePipe.transform(today, 'dd-MM-yyyy')) {
      today.setDate(today.getDate() + 1);
    }
    this.minDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }

}
