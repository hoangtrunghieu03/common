import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { RoleService } from 'src/app/shared/service/setting.service';
import { RootState } from 'src/app/store/entities/state.entity';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadRolesList } from 'src/app/store/actions/roles.action';
import Role from '../../../../../../at-common/model/Role';

@Component({
  selector: 'app-setting-role',
  templateUrl: './setting-role.component.html',
  styleUrls: ['./setting-role.component.scss'],
  providers: [DestroySubsribeService],
})
export class SettingRoleComponent implements OnInit {
  columnDef: Array<ColDef> = COL_DEF;
  roles = [];
  rolesList: Role[] = [];
  renderSelect: Array<any> = [];

  constructor(
    private _modal: NgbModal,
    private roleService: RoleService,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService
  ) {}

  ngOnInit(): void {
    this.onLoadRolesList();
  }

  onLoadRolesList = (): void => {
    this.store.dispatch(onLoadRolesList());
    this.store
      .select((state) => state.role.rolesList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((roleList) => {
        roleList && (this.rolesList = roleList);
      });
  }

  onSearch(event):void {

  }

  handleEventService = ():void => {
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên vai trò',
    prop: 'roleName',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: true,
    path: 'i',
  },
  {
    name: 'Nhân viên',
    prop: 'staffCount',
    width: 200,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  }
];
