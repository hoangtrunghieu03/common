import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { SERVICE_COMBO_FILTER } from 'src/app/shared/data/setting';
import { formatCurentcy, formatCurrencyNumber, formatTextLating } from 'src/app/shared/functions/function-helper';
import { onLoadServiceIndicate } from 'src/app/store/actions/serviceIndicate.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalServiceIndicate from '../../../../../../at-common/model/MedicalServiceIndicate';
import { AllocateAddDialogComponent } from './allocate-add-dialog/allocate-add-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import MedicalServiceIndicateReport from '../../../../../../at-common/model/MedicalServiceIndicateReport';

@Component({
  selector: 'app-setting-allocate',
  templateUrl: './setting-allocate.component.html',
  styleUrls: ['./setting-allocate.component.scss'],
  providers: [DestroySubsribeService]
})
export class SettingAllocateComponent implements OnInit {
  renderSelect: Array<any> = [];
  columnDef: Array<ColDef> = COL_DEF;
  conditionData = SERVICE_COMBO_FILTER;
  serviceIndicatesList = [];
  indicatesFilter = [];
  filterResult: {
    condition: string;
    conditionSelect: string;
    value: string;
    from: string;
    to: string;
  } = {
    condition: 'price',
    conditionSelect: this.conditionData.price,
    value: null,
    from: null,
    to: null,
  };
  textSearch: string = null;
  formatCurentcy = formatCurentcy;
  formatCurrencyNumber = formatCurrencyNumber;

  constructor(
    private _modal: NgbModal,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService
  ) {}

  ngOnInit(): void {
    this.onLoadServiceIndicateList();
  }

  onLoadServiceIndicateList = (): void => {
    this.store.dispatch(onLoadServiceIndicate());
    this.store
      .select((state) => state.serviceIndicate.serviceIndicates)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(serviceIndicatesList => {
        if (!serviceIndicatesList) return this.serviceIndicatesList = [];
        this.serviceIndicatesList = serviceIndicatesList;
        this.indicatesFilter = serviceIndicatesList;
        this.onFilter();
      })
  }

  onSearch(event): void {
    this.textSearch = event;
    this.onFilter();
  }

  onFilter = (): void => {
    this.serviceIndicatesList = this.indicatesFilter.filter(
      (tag) =>
        (this.filterResult.from && this.filterResult.to
          ? formatCurrencyNumber(this.filterResult.from) <=
              formatCurrencyNumber(tag.price) &&
            formatCurrencyNumber(this.filterResult.to) >=
              formatCurrencyNumber(tag.price)
          : true) &&
        (this.textSearch
          ? formatTextLating(tag.name).indexOf(formatTextLating(this.textSearch)) > -1
          : true)
    );
  };

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter((x) => x.key != param.key);
    this.filterResult.from = null;
    this.filterResult.to = null;
    this.onFilter();
  };

  onFilterConditionChange = (): void => {
    Object.entries(SERVICE_COMBO_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
  };

  onAddCondiotion = (): void => {
    let filter: any;
    if (
      (this.filterResult.condition && this.filterResult.value) ||
      (this.filterResult.condition &&
        this.filterResult.from &&
        this.filterResult.to)
    ) {
      if (this.filterResult.condition == 'price') {
        filter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: null,
          from: this.filterResult.from,
          to: this.filterResult.to,
        };
      } else {
        filter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: this.filterResult.value,
          from: null,
          to: null,
        };
      }

      let isIncludes = this.renderSelect.findIndex(
        (item) => item.key === filter.key
      );
      if (isIncludes === -1) {
        this.renderSelect.push(filter);
      } else {
        this.renderSelect.splice(isIncludes, 1, filter);
      }

      this.onFilter();
    }
  };

  handleEventAllocate = (): void => {
    const modalRef = this._modal.open(AllocateAddDialogComponent, {
      //scrollable: true,
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'service-backdrop',
      windowClass: 'service-window',
      centered: true
    }).result.then(result => {
      if (!result) { return }
    }).catch(error => { return error })
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên chỉ định',
    prop: 'name',
    width: 200,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: true,
    path: 'i',
  },
  {
    name: 'Giá chỉ định',
    prop: 'price',
    width: 150,
    colType: 'money',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
];

