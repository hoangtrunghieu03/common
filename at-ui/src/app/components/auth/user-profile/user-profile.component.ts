import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { FormatDateComponent, formatPhoneNumber, regexEmail, regexFormEmail, regexFormTel, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onloadRoleItem, onLoadRoles } from 'src/app/store/actions/roles.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { createStaff, deleteStaff, loadStaff, loadStaffItem, onUpdateStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Room from '../../../../../../at-common/model/Room';
import Staffs from '../../../../../../at-common/model/Staffs';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-staff-form',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [DatePipe, FormatDateComponent]
})
export class UserProfileComponent implements OnInit {

  staffForm: FormGroup;
  contentForm = CONTENT_FORM;

  staffs: Staffs[] = [];
  staffInfo = new Staffs();

  roles: {label: string, value: string | any}[];
  rooms: Room[] = [];
  isEdit: boolean = false;

  minDate: { year: number; month: number; day: number; };
  maxDate: { year: number; month: number; day: number; };

  validateForm = validateForm;
  regexEmail = regexEmail;
  formatPhoneNumber = formatPhoneNumber;
  validateAllFormFields = validateAllFormFields;
  scrollToFirstInvalidControl = scrollToFirstInvalidControl;

  constructor(
    private _formBuilder: FormBuilder,
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
    this.onLoadStaffs();

    this.store.select(state => state.authencation._id)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(_id => {
      if (!_id) return;
      this.onLoadStaffActive(_id);
      this.isEdit = true;
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
      roomIds: [!this.staffInfo._id ? this.rooms.map(room => room._id) : this.staffInfo.roomIds,[Validators.required]],
    })
  }

  ValidatorTel = (tel: string | number):Observable<boolean> => {
    let isValid:boolean = this.staffs.filter(val=> val._id != this.staffInfo._id).every(val => val.tel !== tel)
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

  onChangeValueSelected = (event) => {
    this.staffInfo._id && this.store.dispatch(onloadRoleItem({ roleId: event }));
  }

  onSaveForm = (): void => {
    if (this.staffForm.valid) {
      this.staffForm.get('birthday').setValue(this.formatDate.formatDate(this.staffForm.get('birthday').value, 'yyyy-MM-dd'));
      this.staffForm.get('tel').setValue(this.staffForm.get('tel').value.replaceAll(' ', ''));
      if (this.staffInfo?._id) {
        this.store.dispatch(onUpdateStaff(this.staffForm.value));
        this.isEdit = true;
      } else {
        this.store.dispatch(createStaff(this.staffForm.value));
      }
    }
    validateAllFormFields(this.staffForm);
    scrollToFirstInvalidControl(this.staffForm);
  }

  onChangePassword = (): void => {
    const modal: NgbModalRef = this.modal.open(ChangePasswordComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.staffId = this.staffInfo._id
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

  onGetRoomName = (roomId: string) => {
    return this.rooms.find(room => room._id === roomId)?.name;
  }

  getLimitedDate = () => {
    let day: number = new Date().getDate();
    let month: number = new Date().getMonth() + 1;
    let year: number = new Date().getFullYear();
  
    this.minDate = {year: year - 100, month:month, day:day};
    this.maxDate = {year: year , month:month, day:day};
  }

  handleUpdate = () => {
    this.isEdit = !this.isEdit;
    this.isEdit && (this.staffForm = this.createStaffForm());
  }

  ngOnDestroy(): void {
  }

}

const CONTENT_FORM = [
  { label: 'Tên nhân viên', formName: 'fullName', isUpdate: true, type: '', require: true },
  { label: 'Số điện thoại', formName: 'tel', isUpdate: true, type: 'phoneNumber', require: true },
  { label: 'Email', formName: 'email', isUpdate: true, type: '', require: false },
  { label: 'Vai trò', formName: 'roleId', isUpdate: true, type: '', disable: true, require: true },
]
