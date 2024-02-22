import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { formatPhoneNumber } from 'src/app/shared/functions/function-helper';
import { SETTING_PRINT } from '../../../../../../../at-common/model/enum';
import Setting from '../../../../../../../at-common/model/Setting';
import { RootState } from '../../../../store/entities/state.entity';
import { DestroySubsribeService } from '../../../service/destroySubscribe.service';

@Component({
  selector: 'at-header-content-print',
  templateUrl: './header-content-print.component.html',
  styleUrls: ['./header-content-print.component.scss']
})
export class HeaderContentPrintComponent implements OnInit {

  settingForm: FormGroup;
  settingList: Setting[] = [];

  formatPhoneNumber = formatPhoneNumber;

  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.onLoadSetting();
  }

  onLoadSetting(): void {
    this.store.select(state => state.setting.settings)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(setting => {
        if (!setting) return;
        this.settingList = _.cloneDeep(setting);
        this.settingForm = this.createSettingForm();
      })
  }

  createSettingForm(): FormGroup {
    return this._formBuilder.group({
      logo: [this.getValueOfData(SETTING_PRINT.LOGO) ? this.getValueOfData(SETTING_PRINT.LOGO).settingValue : null],
      name: [this.getValueOfData(SETTING_PRINT.NAME) ? this.getValueOfData(SETTING_PRINT.NAME).settingValue : []],
      address: [this.getValueOfData(SETTING_PRINT.ADDRESS) ? this.getValueOfData(SETTING_PRINT.ADDRESS).settingValue : []],
      website: [this.getValueOfData(SETTING_PRINT.WEBSITE) ? this.getValueOfData(SETTING_PRINT.WEBSITE).settingValue : null],
      tel: [this.getValueOfData(SETTING_PRINT.TEL) ? this.getValueOfData(SETTING_PRINT.TEL).settingValue : null],
      email: [this.getValueOfData(SETTING_PRINT.EMAIL) ? this.getValueOfData(SETTING_PRINT.EMAIL).settingValue : null],
    })
  }

  getValueOfData(controlName: string) {
    const settingList = _.cloneDeep(this.settingList);
    let value = settingList.find(x => x.settingKey == controlName);
    return value;
  }

}
