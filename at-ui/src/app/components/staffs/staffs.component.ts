import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterParam } from 'src/app/shared/data/at.model';
import { SEX, STAFF_FILTER } from 'src/app/shared/enum/share.enum';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { RoleService } from 'src/app/shared/service/setting.service';
import { onLoadRoles } from 'src/app/store/actions/roles.action';
import { loadStaff, onLoadStaffFilter } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Role from '../../../../../at-common/model/Role';
import StaffCriterial from '../../../../../at-common/model/StaffCriterial';
import StaffData from '../../../../../at-common/model/StaffData';
import StaffReport from '../../../../../at-common/model/StaffReport';
import Staffs from '../../../../../at-common/model/Staffs';

@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
  styleUrls: ['./staffs.component.scss']
})
export class StaffsComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF;
  roles: Role[] = []
  conditionData = STAFF_FILTER;
  filterResult: FilterParam = 
  {condition: 'role', conditionSelect: this.conditionData.role, value: null, fromDate: null, toDate: null}
  renderSelect: Array<any> = [];
  filter = new StaffReport();
  staffFilter = new StaffCriterial();
  staffs: StaffData[] = [];

  constructor(
    private store: Store<RootState>,
    private dataService: RoleService,
    private destroyService: DestroySubsribeService
  ) {
  }

  ngOnInit(): void {
    this.onLoadRole();
    this.onLoadStaffs();
  }

  onStaffLoginId = (): void => {
    this.store.select(state => state.authencation._id)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(_id => {
        if (!_id) return;
        this.staffs = this.staffs.filter(x => x.staffId != _id) 
      })
  }

  onLoadStaffs = (): void => {
    this.filter.filter = this.staffFilter;
    this.store.dispatch(onLoadStaffFilter(this.filter))
    this.store.select(state => state.staff.staffFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(staff => {
        if (!staff) return this.staffs = [];
        this.staffs = staff.datas.map((item) => {
          return { ...item, ...{ _id: item.staffId } }
        })
        this.onStaffLoginId();
      })
  }

  onLoadRole = ():void => {
    this.store.dispatch(onLoadRoles());
    this.store.select(state => state.role.roles)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe( role =>  role && (this.roles = role))
  }

  onSearch(event):void {
    let filter = {...this.staffFilter}
    filter.name = event
    this.staffFilter = filter;
    this.onLoadStaffs();
  }

  onFilterConditionChange = ():void => {
    Object.entries(STAFF_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.fromDate = null;
    this.filterResult.toDate = null;
  }

  onAddCondiotion = ():void => {
    let newFilter;
    if ( (this.filterResult.condition && this.filterResult.value) || 
          (this.filterResult.condition && this.filterResult.fromDate && this.filterResult.toDate) ) {
      if ( this.filterResult.condition == 'birthday' ) {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: null,
          from: this.filterResult.fromDate,
          to: this.filterResult.toDate
        }
      } else {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: this.filterResult.value,
          from: null,
          to: null
        }
      }
      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }

      let filter = {...this.staffFilter}
      if ( this.filterResult.conditionSelect == STAFF_FILTER.role ) {
        filter.role = this.filterResult.value
      } else {
        filter.birthDayFrom = this.filterResult.fromDate;
        filter.birthDayTo = this.filterResult.toDate;
      }
      this.staffFilter = filter;
      this.onLoadStaffs();
    }
  }

  onRemoveFilter = (param):void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = {...this.staffFilter}
    if ( param.firstCondition == STAFF_FILTER.role ) {
      filter.role = null;
    } else {
      filter.birthDayFrom = null;
      filter.birthDayTo = null;
    }
    this.staffFilter = filter;
    this.onLoadStaffs();
  }

  handleEventStaff = ():void => {
  }

  onDelete = (event):void => {
    console.log(event);
  }

  ngOnDestroy(): void {
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Mã NV',
    prop: 'staffCode',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: true,
    path: 'I',
  },
  {
    name: 'Tên nhân viên',
    prop: 'fullName',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Số điện thoại',
    prop: 'tel',
    width: 100,
    colType: 'tel',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Ngày sinh',
    prop: 'birthday',
    width: 100,
    colType: 'date',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Vai trò',
    prop: 'role',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
];
