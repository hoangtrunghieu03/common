import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { formatCurrencyNumber, FormatDateComponent, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { onCreateMedicalSupply, onLoadMedicalSupply , onLoadMedicalSupplyUnit } from 'src/app/store/actions/medicalSupply.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import MedicalSupply from '../../../../../../../at-common/model/MedicalSupply';
import MedicalSupplyHistory from '../../../../../../../at-common/model/MedicalSupplyHistory';
import MedicalSupplyHistoryReportDatas from '../../../../../../../at-common/model/MedicalSupplyHistoryReportDatas';
import MedicalSupplyHistoryReport from '../../../../../../../at-common/model/MedicalSupplyHistoryReport';
import { ADJUST_WAREHORSE_REASON } from '../../../../../../../at-common/model/enum';
import { onLoadMedicalSupplyHistory } from 'src/app/store/actions/medicalEquipment.action';
import ColDef from 'src/app/shared/components/at-table/at-table.component';


@Component({
  selector: 'app-inventory-add-dialog',
  templateUrl: './medical-supply-adjus-history.component.html',
  styleUrls: ['./medical-supply-adjus-history.component.scss'],
  providers: [FormatDateComponent]
})
export class MedicalAdjusHistory implements OnInit {
  @Input() roomId: string;

  colDef: Array<ColDef> = COL_DEF;
  AdjusHistoryList: MedicalSupplyHistoryReportDatas[] = [];
  filters = new MedicalSupplyHistoryReport();
  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.onLoadMedicalSupplyHistory();
  }
  onLoadMedicalSupplyHistory() {
    let filter = { ...this.filters.filter }
    filter.reason = ADJUST_WAREHORSE_REASON.ADJUST;
    filter.roomId = this.roomId;
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalSupplyHistory(this.filters));
    this.store.select(state => state.medicalEquipment.medicalSupplyHistory)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSupplyHistory => {
        if (!medicalSupplyHistory || !medicalSupplyHistory['datas']) return;
        this.AdjusHistoryList = medicalSupplyHistory['datas'];
      })
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Ngày',
    prop: 'date',
    width: 200,
    colType: 'date',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Tên vật tư',
    prop: 'name',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Số lượng điều chỉnh',
    prop: 'qty',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Đơn vị',
    prop: 'unit',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Người điều chỉnh',
    prop: 'staff',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
];
