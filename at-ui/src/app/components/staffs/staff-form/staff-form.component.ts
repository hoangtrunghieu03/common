import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { FormatDateComponent, formatPhoneNumber, regexEmail, regexFormEmail, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onGetDataAccess, onloadRoleItem, onLoadRoles } from 'src/app/store/actions/roles.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { createStaff, deleteStaff, loadStaff, loadStaffItem, onUpdateStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import DataAccess from '../../../../../../at-common/model/DataAccess';
import Role from '../../../../../../at-common/model/Role';
import Room from '../../../../../../at-common/model/Room';
import Staffs from '../../../../../../at-common/model/Staffs';
import { regexFormTel } from '../../../shared/functions/function-helper';

@Component({
  selector: 'app-staff-form',
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.scss'],
  providers: [DatePipe, FormatDateComponent]
})
export class StaffFormComponent implements OnInit {

  staffForm: FormGroup;
  contentForm = CONTENT_FORM;

  staffs: Staffs[] = [];
  staffInfo = new Staffs();

  roles: {label: string, value: string | any}[];
  roleInfo = new Role();
  rooms: Room[] = [];
  isEdit: boolean = false;

  dataAccess: DataAccess[] = [];
  mapDataAccess = new Map();
  dataAccessGroup: string[] = [];

  minDate: { year: number; month: number; day: number; };
  maxDate: { year: number; month: number; day: number; };

  regexEmail = regexEmail;
  validateForm = validateForm;
  formatPhoneNumber = formatPhoneNumber;
  validateAllFormFields = validateAllFormFields;
  scrollToFirstInvalidControl = scrollToFirstInvalidControl;

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<RootState>,
    public _location: Location,
    private destroyService: DestroySubsribeService,
    private datePipe: DatePipe,
    private formatDate: FormatDateComponent,
    private modal: NgbModal
  ) {
    this.staffForm = this.createStaffForm();
   }

  ngOnInit(): void {
    this.getLimitedDate();
    this.onLoadRooms();
    this.onLoadRoles();
    this.onLoadDataAccess();
    this.onLoadStaffs();

    this.route.queryParams.subscribe(param => {
      if ( param && param._id ) {
        this.onLoadStaffActive(param._id);
        this.isEdit = true;
      }
    })
  }

  onLoadStaffActive = (staffId: string):void => {
    this.store.dispatch(loadStaffItem({staffId: staffId}));
    this.store.select(state => state.staff.staffItem)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(staff => {
      if ( !staff ) { return }
      this.staffInfo = staff;
      this.staffForm = this.createStaffForm();
      this.onLoadRoleActive();
    })
  }

  onLoadStaffs = ():void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe( staff => staff && (this.staffs = staff));
  }

  onLoadRooms = ():void => {
    this.store.dispatch(onLoadRooms())
    this.store.select(state => state.room.rooms)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(rooms => {
      if (!rooms) return;
      this.rooms = rooms;
      this.staffForm = this.createStaffForm();
    })
  }

  onLoadRoles = (): void => {
    this.store.dispatch(onLoadRoles());
    this.store.select(state => state.role.roles)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(role => {
        if (!role) return;
        this.roles = role.map((item) => ({ label: item.roleName, value: item._id }))
      })
  }

  onLoadRoleActive = (): void => {
    this.store
      .select((state) => state.role.roleItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((role) => {
        if (!role) return;
        this.roleInfo = role;
        this.onAddRoom();
      });
  }

  createStaffForm = (): FormGroup => {
    return this._formBuilder.group({
      _id: [this.staffInfo._id],
      staffCode: [this.staffInfo.staffCode],
      fullName: [this.staffInfo.fullName, [Validators.required]],
      tel: [this.staffInfo.tel, [Validators.required, regexFormTel], this.validIncludeTel.bind(this)],
      email: [this.staffInfo.email, [regexFormEmail]],
      roleId: [this.staffInfo.roleId, [Validators.required]],
      birthday: [this.datePipe.transform(this.staffInfo.birthday, 'dd-MM-yyyy'),[Validators.required]],
      dataAccessNameExtends: [this.staffInfo.dataAccessNameExtends?.map(x => x['dataAccessName'])],
      roomIds: [!this.staffInfo._id ? [] : this.staffInfo.roomIds],
    })
  }

  ValidatorTel = (tel: any):Observable<boolean> => {
    let isValid:boolean = this.staffs.filter(val=> val._id != this.staffInfo._id).every(val => val.tel !== tel.replaceAll(' ', ''))
    return of(isValid)
  }

  validIncludeTel = (control: AbstractControl):Observable<ValidationErrors | null> => {
    return timer(500)
    .pipe(
      switchMap(() =>
        this.ValidatorTel(control.value)
        .pipe(
          map(isValid => {
            if ( isValid ) {
              return null
            }
            return {
              telDuplicated: true
            }
          }
        )
      ))
    )
  }

  onLoadDataAccess = (): void => {
    this.store.dispatch(onGetDataAccess());
    this.store.select(state => state.role.dataAccess)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(result => {
        this.mapDataAccess = new Map();
        this.dataAccessGroup = [];
        let dataAccess: DataAccess[] = [];
        if (!result) { return }
        let arrayForSort = [...result]
        arrayForSort.sort((a, b) => {
          return Number(a.groupOrder) - Number(b.groupOrder);
        });

        for (let item of arrayForSort) {

          if (this.mapDataAccess.has(item.group)) {

            dataAccess = this.mapDataAccess.get(item.group);

          } else {

            if (!this.dataAccessGroup.includes(item.group)) {

              this.dataAccessGroup.push(item.group);

            }
            dataAccess = new Array<DataAccess>();
          }
          dataAccess.push(item);
          this.mapDataAccess.set(item.group, dataAccess);
        }
      })
  }

  handleCheckboxChange = (event) => {
    if (this.roleInfo?.dataAccesses?.some(val => val.dataAccessName === event.target.value)) return event.target.checked = !event.target.checked;

    let dataAccessNameExtends = Object.assign([], this.staffForm.get('dataAccessNameExtends').value);
    let index = dataAccessNameExtends.findIndex(val => val == event.target.value);
    if (index > -1) {
      dataAccessNameExtends.splice(index, 1)
    } else {
      dataAccessNameExtends.push(event.target.value)
    }    
    this.staffForm.get('dataAccessNameExtends').setValue(dataAccessNameExtends);
    this.onAddRoom();
  }

  onChangeValueSelected = (event) => {
    this.store.dispatch(onloadRoleItem({ roleId: event }));
    this.onLoadRoleActive();
  }

  handelChecked = (value) => {
    if (this.roleInfo?.dataAccesses?.some(val => val.dataAccessName === value)) return true;
    if (this.staffForm.get('dataAccessNameExtends').value?.some(val => val === value)) return true;
  }

  onSaveForm = (): void => {
    if (this.staffForm.valid) {
      let staffData = this.staffForm.value;
      staffData.birthday = this.formatDate.formatDate(this.staffForm.get('birthday').value, 'yyyy-MM-dd');
      staffData.tel = staffData.tel.replaceAll(' ', '');
      if (this.staffInfo?._id) {
        this.store.dispatch(onUpdateStaff(staffData));
        this.isEdit = true;
      } else {
        this.store.dispatch(createStaff(staffData));
      }
    }
    validateAllFormFields(this.staffForm);
    scrollToFirstInvalidControl(this.staffForm);
  }

  onRemoveStaff = (): void => {

    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn muốn xóa nhân viên <b>${this.staffInfo?.fullName}</b>`;
    modal.result.then(result => {
      if (!result) return;
      this.store.dispatch(deleteStaff(this.staffInfo));
      this._location.back();
    }).catch(error => {
    })
  }

  getRoleName = (roleId: string):string => {
    return this.roles.find(role => role.value === roleId)?.label
  }

  handleUpdate = () => {
    this.isEdit = !this.isEdit;
    this.isEdit && (this.staffForm = this.createStaffForm());
  }
  
  onAddRoom = () => {
    let dataAccess: Array<any> = this.roleInfo.dataAccesses?.map(x => x.dataAccessName);
    dataAccess = dataAccess.concat(this.staffForm.get('dataAccessNameExtends').value);
    if (!dataAccess || dataAccess.length === 0) return this.staffForm.get('roomIds').setValue([]);
    let roomIds = [];
    this.rooms.forEach(room => {
      if (dataAccess.some(dataAccessName => dataAccessName.toLocaleLowerCase().includes(room.name.toLocaleLowerCase()))) {
        roomIds.push(room._id);
      }
    });
    this.staffForm.get('roomIds').setValue(roomIds);
  }

  getLimitedDate = () => {
    let day: number = new Date().getDate();
    let month: number = new Date().getMonth() + 1;
    let year: number = new Date().getFullYear();
  
    this.minDate = {year: year - 100, month:month, day:day};
    this.maxDate = {year: year , month:month, day:day};
  }

  onGetRoomName = (roomId: string) => {
    return this.rooms.find(room => room._id === roomId)?.name;
  }

  ngOnDestroy(): void {
  }

}

const CONTENT_FORM = [
  { label: 'Tên nhân viên', formName: 'fullName', isUpdate: true, type: '', require: true },
  { label: 'Số điện thoại', formName: 'tel', isUpdate: true, type: 'phoneNumber', require: true },
  { label: 'Email', formName: 'email', isUpdate: true, type: '', require: false },
  { label: 'Vai trò', formName: 'roleId', isUpdate: true, type: '', require: true },
]
