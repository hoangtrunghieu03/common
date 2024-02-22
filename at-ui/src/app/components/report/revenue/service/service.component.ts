import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { SERVICE_OPTION } from 'src/app/shared/data/examine';
import { SERVICE_REPORT_FILTER } from 'src/app/shared/data/report';
import { formatCurrencyNumber, formatCurentcy } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { ReportService } from 'src/app/shared/service/report.service';
import { RootState } from 'src/app/store/entities/state.entity';
import ReportRevenue from '../../../../../../../at-common/model/ReportRevenue';
import { ChartModel, FilterContent } from '../../report.model';
import * as _ from 'lodash';
import { onLoadServiceRevenue } from 'src/app/store/actions/report.action';
import { onLoadMedicalService } from 'src/app/store/actions/medicalService.action';
import MedicalService from '../../../../../../../at-common/model/MedicalService';
import { onLoadServiceIndicate } from 'src/app/store/actions/serviceIndicate.action';
import MedicalServiceIndicate from '../../../../../../../at-common/model/MedicalServiceIndicate';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  columnDef = COL_DEF;
  serviceAttr: ChartModel = new ChartModel();
  conditionData = SERVICE_REPORT_FILTER;
  filterResult: FilterContent = {condition: 'date', conditionSelect: this.conditionData.date, value: null, from: null, to: null}
  serviceReport: any[];
  renderSelect: Array<any> = [];
  serviceOption = SERVICE_OPTION;

  filters = new ReportRevenue();

  serviceRevenueReport: Array<any> = null;
  serviceList: Array<MedicalService> = [];
  serviceIndicateList: Array<MedicalServiceIndicate> = [];
  isLoading: boolean = false;

  constructor(
    private dataService: ReportService,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService

  ) { }

  ngOnInit(): void {
    // this.getData();
    this.onLoadServiceRevenue();
    this.onLoadMedicalService();
    this.onLoadMedicalServiceIndicate();
  }

  getData = ():void => {
    this.dataService.getServiceReport().subscribe(val => (val && this.onLoadChartConfig(val)))
  }

  onLoadMedicalService = ():void => {
    this.store.dispatch(onLoadMedicalService());
    this.store.select(state => state.medicalService.medicalServices)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(service => {
        if (!service) return;
        this.serviceList = service;
      })
  }

  onLoadMedicalServiceIndicate = ():void => {
    this.store.dispatch(onLoadServiceIndicate());
    this.store.select(state => state.serviceIndicate.serviceIndicates)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(serviceIndicate => {
        if (!serviceIndicate) return;
        this.serviceIndicateList = serviceIndicate;
      })
  }

  onLoadServiceRevenue = () => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadServiceRevenue(this.filters));
    this.store.select(state => state.report.serviceRevenues)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(serviceRevenue => {
      if (!serviceRevenue || !serviceRevenue['services']) return this.serviceRevenueReport = null;
      this.handleData(serviceRevenue['services']);
      this.onLoadChartConfig(serviceRevenue['services']);
    })
  }

  onLoadChartConfig = (data):void => {
    this.serviceRevenueReport = data;
    this.serviceAttr.data = [];
    this.serviceAttr.label = [];
    data.filter(val => {
      this.serviceAttr.data.push(val.value);
      this.serviceAttr.label.push(val.name);
    });
    this.handleData(data);
    this.serviceAttr.option = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display : false
      },
      scales: {
        xAxes: [{
          display: false,
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let value: any = data.labels[tooltipItem.index] + ' - ' + data.datasets[0].data[tooltipItem.index].
              toLocaleString().split(',').join('.') + ' ₫';
            return value;
          },
        },
      },

    };
    this.serviceAttr.color = [{
      backgroundColor:['#398DD7', '#ffbc58', '#13c9ca', '#ff8084', '#FFE88E', '#B3FDB8', '#D9E1EC','#FF0000','#2EFE64','#FF00FF']
    }];
  }

  changeFilter = (): void => {
    Object.entries(SERVICE_REPORT_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.from = null;
    this.filterResult.to = null;
  }

  onAddCondiotion = (): void => {
    let newFilter;
    if ((this.filterResult.condition && this.filterResult.value) ||
      (this.filterResult.condition && this.filterResult.from && this.filterResult.to)) {
      if (this.filterResult.condition == 'service' || this.filterResult.condition == 'serviceIndicate') {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: this.filterResult.value,
          from: this.filterResult.from,
          to: this.filterResult.to
        }
      } else {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: null,
          from: this.filterResult.from,
          to: this.filterResult.to
        }
      }
      let isIncludes = this.renderSelect.findIndex(item => this.filterResult.conditionSelect === SERVICE_REPORT_FILTER.date ?
        item.key === newFilter.key :
        (item.firstCondition === SERVICE_REPORT_FILTER.service ||
        item.firstCondition === SERVICE_REPORT_FILTER.serviceIndicate));
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }

      let filter = { ...this.filters.filter }
      if (this.filterResult.condition == 'service' || this.filterResult.condition == 'serviceIndicate') {
        filter.serviceId = this.filterResult.value;
      } else {
        filter.fromDate = String(this.filterResult.from);
        filter.toDate = String(this.filterResult.to);
      }
      this.filters.filter = filter;
      this.onLoadServiceRevenue();
    }
  }

  // onRemoveFilter = (param): void => {
  //   this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
  // }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter };
    if (param.firstCondition == SERVICE_REPORT_FILTER.service ||
      param.firstCondition == SERVICE_REPORT_FILTER.serviceIndicate) {
        filter.serviceId = null;
      } else  {
        filter.fromDate = null;
        filter.toDate = null;
      } 
      this.filters.filter = filter;
      this.onLoadServiceRevenue();
  }

  handleData = (data):void => {
    this.serviceRevenueReport = _.cloneDeep(data);
    this.serviceRevenueReport.filter(val => {
      val.value = formatCurentcy(val.value);
    })
  }

  getServiceNameById = (id): string => {
    let serviceName: string = this.serviceList.find(x => x._id ==id)?.name;
    return serviceName;
  }

  getServiceIndicateNameById = (id): string => {
    let serviceIndicateName: string = this.serviceIndicateList.find(x => x._id ==id)?.name;
    return serviceIndicateName;
  }
  
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Dịch vụ',
    prop: 'name',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: null,
    summaryFunc: () => { return '<b>Tổng</b>' }
  },
  {
    name: 'Số lượng',
    prop: 'count',
    width: 100,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: null,
  },
  {
    name: 'Doanh thu',
    prop: 'value',
    width: 100,
    colType: 'money',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
    summaryFunc: (cell) => {
      const sum = cell.reduce( (sum,cell) => (sum += formatCurrencyNumber(cell)), 0)
      return `<b>${formatCurentcy(sum)}</b>`
    }
  }
];