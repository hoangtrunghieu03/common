import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { ReceiptComponent } from 'src/app/components/commitment/receipt/receipt.component';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterModel } from 'src/app/shared/data/at.model';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onCreateDeliveryNote } from 'src/app/store/actions/DeliveryNote.action';
import { onLoadArcMakingFilter, onUpdateStatusArcMaking } from 'src/app/store/actions/medicalSchedule.action';
import { onLoadServiceIndicate } from 'src/app/store/actions/serviceIndicate.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalScheduleReport from '../../../../../../../at-common/model/MedicalScheduleReport';
import MedicalServiceIndicate from '../../../../../../../at-common/model/MedicalServiceIndicate';
import { ARCMAKING_STATUS, DELIVERYNOTE_TYPE, TYPE_SCHEDULE } from '../../../../../../../at-common/model/enum';
import { COL_DEF_BOW_MAKING } from '../../reception/bow-making-reception/bow-making-reception.component';

export enum BOW_MAKING_FILTER {
  dateDelivery = 'Ngày giao',
  dateReceiver = 'Ngày nhận dấu',
  status = 'Trạng thái',
  executeOutSide = 'Nơi làm'
}

export enum BOW_MAKING_STATUS {
  CONFIRM = 'Đã xác nhận',
  NOT_CONFIRM = 'Chưa xác nhận'
}

export enum BOW_MAKING_WORKPLACE {
  IN_SIDE = 'Làm trong',
  OUT_SIDE = 'Làm ngoài'
}
class ActionRole {
  updateStatusArcMaking: boolean = false;
}

@Component({
  selector: 'app-bow-making-list',
  templateUrl: './bow-making-list.component.html',
  styleUrls: ['./bow-making-list.component.scss'],
  providers: [DatePipe]
})
export class BowMakingListComponent implements OnInit {

  conditionData = BOW_MAKING_FILTER;
  filterResult: FilterModel = new FilterModel('dateDelivery', this.conditionData.dateDelivery, null);
  renderSelect: Array<any> = [];

  columnDef: Array<ColDef> = COL_DEF_BOW_MAKING;
  bowMakingList: Array<any> = [];
  bowMakingSelected = [];
 
  bowMakingStatus = [];
  confirmStatus = BOW_MAKING_STATUS;
  arcMakingStatus = ARCMAKING_STATUS;
  bowMakingWorkplace = BOW_MAKING_WORKPLACE;

  filters = new MedicalScheduleReport();

  medicalServiceIndicate: MedicalServiceIndicate[] = [];

  actionRole: ActionRole = null;

  constructor(
    private modal: NgbModal,
    private activeRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    public location: Location
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(onLoadServiceIndicate());
    this.bowMakingStatus = Object.values(ARCMAKING_STATUS).map((item) => ({ label: item, value: item }));
    this.onAddFilterDate();
    this.onLoadRoleStaff();
  }

  onLoadRoleStaff = () => {
    this.store.select(state => state.role.roleStaffLogin)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((role) => {
        if (!role) return;
        this.store.select(state => state.staff.staffLogin)
          .pipe(takeUntil(this.destroy.destroySub$))
          .subscribe((staff: any) => {
            if (!staff) return;
            this.actionRole = new ActionRole();
            this.actionRole.updateStatusArcMaking = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x =>
              x.group === 'Khám bệnh' && x.dataAccessName === 'Cập nhật trạng thái làm cung');
          })
      })
  }


  onLoadMedicalSchedule = (): void => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadArcMakingFilter(this.filters));
    this.store.select(state => state.medicalSchedule.arcMakingFilter)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalScheduleFilter => {
        this.bowMakingSelected = [];
        if (!medicalScheduleFilter) return this.bowMakingList = [];
        this.bowMakingList = medicalScheduleFilter;
        this.onLoadMedicalServiceIndicate();
      }
      )
  }

  onLoadMedicalServiceIndicate = (): void => {
    this.store.select(state => state.serviceIndicate.serviceIndicates)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(service => {
        if (!service) return;
        this.medicalServiceIndicate = service;
        this.bowMakingList = this.bowMakingList?.map((item) => { return { ...item, ...{ medicalServiceIndicate: this.getMedicalServiceIndicateName(item.medicalServiceIndicateId) } } });
      })
  }

  onAddFilterDate = () => {
    let filter = { ...this.filters.filter };

    filter.deliveryDateFrom = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    filter.deliveryDateTo = this.datePipe.transform(new Date().setDate(new Date().getDate() + 7), 'yyyy-MM-dd');

    this.renderSelect.push(
      {
        key: 'dateDelivery',
        firstCondition: this.conditionData.dateDelivery,
        from: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        to: this.datePipe.transform(new Date().setDate(new Date().getDate() + 7), 'yyyy-MM-dd')
      }
    );

    this.renderSelect.push(
      {
        key: 'status',
        firstCondition: this.conditionData.status,
        secondCondition: true,
      }
    );

    this.renderSelect.push(
      {
        key: 'executeOutSide',
        firstCondition: this.conditionData.executeOutSide,
        secondCondition: false,
      }
    );

    filter.isConfirm = true;
    filter.executeOutSide = false;

    this.filters.filter = filter;
    this.onLoadMedicalSchedule();
  }

  onChangeStatus = (event, row) => {
    let bowMaking = {
      _id: row._id,
      statusArc: event.target.value,
      scheduleReport: this.filters
    }
    this.store.dispatch(onUpdateStatusArcMaking(bowMaking));
  }

  onSelect({ selected }): void {
    this.bowMakingSelected.splice(0, this.bowMakingSelected.length);
    this.bowMakingSelected.push(...selected);
  }

  onMedicalRecordSampleDelivery = (type: string): void => {
    const modal: NgbModalRef = this.modal.open(ReceiptComponent, {
      centered: true,
      size: 'xl',
      windowClass: 'modal-commitment'
    })
    modal.componentInstance.bowMakingList = this.bowMakingSelected;
    modal.componentInstance.typeDeliveryNote = DELIVERYNOTE_TYPE.RECEIPT_LABO;
    modal.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onCreateDeliveryNote({ deliveryNote: result, scheduleReport: _.cloneDeep(this.filters) }));
    }).catch(error => {
    })
  }

  onSearch(event): void {
    let filter = { ...this.filters.filter };
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadMedicalSchedule();
  }

  onFilterConditionChange = (): void => {
    Object.entries(BOW_MAKING_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.fromDate = null;
    this.filterResult.toDate = null;
  }

  onAddCondiotion = (): void => {
    if (this.filterResult.condition && ((this.filterResult.fromDate && this.filterResult.toDate) || this.filterResult.value != null)) {
      let newFilter: any = null;
      if (this.filterResult.condition == 'dateDelivery' || this.filterResult.condition == 'dateReceiver') {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          from: this.filterResult.fromDate,
          to: this.filterResult.toDate
        }
      } else {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: this.filterResult.value,
        }
      }

      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }

      let filter = { ...this.filters.filter }
      if (this.filterResult.conditionSelect == BOW_MAKING_FILTER.dateDelivery) {
        filter.deliveryDateFrom = this.filterResult.fromDate;
        filter.deliveryDateTo = this.filterResult.toDate;
      } else if (this.filterResult.conditionSelect == BOW_MAKING_FILTER.dateReceiver) {
        filter.sampleReceiveDateFrom = this.filterResult.fromDate;
        filter.sampleReceiveDateTo = this.filterResult.toDate;
      } else if (this.filterResult.conditionSelect == BOW_MAKING_FILTER.status) {
        filter.isConfirm = this.filterResult.value;
      } else {
        filter.executeOutSide = this.filterResult.value;
      }
      
      this.filters.filter = filter;
      this.onLoadMedicalSchedule();
    }
  }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter }
    if (param.firstCondition == BOW_MAKING_FILTER.dateDelivery) {
      filter.deliveryDateFrom = null;
      filter.deliveryDateTo = null;
    } else if (param.firstCondition == BOW_MAKING_FILTER.dateReceiver) {
      filter.sampleReceiveDateFrom = null;
      filter.sampleReceiveDateTo = null;
    } else if (param.firstCondition == BOW_MAKING_FILTER.status) {
      filter.isConfirm = null;
    } else {
      filter.executeOutSide = null;
    }
    this.filters.filter = filter;
    this.onLoadMedicalSchedule();
  }

  getMedicalServiceIndicateName = (id: string): string => {
    return this.medicalServiceIndicate.find(service => service._id === id)?.name;
  }

  onCheckDisable
}