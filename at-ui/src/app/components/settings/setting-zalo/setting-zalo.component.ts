import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import ZaloInfo from '../../../../../../at-common/model/ZaloInfo';
import Setting from '../../../../../../at-common/model/Setting';
import { onCreateSetting, onLoadSettings, onUpdateSetting } from 'src/app/store/actions/setting.action';
import { takeUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/entities/state.entity';
import { Store } from '@ngrx/store';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadZaloCurrent, onUpdateZalo } from 'src/app/store/actions/zalo.action';
import * as _ from 'lodash';
import { SETTING_NAME, SETTING_TYPE } from '../../../../../../at-common/model/enum';
import { showNotify } from 'src/app/store/actions/notify.action';
@Component({
  selector: 'app-setting-zalo',
  templateUrl: './setting-zalo.component.html',
  styleUrls: ['./setting-zalo.component.scss']
})
export class SettingZaloComponent implements OnInit {
  isEdit =  type_setting;
  typeEdit = TYPE_EDIT;
  ZaloInfoForm: FormGroup;
  zalos: ZaloInfo;
  NotificationForm: FormGroup;
  settingNotificationList : Setting[] = [];
  newWindown : Window;
  dateToken : number;
  urlZaloCurrent:string = 'https://oauth.zaloapp.com/v4/oa';
  validateForm = validateForm;
  ZaloInfo: Array<{label: string, formName: string,required: boolean}> = ZALO_INFO;
  notificationContent: Array<{label: string, formName: string,required: boolean}> = NOTIFICATION_CONTENT;
  constructor(public location: Location,private _formBuilder: FormBuilder ,  private store: Store<RootState>,  private destroy: DestroySubsribeService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.onLoadSetting();
    this.onLoadZaloInfo();
  }
  myEventListener = (event) => {
    if (event.key === 'myDataKey') {
      const result = JSON.parse(event.newValue);
      if (result?.code == 200) {
        this.onLoadZaloInfo();
        this.store.dispatch(showNotify({ notifyType: 'success', message: 'Xác thực thành công' }));
      } else {
        this.store.dispatch(showNotify({ notifyType: 'error', message: 'Xác thực thất bại' }));
      }
    }else {
      this.store.dispatch(showNotify({ notifyType: 'error', message: 'Xác thực thất bại!' }));
    }
    window.removeEventListener('storage', this.myEventListener);
  };
  checkDateToken(TokenEndDate) {
    if (!TokenEndDate) return;
    let date = new Date();
    let dateResetToken =  new Date(TokenEndDate);
    let timeDiff = dateResetToken.getTime() - date.getTime();
    let dateLeft = Math.ceil(timeDiff / (1000 * 3600 * 24) - 1);
    this.dateToken = dateLeft
  }
  onLoadSetting(): void {
    this.store.dispatch(onLoadSettings());
    this.store.select(state => state.setting.settings)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(setting => {
        if (!setting) return;
        this.settingNotificationList = _.cloneDeep(setting);
        this.NotificationForm = this.createNotificationAppointment();
      })
  }
  onLoadZaloInfo() {
    this.store.dispatch(onLoadZaloCurrent());
    this.store.select(state => state.zalo.zaloInfoItem)
    .pipe(takeUntil(this.destroy.destroySub$))
        .subscribe(zalo => {
          if (!zalo) return;
          this.zalos = _.cloneDeep(zalo);
          this.checkDateToken(this.zalos?.date_expire_refresh);
          this.ZaloInfoForm = this.createZaloInfoForm();
        })
  }
  handleUpdateService = (type): void => {
    const newIsEdit = _.mapValues(this.isEdit, () => false);
    if (TYPE_EDIT.ZALO == type) {
      newIsEdit.zaloStingEdit = !this.isEdit.zaloStingEdit;
      this.ZaloInfoForm = this.createZaloInfoForm();
    } else {
      newIsEdit.notificationStingEdit = !this.isEdit.notificationStingEdit;
    }
    this.isEdit = newIsEdit;
  }
  createZaloInfoForm(): FormGroup {
    const zalo = this.zalos;
    return this._formBuilder.group({
      QAZALOID: [zalo?.oa_id , [Validators.required]],
      idApp : [zalo?.app_id, [Validators.required]],
      keyApp : [zalo?.secret_key, [Validators.required]],
      url : [zalo?.url ? zalo?.url : this.urlZaloCurrent , [Validators.required]],
    })
  }
  getValueOfData(key: string) {
    const settingList = _.cloneDeep(this.settingNotificationList);
    let value = settingList.find(x => x.settingKey == key);
    return value;
  }
  onSaveForm(type) {
    if (TYPE_EDIT.ZALO == type) {
      if (this.ZaloInfoForm.valid) {
        const zaloFormValue = this.ZaloInfoForm.value;
        const zalo = new ZaloInfo();
        zalo.oa_id = zaloFormValue.QAZALOID;
        zalo.app_id = zaloFormValue.idApp;
        zalo.secret_key = zaloFormValue.keyApp;
        zalo.url = zaloFormValue.url;
        zalo.callBackUrl = `${window.location.origin}/zalo/auth`;
        this.store.dispatch(onUpdateZalo(zalo));
        this.handleUpdateService(type);
        return;
      }

      validateAllFormFields(this.ZaloInfoForm);
      scrollToFirstInvalidControl(this.ZaloInfoForm);
    }
    else {
      if (this.NotificationForm.valid) {
        Object.entries(this.NotificationForm.value).forEach(([key, value]) => {
          if (key == 'notificationAppointmentSchedule') {
            this.onAddOrUpdateNotiZalo(SETTING_NAME.ZALO_TEMP_1, value);
          } else if (key == 'notificationPay') {
            this.onAddOrUpdateNotiZalo(SETTING_NAME.ZALO_TEMP_3, value);
          }
          else {
            this.onAddOrUpdateNotiZalo(SETTING_NAME.ZALO_TEMP_2, value);
          }
        });
        this.handleUpdateService(type);
        return;
      }

      validateAllFormFields(this.NotificationForm);
      scrollToFirstInvalidControl(this.NotificationForm);
    }

  }
  onOpenNewWindow(url){
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const windowWidth = 1200;
    const windowHeight = 700;
    const leftPosition = (screenWidth - windowWidth) / 2;
    const topPosition = (screenHeight - windowHeight) / 2;
    const windowFeatures = `width=${windowWidth},height=${windowHeight},left=${leftPosition},top=${topPosition},resizable=yes`;
    this.newWindown = window.open(url, '_blank', windowFeatures);
  }

  onAddOrUpdateNotiZalo(key: string, value: any) {
    let newSetting = new Setting();
    if (!this.getValueOfData(key)) {
      newSetting.settingType = SETTING_TYPE.ZALO_TEMPLATE;
      newSetting.settingKey = key;
      newSetting.settingValue = value;
      this.store.dispatch(onCreateSetting(newSetting));
    } else {
      newSetting = _.cloneDeep(this.getValueOfData(key));
      newSetting.settingValue = value;
      if (!_.isEqual(this.getValueOfData(key).settingValue, value)) {
        this.store.dispatch(onUpdateSetting(newSetting));
      }
    }
    this.cdr.markForCheck();
  }
  handleClickNewToken() {
    const zalo = this.zalos;
    if (!zalo?.urlPermission) {
      this.store.dispatch(showNotify({ notifyType: 'success', message: 'Vui lòng cập nhật lại cài đặt zalo' }));
      return;
    };
    const url = zalo?.urlPermission; // Replace this with the URL you want to open
    window.addEventListener('storage', this.myEventListener);
    this.onOpenNewWindow(url);
  }
  createNotificationAppointment(): FormGroup {
    return this._formBuilder.group({
      notificationAppointmentSchedule: [this.getValueOfData(SETTING_NAME.ZALO_TEMP_1) ? this.getValueOfData(SETTING_NAME.ZALO_TEMP_1).settingValue : null],
      notificationPay : [this.getValueOfData(SETTING_NAME.ZALO_TEMP_3) ? this.getValueOfData(SETTING_NAME.ZALO_TEMP_3).settingValue : null],
      paymentNotificationAppointment : [this.getValueOfData(SETTING_NAME.ZALO_TEMP_2) ? this.getValueOfData(SETTING_NAME.ZALO_TEMP_2).settingValue : null]
    })
  }
}

const ZALO_INFO = [
  {
    label: 'QA Zalo ID',
    formName: 'QAZALOID',
    required: true,
  },
  {
    label: 'ID Ứng Dụng',
    formName: 'idApp',
    required: true,

  },
  {
    label: 'Khóa bị mật của ứng dụng',
    formName: 'keyApp',
    required: true,
  },
  {
    label: 'Url xác thực zalo',
    formName: 'url',
    required: true,
  },
];
const NOTIFICATION_CONTENT = [
  {
    label: 'Gửi thông báo lịch hẹn',
    formName: 'notificationAppointmentSchedule',
    required: true,
  },
  {
    label: 'Gửi thông báo nhắc nhở thanh toán',
    formName: 'notificationPay',
    required: true,

  },
  {
    label: 'Gửi thông báo lịch hẹn kèm thông báo thanh toán',
    formName: 'paymentNotificationAppointment',
    required: true,
  }
];
const type_setting = {
  zaloStingEdit: false,
  notificationStingEdit: false
}
export enum TYPE_EDIT {
  ZALO = 'zalo',
  NOTIFICATION = 'notification',
}
