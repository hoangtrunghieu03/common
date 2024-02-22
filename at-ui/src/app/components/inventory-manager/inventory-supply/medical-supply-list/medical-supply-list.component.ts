import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import MedicalSupply from '../../../../../../../at-common/model/MedicalSupply';
import MedicalSupplyReport from '../../../../../../../at-common/model/MedicalSupplyReport';
import { adjustMedicalSupplyByRoom, onLoadMedicalSupplyFilter, onLoadMedicalSupplyFilterSuccess, onReturnMedicalSupply } from '../../../../store/actions/medicalSupply.action';
import { RootState } from '../../../../store/entities/state.entity';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import ColDef from '../../../../shared/components/at-table/at-table.component';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { InventorySupplyExportComponent } from '../inventory-supply-export/inventory-supply-export.component';
import { onCreateMedicalSupplyRequest } from 'src/app/store/actions/medicalSupplyRequest.action';
import { Location } from '@angular/common';
import { InventorySupplyGiveBackComponent } from '../inventory-supply-give-back/inventory-supply-give-back.component';
import { InventorySupplyAdjustmentComponent } from '../inventory-supply-adjustment/inventory-supply-adjustment.component';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import MedicalSupplyHistory from '../../../../../../../at-common/model/MedicalSupplyHistory';
import { MedicalAdjusHistory } from '../medical-supply-adjus-history/medical-supply-adjus-history.component';

@Component({
  selector: 'app-medical-supply-list',
  templateUrl: './medical-supply-list.component.html',
  styleUrls: ['./medical-supply-list.component.scss']
})
export class MedicalSupplyListComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF;
  medicalSupplyList: Array<MedicalSupply> = [];
  filters = new MedicalSupplyReport();
  selectModal :boolean = false;
  roomId: string = null;

  constructor(
    private _modal: NgbModal,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private route: ActivatedRoute,
    public location: Location,
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      if (param && param._id) {
        this.roomId = param._id;
        this.onLoadMedicalSupplyReport();
      }
    })
  }
  handleEventAdjusHistory() {
    this.selectModal = true;
    const modalRef = this._modal.open(MedicalAdjusHistory, {
      size: 'xl', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-backdrop',
      windowClass: 'inventory-window',
      centered: true
    })
    modalRef.componentInstance.roomId = this.roomId;
    modalRef.result.then(result => {
      this.selectModal = false;
      if (!result) { return }
    }).catch(error => { return error })
  }
  onLoadMedicalSupplyReport = () => {
    let filter = { ...this.filters.filter }
    filter.roomId = this.roomId;
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalSupplyFilter(this.filters));

    this.store.select(state => state.medicalSupply.medicalSupplyFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSupplyList => {
        if(this.selectModal) return
        if (!medicalSupplyList) return this.medicalSupplyList = [];
        this.medicalSupplyList = _.cloneDeep(medicalSupplyList.slice().sort((a, b) => a.name?.trim()?.localeCompare(b?.name?.trim())));
      })
  }
  onSearch(event: any) {
    this.selectModal = false;
    let filter = { ...this.filters.filter }
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadMedicalSupplyReport();
  }
  handleEventAdjust() {
    this.selectModal = true;
    const modalRef = this._modal.open(InventorySupplyAdjustmentComponent, {
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-backdrop',
      windowClass: 'inventory-window',
      centered: true
    })
    modalRef.componentInstance.roomId = this.roomId;
    modalRef.componentInstance.columnDef = COL_DEF_ADJUS;
    modalRef.result.then(result => {
      this.selectModal = false;
      if (!result) { return }
      let dataAdjus = _.cloneDeep(new MedicalSupplyHistory());
      dataAdjus._id = result.listSupply[0].medicalSupplyId,
      dataAdjus.roomId = result.roomId,
      dataAdjus.quantity = result.listSupply[0].qtySupply,
      dataAdjus.reasonAdjust = result.reason,
      dataAdjus.noteAdjust = result.note
      this.store.dispatch(adjustMedicalSupplyByRoom(dataAdjus));
    }).catch(error => { return error })
  }
  handleEventGiveBack() {
    this.selectModal = true;
    const modalRef = this._modal.open(InventorySupplyGiveBackComponent, {
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-backdrop',
      windowClass: 'inventory-window',
      centered: true
    })
    modalRef.componentInstance.title = 'Trả vật dụng';
    modalRef.componentInstance.roomId = this.roomId;
    modalRef.result.then(result => {
      this.selectModal = false;
      if (!result) { return }
      this.store.dispatch(onReturnMedicalSupply(result));
    }).catch(error => { return error })
  }
  handleEventExport = () => {
    const modalRef = this._modal.open(InventorySupplyExportComponent, {
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-backdrop',
      windowClass: 'inventory-window',
      centered: true
    })
    modalRef.componentInstance.title = 'Đề xuất vật dụng';
    modalRef.componentInstance.roomId = this.roomId;
    modalRef.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onCreateMedicalSupplyRequest(result));
    }).catch(error => { return error })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.store.dispatch(onLoadMedicalSupplyFilterSuccess(null));
  }
}
const COL_DEF_ADJUS: Array<ColumnDef> = [
  {
    label: 'Tên vật dụng',
    title: 'name',
    colType: '',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Số lượng ở phòng',
    title: 'quantity',
    colType: 'text-align: center',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Số lượng điều chỉnh',
    title: 'qtySupply',
    colType: 'text-align: center',
    style: 'width: 150px',
    headerStyle: 'text-align: center',
    canUpdate: true,
    fieldUpdate: 'qtySupply',
    updateType: 'quantity',
    fieldCompare: 'quantity',
  },

];

const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên vật dụng',
    prop: 'name',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Đơn vị cung cấp',
    prop: 'origin',
    width: 200,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'HSD',
    prop: 'expDate',
    width: 150,
    colType: 'date',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Số lượng',
    prop: 'quantity',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
  {
    name: 'Đơn vị',
    prop: 'unit',
    width: 150,
    colType: '',
    styleHeader: 'text-align: left',
    styleBody: 'text-align: left',
  },
];
