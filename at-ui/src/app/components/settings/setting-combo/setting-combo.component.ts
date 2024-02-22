import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { RootState } from 'src/app/store/entities/state.entity';
import { onLoadMedicalComboService } from '../../../store/actions/medicalComboService.action';

@Component({
  selector: 'app-setting-combo',
  templateUrl: './setting-combo.component.html',
  styleUrls: ['./setting-combo.component.scss'],
  providers: [DestroySubsribeService]
})
export class SettingComboComponent implements OnInit {
  columnDef: Array<ColDef> = COL_DEF;
  medicalComboService: Array<{ _id: string, name: string, medicalServiceIndicate: string }> = [];
  renderSelect: Array<any> = [];

  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.onLoadComboServiceList();
  }

  onLoadComboServiceList = (): void => {
    this.store.dispatch(onLoadMedicalComboService());
    this.store
      .select((state) => state.medicalComboService.medicalComboServices)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((medicalComboServices) => {
        medicalComboServices && (this.medicalComboService = medicalComboServices.map((item) =>
        ({
          _id: item._id,
          name: item.name,
          price: item.price,
          medicalServiceIndicate: this.onConverArrayToString(item.medicalServiceIndicatesName),
        }), 0));
      });
  }

  onConverArrayToString = (data) => {
    if (!data || data.length === 0) return null;
    let medicalIndicateVal: string = '';
    data.forEach((val, index) => {
      medicalIndicateVal = medicalIndicateVal + val + (index === data.length - 1 ? '' : ', ')
    });
    return medicalIndicateVal;
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên combo',
    prop: 'name',
    width: 100,
    router: true,
  },
  {
    name: 'Giá',
    prop: 'price',
    colType: 'money',
    width: 80,
  },
  {
    name: 'Danh sách chỉ định',
    prop: 'medicalServiceIndicate',
    width: 200,
  },
  
];