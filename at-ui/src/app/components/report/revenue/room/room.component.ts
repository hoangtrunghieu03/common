import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { ROOM_REPORT_FILTER } from 'src/app/shared/data/report';
import { formatCurentcy, formatCurrencyNumber } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadReportRoom } from 'src/app/store/actions/report.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import ReportRevenue from '../../../../../../../at-common/model/ReportRevenue';
import Room from '../../../../../../../at-common/model/Room';
import { ChartModel, FilterContent } from '../../report.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  columnDef = COL_DEF;
  serviceAttr: ChartModel = new ChartModel();
  conditionData = ROOM_REPORT_FILTER;
  filterResult: FilterContent = { condition: 'date', conditionSelect: this.conditionData.date, value: null, from: null, to: null }
  renderSelect: Array<any> = [];

  filters = new ReportRevenue();
  roomReport: Array<any> = null;

  rooms: Room[] = [];

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService

  ) { }

  ngOnInit(): void {
    this.onLoadReportRoom();
    this.onLoadRooms();
  }

  onLoadRooms = (): void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(room => {
        if (!room) return;
        this.rooms = room;
      })
  }

  onLoadReportRoom = () => {
    let filter = { ...this.filters.filter }
    this.filters.filter = filter;
    this.store.dispatch(onLoadReportRoom(this.filters));
    this.store.select(state => state.report.rooms)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((serviceRevenue: ReportRevenue) => {
        if (!serviceRevenue || !serviceRevenue.rooms) return this.roomReport = null;
        this.handleData(serviceRevenue.rooms);
        this.onLoadChartConfig(serviceRevenue.rooms);
      })
  }

  onLoadChartConfig = (data): void => {
    this.roomReport = data;
    this.serviceAttr.data = [];
    this.serviceAttr.label = [];
    data.filter(val => {
      this.serviceAttr.data.push(val.revenue);
      this.serviceAttr.label.push(val.name);
    });
    this.handleData(data);
    this.serviceAttr.option = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
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
      backgroundColor: ['#398DD7', '#ffbc58', '#13c9ca', '#ff8084', '#FFE88E', '#B3FDB8', '#D9E1EC', '#FF0000', '#2EFE64', '#FF00FF']
    }];
  }

  changeFilter = (): void => {
    Object.entries(ROOM_REPORT_FILTER).map(([key, value]) => {
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
      if (this.filterResult.condition == 'room') {
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
      let isIncludes = this.renderSelect.findIndex((item) => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }

      let filter = { ...this.filters.filter }
      if (this.filterResult.condition == 'room') {
        filter.roomId = this.filterResult.value;
      } else {
        filter.fromDate = String(this.filterResult.from);
        filter.toDate = String(this.filterResult.to);
      }
      this.filters.filter = filter;
      this.onLoadReportRoom();
    }
  }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter };
    if (param.firstCondition == ROOM_REPORT_FILTER.room) {
      filter.roomId = null;
    } else {
      filter.fromDate = null;
      filter.toDate = null;
    }
    this.filters.filter = filter;
    this.onLoadReportRoom();
  }

  handleData = (data): void => {
    this.roomReport = _.cloneDeep(data);
    this.roomReport.filter(val => {
      val.revenue = val.revenue ? formatCurentcy(val.revenue) : formatCurentcy(0);
    })
  }

  getRoomId = (id: string): string => {
    return this.rooms?.find(room => room._id == id)?.name;
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Phòng',
    prop: 'name',
    width: 100,
    summaryFunc: () => { return '<b>Tổng</b>' }
  },
  {
    name: 'Số bệnh nhân',
    prop: 'value',
    width: 100,
  },
  {
    name: 'Doanh thu',
    prop: 'revenue',
    width: 100,
    colType: 'money',
    summaryFunc: (cell) => {
      const sum = cell.reduce((sum, cell) => (sum += formatCurrencyNumber(cell)), 0)
      return `<b>${formatCurentcy(sum)}</b>`
    }
  }
];
