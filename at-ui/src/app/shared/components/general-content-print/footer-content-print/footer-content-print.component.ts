import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { SETTING_PRINT } from '../../../../../../../at-common/model/enum';
import Setting from '../../../../../../../at-common/model/Setting';
import { RootState } from '../../../../store/entities/state.entity';
import { DestroySubsribeService } from '../../../service/destroySubscribe.service';

@Component({
  selector: 'at-footer-content-print',
  templateUrl: './footer-content-print.component.html',
  styleUrls: ['./footer-content-print.component.scss']
})
export class FooterContentPrintComponent implements OnInit {

  footerForm: FormControl;
  settingList: Setting[] = [];

  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
  ) {
    this.footerForm = new FormControl();
  }

  ngOnInit(): void {
    this.onLoadSetting();
  }

  onLoadSetting(): void {
    this.store.select(state => state.setting.settings)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(setting => {
        if (!setting) return;
        this.settingList = _.cloneDeep(setting);
        this.footerForm.setValue(this.getValueOfData(SETTING_PRINT.FOOTERINFO) ? this.getValueOfData(SETTING_PRINT.FOOTERINFO).settingValue : null);
      })
  }

  getValueOfData(controlName: string) {
    const settingList = _.cloneDeep(this.settingList);
    let value = settingList.find(x => x.settingKey == controlName);
    return value;
  }

}
