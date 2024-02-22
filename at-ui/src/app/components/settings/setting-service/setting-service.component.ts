import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { SERVICE_SETTING_FILTER } from 'src/app/shared/data/setting';
import { onCreateMedicalService, onLoadMedicalServiceFilter, onLoadMedicalServiceTag } from 'src/app/store/actions/medicalService.action';
import MedicalService from '../../../../../../at-common/model/MedicalService';
import MedicalServiceReport from '../../../../../../at-common/model/MedicalServiceReport';
import { formatCurentcy, formatCurrencyNumber } from '../../../shared/functions/function-helper';
import { DestroySubsribeService } from '../../../shared/service/destroySubscribe.service';
import { RootState } from '../../../store/entities/state.entity';
import { ServiceAddDialogComponent } from './service-add-dialog/service-add-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-setting-service',
  templateUrl: './setting-service.component.html',
  styleUrls: ['./setting-service.component.scss'],
  providers: [DestroySubsribeService]
})
export class SettingServiceComponent implements OnInit {

  conditionData = SERVICE_SETTING_FILTER;
  filterResult: { condition: string, conditionSelect: string, from: string, to: string, value: string } = { condition: 'price', conditionSelect: this.conditionData.price, from: null, to: null, value: null };
  renderSelect: Array<any> = [];
  filters = new MedicalServiceReport();

  medicalServiceList: MedicalService[] = [];
  medicalServiceTag: Array<{ _id: string, tagService: string }> = [];
  columnDef: Array<ColDef> = COL_DEF;
  
  formatCurrencyNumber = formatCurrencyNumber;
  formatCurentcy = formatCurentcy;

  constructor(
    private _modal: NgbModal,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService
  ) {
  }

  ngOnInit(): void {
    this.onLoadMedicalService();
    this.onLoadMedicalServiceTag();
  }

  onLoadMedicalService = () => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalServiceFilter(this.filters));
    this.store.select(state => state.medicalService.medicalServiceFilter)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalServiceFilter => {
        if (!medicalServiceFilter) return this.medicalServiceList = [];;
        this.medicalServiceList = medicalServiceFilter;
      })
  }

  onLoadMedicalServiceTag = () => {
    this.store.dispatch(onLoadMedicalServiceTag());
    this.store.select(state => state.medicalService.medicalServiceTag)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalServiceTag => {
        if (!medicalServiceTag) return this.medicalServiceList = [];;
        this.medicalServiceTag = medicalServiceTag;
      })
  }

  onSearch(event): void {
    let filter = { ...this.filters.filter }
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadMedicalService();
  }

  onAddCondiotion = (): void => {
    let newFilter: any;
    if (this.filterResult.condition &&
      ((this.filterResult.from &&
        this.filterResult.to) || this.filterResult.value)) {
      if (this.filterResult.condition == 'tagService') {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: this.filterResult.value,
          from: null,
          to: null
        }
      } else {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: null,
          from: this.filterResult.from,
          to: this.filterResult.to,
        };
      }

      let isIncludes = this.renderSelect.findIndex((item) => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }
      let filter = { ...this.filters.filter }
      if (this.filterResult.conditionSelect == SERVICE_SETTING_FILTER.tagService) {
        filter.tagService = this.filterResult.value;
      } else {
        filter.priceFrom = formatCurrencyNumber(this.filterResult.from);
        filter.priceTo = formatCurrencyNumber(this.filterResult.to);
      }
      this.filters.filter = filter;
      this.onLoadMedicalService();
    }
  };

  onFilterConditionChange = (): void => {
    Object.entries(SERVICE_SETTING_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.from = null;
    this.filterResult.to = null;
  };

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter((x) => x.key != param.key);
    let filter = { ...this.filters.filter };
    if (param.firstCondition == SERVICE_SETTING_FILTER.tagService) {
      filter.tagService = null;
    } else {
      filter.priceFrom = null;
      filter.priceTo = null;
    }
    this.filters.filter = filter;
    this.onLoadMedicalService();
  };

  handleEventService = (): void => {
    const modalRef = this._modal.open(ServiceAddDialogComponent, {
      // scrollable: true,
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'service-backdrop',
      windowClass: 'service-window',
      centered: true
    }).result.then(result => {
      if (!result) { return }
      this.store.dispatch(onCreateMedicalService({ medicalService: result, medicalServiceFilter: _.cloneDeep(this.filters) }));
    }).catch(error => { return error })
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên dịch vụ',
    prop: 'name',
    width: 200,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: true,
    path: 'i',
  },
  {
    name: 'Giá dịch vụ',
    prop: 'price',
    width: 150,
    colType: 'money',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
];