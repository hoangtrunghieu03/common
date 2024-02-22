import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { PreviewImgModalComponent } from 'src/app/shared/modal/preview-img-modal/preview-img-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { RootState } from 'src/app/store/entities/state.entity';
import Setting from '../../../../../../at-common/model/Setting';
import { onCreateSetting, onLoadSettings, onUpdateSetting } from '../../../store/actions/setting.action';
import { formatPhoneNumber, scrollToFirstInvalidControl, validateAllFormFields } from 'src/app/shared/functions/function-helper';
import { SETTING_PRINT } from '../../../../../../at-common/model/enum';

@Component({
  selector: 'app-setting-print',
  templateUrl: './setting-print.component.html',
  styleUrls: ['./setting-print.component.scss']
})
export class SettingPrintComponent implements OnInit {

  settingForm: FormGroup;

  telForm = new FormArray([]);

  settingList: Setting[] = [];

  isEdit: boolean = false;

  settingContent: Array<{label: string, formName: string, type: string}> = [];

  constructor(
    public location: Location,
    private modal: NgbModal,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.settingForm = this.createSettingForm();
    this.onLoadSetting();
    this.settingContent = [
      {
        label: SETTING_PRINT.NAME,
        formName: 'name',
        type: 'single'
      },
      {
        label: SETTING_PRINT.ADDRESS,
        formName: 'address',
        type: 'multi'
      },
      {
        label: SETTING_PRINT.TEL,
        formName: 'tel',
        type: 'multi'
      },
      {
        label: SETTING_PRINT.WEBSITE,
        formName: 'website',
        type: 'single'
      },
      {
        label: SETTING_PRINT.EMAIL,
        formName: 'email',
        type: 'single'
      },
      {
        label: SETTING_PRINT.FOOTERINFO,
        formName: 'footerInfor',
        type: 'single'
      },
    ];
  }

  onLoadSetting(): void {
    this.store.dispatch(onLoadSettings());
    this.store.select(state => state.setting.settings)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(setting => {
        if (!setting) return;
        this.settingList = _.cloneDeep(setting);
        this.settingForm = this.createSettingForm();
        this.onSetPhone();
      })
  }

  onSetPhone = () => {
    let phoneArray = this.getValueOfData(SETTING_PRINT.TEL);
    if (phoneArray) {
      this.telForm = new FormArray([]);
      phoneArray.settingValue.forEach(tel => {
        this.telForm.push(new FormControl(formatPhoneNumber(tel)));
      });
    } else {
      this.telForm.push(new FormControl(null));
    }
  }
  requiredArrayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const addressArray = control.value as any[]; // Ép kiểu giá trị của trường "address" thành mảng (array)

      // Kiểm tra xem mảng "address" có ít nhất một giá trị không phải null hoặc chuỗi rỗng hay không
      const isValid = addressArray.some(item => item !== null && item !== '');

      // Trả về lỗi nếu mảng không hợp lệ
      return isValid ? null : { required: true };
    };
  }
  createSettingForm(): FormGroup {
    return this._formBuilder.group({
      logo: [this.getValueOfData(SETTING_PRINT.LOGO) ? this.getValueOfData(SETTING_PRINT.LOGO).settingValue : [null]],
      name: [this.getValueOfData(SETTING_PRINT.NAME) ? this.getValueOfData(SETTING_PRINT.NAME).settingValue : null],
      address: [this.getValueOfData(SETTING_PRINT.ADDRESS) ? this.getValueOfData(SETTING_PRINT.ADDRESS).settingValue : [null] , [this.requiredArrayValidator()]],
      website: [this.getValueOfData(SETTING_PRINT.WEBSITE) ? this.getValueOfData(SETTING_PRINT.WEBSITE).settingValue : null],
      email: [this.getValueOfData(SETTING_PRINT.EMAIL) ? this.getValueOfData(SETTING_PRINT.EMAIL).settingValue : null],
      footerInfor: [this.getValueOfData(SETTING_PRINT.FOOTERINFO) ? this.getValueOfData(SETTING_PRINT.FOOTERINFO).settingValue : null]
    })
  }

  getValueOfData(key: string) {
    const settingList = _.cloneDeep(this.settingList);
    let value = settingList.find(x => x.settingKey == key);
    //reset url img
    if (key == SETTING_PRINT.LOGO) {
      const timestamp = Date.now();
      if (value) {
        value.settingValue[0] += `?v=${timestamp}`
      }
    }
    return value;
  }

  handleAddImg = (event):void => {
    if (!(event.target.files && event.target.files[0])) return;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    reader.readAsDataURL(file);

    // When file uploads set it to file formcontrol
    reader.onload = () => {
      let result = String(reader.result)
      this.settingForm.get('logo').setValue([result]);
    }

    // ChangeDetectorRef since file is loading outside the zone
    this.cdr.markForCheck();
  }

  deleteImage(event) {
    if (!event) return;
    this.settingForm.get('logo').setValue([null]);
  }

  viewDetail = ( img:string ):void => {
    const modal = this.modal.open(PreviewImgModalComponent, {
      centered: true,
      windowClass: 'product-preview-img'
    });
    modal.componentInstance.img = img;
    modal.componentInstance.pictureAction = this.isEdit ? { delete: true } : null;
    modal.result.then(result => {
      if (!result) return;
      if (result == 'delete') this.onDeleteImg(img);
    }).catch(error => {
    })
  }

  onDeleteImg = (img):void => {
    this.settingForm.get('logo').setValue([null]);
  }

  onChangeValue = (event, controlName: string, index: number) => {
    let val = this.settingForm.get(controlName).value;
    val[index] = event.target.value;
    this.settingForm.get(controlName).setValue(val);
  }

  onAddColumn = (controlName: string) => {
    if (controlName == 'tel') {
      if (!this.telForm.controls[this.telForm.controls.length - 1]?.value?.trim()) return;
      return this.telForm.push(new FormControl(null));
    }
    let val = this.settingForm.get(controlName).value;
    if (!val[val.length - 1]?.trim()) return;
    val.push(null)
    this.settingForm.get(controlName).setValue(val);
  }

  onRemoveColumn = (controlName: string, index: number) => {
    if (controlName == 'tel') return this.telForm.removeAt(index);
    let val = this.settingForm.get(controlName).value;
    val.splice(index, 1);
    this.settingForm.get(controlName).setValue(val);
  }

  handleUpdateService = (): void => {
    this.isEdit = !this.isEdit;
    !this.isEdit && (this.settingForm = this.createSettingForm());
  }

  onSaveForm = (): void => {
    let address = _.cloneDeep(this.settingForm.value.address);
    this.settingForm.value.address = this.checkAddress(address) ? null : address;
    if (this.settingForm.valid) {
      this.handleSaveForm();
      return;
    }
    validateAllFormFields(this.settingForm);
    scrollToFirstInvalidControl(this.settingForm);
  }
  checkAddress(address) {
    if (address == null) return true;
    return address.every((item) => {
      return item == "";
    });
  }
  handleSaveForm() {
    for (const property in SETTING_PRINT) {
      if (property != 'TEL' && property != 'LOGO') {
        this.onAddOrUpdateValue(SETTING_PRINT[property], this.settingForm.value[this.settingContent.find(x => x.label == SETTING_PRINT[property])?.formName]);
      }
    }
    this.onAddOrUpdateValue(SETTING_PRINT.LOGO, this.settingForm.value.logo)
    let phoneValue = [];
    this.telForm.controls.forEach((tel, index) => {
      ((this.telForm.controls.length > 1 && index == this.telForm.controls.length - 1) ? !!tel.value?.trim() : true) && phoneValue.push(tel.value?.replaceAll(' ', ''));
    });
    this.onAddOrUpdateValue(SETTING_PRINT.TEL, phoneValue);

    let timeout = setTimeout(() => {
      this.isEdit = false;
      clearTimeout(timeout);
    }, 500);
  }
  onAddOrUpdateValue(key: string, value: any) {
    let newSetting = new Setting();
    if (!this.getValueOfData(key)) {
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

}
