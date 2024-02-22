import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { ChairComponent } from 'src/app/shared/components/examine-view/chair/chair.component';
import { onLoadChairStatus, onLoadCustomers, onLoadMedicalServices, onLoadRevenueDays } from 'src/app/store/actions/dashboard.action';
import DashBoardChartData from '../../../../../at-common/model/DashBoardChartData';
import DashBoardCustomer from '../../../../../at-common/model/DashBoardCustomer';
import DashBoardMedicalService from '../../../../../at-common/model/DashBoardMedicalService';
import DashBoardRevenueDay from '../../../../../at-common/model/DashBoardRevenueDay';
import ColDef from '../../shared/components/at-table/at-table.component';
import { formatCurentcy } from '../../shared/functions/function-helper';
import { DestroySubsribeService } from '../../shared/service/destroySubscribe.service';
import { RootState } from '../../store/entities/state.entity';

@Component({
  selector: 'at-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DestroySubsribeService]
})
export class DashboardComponent implements OnInit {

  revenueDays: DashBoardRevenueDay = null;
  revenueDayAttr: {
    data: Array<any>,
    option: any,
    label: Array<string>
  } = { data: [], option: {}, label: [] };

  customer: DashBoardCustomer = null;

  medicalServices: Array<DashBoardMedicalService> = [];

  chairStatus: Array<DashBoardChartData> = null;

  colDef: Array<ColumnDef> = ColDef;

  repoContent: Array<any> = [];


  constructor(
    private modal: NgbModal,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService
    ) {
    this.repoContent = [
      {
        name: 'Doanh thu ngày',
        val: formatCurentcy(0),
        color: '#fff',
        icon: 'printer'
      },
      {
        name: 'Tổng bệnh nhân ngày',
        val: 0,
        color: '#fff',
        icon: 'user'
      }
    ];
  }

  ngOnInit(): void {
    this.onLoadRevenueDays();
    this.onLoadCustomers();
    this.onLoadMedicalService();
    this.onLoadChairStatus();
  }

  onLoadRevenueDays = () => {
    this.store.dispatch(onLoadRevenueDays());
    this.store.select(state => state.dashboard.revenueDays)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(revenueDay => {
        if (!revenueDay || !revenueDay['revenueDays']) {
          this.revenueDayAttr = { data: [], option: {}, label: [] };
          return this.repoContent[0].val = formatCurentcy(0);
        }
        this.revenueDays = revenueDay['revenueDays'];
        this.revenueDayAttr.label = this.revenueDays.revenueday?.map((object) => object.name + 'H');
        let revenue = this.revenueDays.revenueday?.map((object) => object.value);
        this.loadChartRevenu(revenue, this.revenueDays?.totalMoney);
      })
  }

  onLoadCustomers = () => {
    this.store.dispatch(onLoadCustomers());
    this.store.select(state => state.dashboard.customers)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(customers => {
        if (!customers || !customers['customers']) return this.customer = null;

        this.customer = customers['customers'];
        this.repoContent[1].val = this.customer?.total;
      })
  }

  onLoadMedicalService = () => {
    this.store.dispatch(onLoadMedicalServices());
    this.store.select(state => state.dashboard.medicalService)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(medicalService => {
        if (!medicalService || !medicalService['medicalServices']) return this.medicalServices = [];
        this.medicalServices = medicalService['medicalServices'];
      })
  }

  onLoadChairStatus = () => {
    this.store.dispatch(onLoadChairStatus());
    this.store.select(state => state.dashboard.chairStatus)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(chairStatus => {
        if (!chairStatus || !chairStatus['chairs']) return this.chairStatus = [];
        this.chairStatus = chairStatus['chairs'];
      })
  }

  loadChartRevenu(revenue, totalMoney): void {
    this.repoContent[0].val = formatCurentcy(totalMoney);
    this.revenueDayAttr.data = [
      {
        data: revenue,
        label: null,
        fill: false,
        lineTension: 0.1,
        borderColor: "#00a8ff", // The main line color
        borderDashOffset: 0.0,
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        pointBackgroundColor: "#f99f2a"
      }
    ]
    this.revenueDayAttr.option = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          position: 'left',
          ticks: {
            beginAtZero: true,
            callback: function (value) {
              return [formatCurentcy(value)];
            }
          },
        }]
      },
      tooltips: {
        fontStyle: 'bold',
        bodyFontSize: 14,
        titleFontSize: 14,
        titleSpacing: 5,
        enabled: true,
        padding: 12,
        titleAlign: 'center',
        xPadding: 15,
        yPadding: 15,
        callbacks: {
          label: function (tooltipItem) {
            return formatCurentcy(tooltipItem.yLabel);
          }
        },
      }
    };
  }

  onMedicalRecordChair = (): void => {
    const modal: NgbModalRef = this.modal.open(ChairComponent, {
      centered: true,
      size: 'xl'
    })
    modal.componentInstance._view = true;
    modal.result.then(result => {
      if (!result) { return }
    }).catch(error => {
    })
  }

}

const ColDef: Array<ColumnDef> = [
  { label: 'Tên dịch vụ', title: 'name', colType: '', style: '', headerStyle: '', canUpdate: false, fieldUpdate: null, updateType: null },
  { label: 'Số lượng', title: 'quantity', colType: '', style: '', headerStyle: '', canUpdate: false, fieldUpdate: null, updateType: null },
  { label: 'Doanh thu', title: 'revenue', colType: 'money', style: '', headerStyle: '', canUpdate: false, fieldUpdate: null, updateType: null },
]
