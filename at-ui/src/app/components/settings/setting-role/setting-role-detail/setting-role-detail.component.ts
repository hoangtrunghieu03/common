import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { RoleService } from 'src/app/shared/service/setting.service';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import Role from '../../../../../../../at-common/model/Role';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/entities/state.entity';
import { createRole, onloadRoleItem, onUpdateRole, onDeleteRole } from 'src/app/store/actions/roles.action';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import * as _ from 'lodash';
import { showNotify } from 'src/app/store/actions/notify.action';

@Component({
  selector: 'app-setting-role-detail',
  templateUrl: './setting-role-detail.component.html',
  styleUrls: ['./setting-role-detail.component.scss'],
  providers: [DestroySubsribeService],
})
export class SettingRoleDetailComponent implements OnInit {
  roleForm: FormGroup;
  validateForm = validateForm;
  role = new Role();
  contentForm = ROLE_FORM;
  isEdit: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private roleService: RoleService,
    public location: Location,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private route: ActivatedRoute,
    public _location: Location,
    private modal: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadRole();
  }

  loadRole(): void {
    this.roleForm = this.createRoleForm();
    this.route.queryParams.subscribe((param) => {
      if (param && param._id) {
        this.onLoadRoleActive(param._id);
      }
    })
  }

  onLoadRoleActive = (roleId: string): void => {
    this.store.dispatch(onloadRoleItem({ roleId: roleId }));
    this.store
      .select((state) => state.role.roleItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((role) => {
        if (!role) return;
        this.role = role;
        this.roleForm = this.createRoleForm();
        let dataAccessList = [];
        role.dataAccesses.forEach((element) => {
          dataAccessList.push(element.dataAccessName);
        });
        this.roleForm.get('dataAccessNames').setValue(dataAccessList);
      });
  }

  createRoleForm = (): FormGroup => {
    return this._formBuilder.group({
      _id: [this.role?._id],
      roleName: [this.role?.roleName, [Validators.required]],
      dataAccessNames: [[]],
    });
  };

  onSaveRole = (): void => {
    if (this.roleForm.valid) {
      let data = this.roleForm.value;
      if (data?.dataAccessNames?.length <= 0) {
        return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Không thể để trống vai trò!' }));
      }
      if (this.role?._id) {
        this.store.dispatch(onUpdateRole(data));
        this.isEdit = !this.isEdit;
      } else {
        this.store.dispatch(createRole(data));
      }
    } else {
      validateAllFormFields(this.roleForm);
      scrollToFirstInvalidControl(this.roleForm);
    }
  }

  onSelectDataAccess = (event): void => {
    let dataAccessList = [...this.roleForm.get('dataAccessNames').value];
    let index = dataAccessList.findIndex((val) => val == event.dataAccessName);

    if (index > -1) {
      dataAccessList.splice(index, 1);
    } else {
      dataAccessList.push(event.dataAccessName);
    }
    this.roleForm.get('dataAccessNames').setValue(dataAccessList);
  }

  onCheck = (): void => {
    this.isEdit = !this.isEdit
    if (!this.isEdit){
      this.roleForm = this.createRoleForm();

    }
    this.roleForm.get('dataAccessNames').setValue(this.role.dataAccesses.map(room => room.dataAccessName));
  }

  onDeleteRole = (): void => {
      const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
        centered: true,
        size: 'md'
      })
      modal.componentInstance.title = 'Xác nhận';
      modal.componentInstance.content = `Bạn muốn xóa vai trò <b>${this.role.roleName}</b>`;
      modal.result.then(result => {
        if (!result) return;
        this.store.dispatch(onDeleteRole(this.role));
        this.location.back();
        }).catch(error => {
      })
  }

}

const ROLE_FORM = [
  {label: 'Tên vai trò', formName: 'roleName', isUpdate: true, type: '', update: true},
]
