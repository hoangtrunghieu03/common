import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DataCustomToPrint } from 'src/app/shared/data/at.model';
import { PRINT_STATUS } from 'src/app/shared/enum/share.enum';
import { formatPhoneNumber } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { PrintService } from 'src/app/shared/service/print.service';
import { onLoadMedicalRecordDetailById } from 'src/app/store/actions/medicalRecord.action';
import { onLoadSettings } from 'src/app/store/actions/setting.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../../../at-common/model/Customer';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import Staffs from '../../../../../../../at-common/model/Staffs';
import { to_vietnamese } from '../../../functions/convertNumberToCharacter';
import ColumnDef from '../../at-base-table/at-base-table.component';

@Component({
  selector: 'app-medical-record-print',
  templateUrl: './medical-record-print.component.html',
  styleUrls: ['./medical-record-print.component.scss']
})
export class MedicalRecordPrintComponent implements OnInit {

  dataCustom: DataCustomToPrint = new DataCustomToPrint();

  customer: Customer = new Customer();
  staffs: Staffs[] = [];
  staffLoginId: string = null;

  subject = new Subject();

  services: Array<MedicalBaseModel> = [];
  viewMedicalRecordFee: MedicalBaseModel[] = [];
  columnDef = COLDEF;

  to_vietnamese = to_vietnamese;
  formatPhoneNumber = formatPhoneNumber;

  dateCurrent: any = [];

  constructor(
    private printService: PrintService,
    private activeRoute: ActivatedRoute,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private datePipe: DatePipe,
  ) {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe(() => this.printService.onDataReady())
    this.dateCurrent = this.datePipe.transform(new Date, 'dd-MM-yyyy', 'UTC')?.split('-');
  }

  ngOnInit(): void {
    this.store.dispatch(onLoadSettings());
    this.onLoadStaffs();
    this.onLoadStaffLogin();
    this.onLoadCustomer();
    this.activeRoute.queryParams.subscribe(param => {
      if (param && param._id) {
        this.onLoadMedicalRecord();
      }
    })

    this.subject.next(true);
    this.onHandleData();
  }

  onHandleData() {
    this.services.forEach((item) => {
      const result = this.viewMedicalRecordFee.some((item1,index) => {
        if (item1?.id === item.id) {  
          item1 = {
            ...item1,
            discountMoney : item1.discountMoney + item.discountMoney, 
            quantity: item1.quantity + item.quantity,
            totalMoney: item1.totalMoney + item.totalMoney,
          }
        this.viewMedicalRecordFee.splice(index ,1);
        this.viewMedicalRecordFee.push(item1);  
          return true;
        }
        return false; 
      })
      if (!result) {
        this.viewMedicalRecordFee.push(item);
      }
      this.services = this.viewMedicalRecordFee;
    })
  }

  onLoadStaffs = (): void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(staff => staff && (this.staffs = staff))
  }

  onLoadStaffLogin = (): void => {
    this.store.select(state => state.authencation._id)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(staffId => staffId && (this.staffLoginId = staffId))
  }

  onLoadMedicalRecord = (): void => {
    this.printService.medicalRecordPrint.subscribe(val => {
      if (val === PRINT_STATUS.medicalRecordPrint) return;
      this.dataCustom = JSON.parse(val);
      this.services = this.dataCustom?.medicalServiceIndicates?.concat(this.dataCustom?.medicalServices).filter(x => x.totalMoney != 0);
    })
  }

  onLoadCustomer = (): void => {
    this.store.select(state => state.customer.customerItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(customer => {
        if (!customer) return;
        this.customer = customer;
      })
  }

  getStaffName = (staffId: string): string => {
    return this.staffs.find(staff => staff._id === staffId)?.fullName;
  }

}

const COLDEF: ColumnDef[] = [
  {
    title: 'name',
    label: 'Nội dung dịch vụ',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    title: 'quantity',
    label: 'SL',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    title: 'money',
    label: 'Giá dịch vụ',
    colType: 'money',
    headerStyle: 'text-align: center',
    style: 'text-align: right; padding-right: 12px'
  },
  {
    title: 'discountMoney',
    label: 'Giảm giá',
    colType: 'money',
    headerStyle: 'text-align: center',
    style: 'text-align: right; padding-right: 12px'
  },
  {
    title: 'totalMoney',
    label: 'Thành tiền',
    colType: 'money',
    headerStyle: 'text-align: center',
    style: 'text-align: right; padding-right: 12px'
  },
]
