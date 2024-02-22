import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/entities/state.entity';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { onLoadMedicalRecordDetailById } from 'src/app/store/actions/medicalRecord.action';
import * as _ from 'lodash';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import Staffs from '../../../../../../../at-common/model/Staffs';
import MedicalService from '../../../../../../../at-common/model/MedicalService';
import { onLoadMedicalService } from 'src/app/store/actions/medicalService.action';

@Component({
  selector: 'app-medicalrecord-book',
  templateUrl: './medicalrecord-book.component.html',
  styleUrls: ['./medicalrecord-book.component.scss']
})
export class MedicalrecordBookComponent implements OnInit {
  @ViewChild('tables', { static: false }) table: DatatableComponent;
  @Input() title: string;
  @Input() medicalrecord: any[] = [];
  medicalrecordSelect: any;
  staffs: Staffs[] = [];
  medicalService: MedicalService[] = [];
  columnRowDetail: Array<ColDef> = COL_DEF_ROW_DETAIL;
  columnDef = COL_DEF;
  constructor(public activeModal: NgbActiveModal, private destroyService: DestroySubsribeService, private store: Store<RootState>, private destroy: DestroySubsribeService) { }

  ngOnInit(): void {
    this.onLoadMedicalService();
    this.onLoadStaffs();
  }
  getMedicalServiceName = (id: string): string => {
    return this.medicalService.find(service => service._id === id)?.name;
  }
  onGetStaffName = (staffId: string): string => {
    return this.staffs?.find(val => val._id == staffId)?.fullName
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
  onSetStaff = (staffId) => {
    if (!staffId || staffId.length == 0) return '--';
    let staffValue = '';
    staffId?.forEach(staff => {
      staffValue = `${staffValue} ${this.onGetStaffName(staff)} <br>`;
    });
    return staffValue;
  }

  onToggleExpandRow = (row) => {
    this.table.rowDetail.collapseAllRows();
    this.medicalrecord.forEach(row => { row.medicalRecordDetail = [] });
    this.store.dispatch(onLoadMedicalRecordDetailById({ id: row._id }));
    this.store.select(state => state.medicalRecord.medicalRecordDetail)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalRecord => {
        if (!medicalRecord || !medicalRecord.treatmentProcesses) return;
        let medicalRecordData = _.cloneDeep(medicalRecord);
        medicalRecordData.treatmentProcesses = medicalRecordData.treatmentProcesses?.map((item) => {
          return {
            ...item,
            ...{
              staffName: this.onSetStaff(item.staffId),
              serviceName: this.getMedicalServiceName(item.serviceId),
            }
          }
        })
        row.medicalRecordDetail = _.cloneDeep(medicalRecordData.treatmentProcesses);
      })

    const timeout = setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(row);
      clearTimeout(timeout);
    }, 200);
  }
  onCollapseExpandRow = (row) => {
    this.medicalrecordSelect = null;
    this.table.rowDetail.toggleExpandRow(row);
  }
}
const COL_DEF: Array<ColDef> = [
  {
    name: 'Mã bệnh án',
    prop: 'medicalRecordCode',
    width: 100,
    router: true,
    path: '/kham-benh/phong-tong-quat/chi-tiet/i',
  },
  {
    name: 'Tên bệnh án',
    prop: 'medicalRecordName',
    width: 100,
  },
  {
    name: 'Bác sĩ điều trị',
    prop: 'staffName',
    width: 100,
  },
  {
    name: 'Ngày khám',
    prop: 'date',
    width: 100,
    colType: 'date'
  },
  {
    name: 'Trạng thái',
    prop: 'statusMedical',
    width: 100,
  },
];
export const COL_DEF_ROW_DETAIL: Array<ColDef> = [
  {
    name: 'Ngày',
    prop: 'processDay',
    colType: 'date',
    width: 100
  },
  {
    name: 'Dịch vụ',
    prop: 'serviceName',
    width: 100
  },
  {
    name: 'Chỉ định thực hiện',
    prop: 'note',
    width: 100
  },
  {
    name: 'Người thực hiện',
    prop: 'staffName',
    width: 100,
    colType: 'innerHTML',
  },
  {
    name: 'Trạng thái',
    prop: 'treatmentStatus',
    width: 100
  },
];
