import { ReportService } from 'src/app/shared/service/report.service';
import { Component, OnInit } from '@angular/core';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterModel } from 'src/app/shared/data/at.model';
import { ROOM_REPORT_FILTER } from 'src/app/shared/data/report';
import Room from '../../../../../../../at-common/model/Room';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/entities/state.entity';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import ReportSupply from '../../../../../../../at-common/model/ReportSupply';
import { onLoadReportSupplyInventoryByRoom } from 'src/app/store/actions/report.action';
import { formatCurentcy } from 'src/app/shared/functions/function-helper';
import * as _ from 'lodash';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-inventory-by-room',
  templateUrl: './inventory-by-room.component.html',
  styleUrls: ['./inventory-by-room.component.scss'],
})
export class InventoryByRoomComponent implements OnInit {
  columnDef: ColDef[] = COL_DEF;
  conditionData = ROOM_REPORT_FILTER;
  filterResult: FilterModel = {
    condition: 'room',
    conditionSelect: this.conditionData.room,
    value: null,
    fromDate: null,
    toDate: null,
  };
  inventory: any[] = [];
  renderSelect: Array<any> = [];
  rooms: Room[] = [];
  filters = new ReportSupply();
  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private destroy: DestroySubsribeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.onLoadRooms();
    // this.onLoadReportInventoryByRoom();

  }
  onLoadReportInventoryByRoom = () => {
    // let filter = { ...this.filters.filter }
    // this.filters.filter = filter;
    this.store.dispatch(onLoadReportSupplyInventoryByRoom(this.filters));
    this.store.select(state => state.report.inventoryByRoom)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(inventoryByRoom => {
      if (!inventoryByRoom || !inventoryByRoom['rooms']) return this.inventory = [];
      this.handleData(inventoryByRoom['rooms']);
    })
  }
  onSelectRow(row, prop) {
    if (!prop) return;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: row._id,
        roomId: this.filters.filter?.roomId,
        fromDate: this.filters.filter?.fromDate,
        toDate: this.filters.filter?.toDate
      }
    }
    this.router.navigate(['bao-cao/hang-ton/theo-phong/I'], navigationExtras);
  }
  handleData = (data): void => {
    this.inventory = _.cloneDeep(data)
    this.inventory.sort((a, b) => a.name.trim().localeCompare(b.name.trim()));
    this.inventory =  this.inventory.map(item => {
      return { ...item, _id: item.supplyId};
    });
  }
  onSearch(event): void {
    let filter = { ...this.filters.filter}
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadReportInventoryByRoom();
  }
  onLoadRooms = (): void => {
    this.store.dispatch(onLoadRooms());
    this.store
      .select((state) => state.room.rooms)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((room) => {
        if (!room || room.length == 0) return ;
        this.rooms = room;
        let newFilter = {
          id: Date.now(),
          key: Object.keys(this.conditionData)[1],
          firstCondition: this.conditionData.room,
          secondCondition: room[1]._id,
          from: null,
          to: null
        }
        let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
        if (isIncludes === -1) {
          this.renderSelect.push(newFilter);
        } else {
          this.renderSelect.splice(isIncludes, 1, newFilter);
        }
        let filter = { ...this.filters.filter }
        filter.roomId = room[1]._id;
        this.filters.filter = filter;
        this.onLoadReportInventoryByRoom();
      });
  };
  onAddCondiotion = (): void => {
    let newFilter;


    if ((this.filterResult.condition && this.filterResult.value) ||
      (this.filterResult.condition && this.filterResult.fromDate && this.filterResult.toDate)) {
        if(this.filterResult.condition == 'room'){
          newFilter = {
            id: Date.now(),
            key: this.filterResult.condition,
            firstCondition: this.filterResult.conditionSelect,
            secondCondition: this.filterResult.value,
            from: null,
            to: null
          }
        }
        else {
          newFilter = {
            id: Date.now(),
            key: this.filterResult.condition,
            firstCondition: this.filterResult.conditionSelect,
            secondCondition: null,
            from: this.filterResult.fromDate,
            to: this.filterResult.toDate
          }
        }

      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }
      let filter = { ...this.filters.filter }
      if (this.filterResult.conditionSelect == this.conditionData.date) {
        filter.fromDate = this.filterResult.fromDate;
        filter.toDate = this.filterResult.toDate;
      }
      else{
        filter.roomId = this.filterResult.value;
      }
      this.filters.filter = filter;

      this.onLoadReportInventoryByRoom();
    }
  };
  onFilterConditionChange = (): void => {
    Object.entries(ROOM_REPORT_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    });
    this.filterResult.value = null;
    this.filterResult.fromDate = null;
    this.filterResult.toDate = null;
  };
  getRoomId = (id: string): string => {
    return this.rooms?.find(room => room._id == id)?.name;
  }
  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter }
    if (param.firstCondition == this.conditionData.date) {
      filter.fromDate = null;
      filter.toDate = null;
    }
    else{
      filter.roomId = null;
    }

    this.filters.filter = filter;
    this.onLoadReportInventoryByRoom();
  };
}
const COL_DEF: Array<ColDef> = [
  {
    name: 'Tên vật dụng',
    prop: 'name',
    width: 150,
    router: true,
    path: 'I'
  },
  {
    name: 'Đơn vị',
    prop: 'unit',
    width: 150,
  },
  {
    name: 'Số lượng xuất',
    prop: 'quantityImport',
    width: 100,
  },
  {
    name: 'Số lượng sử dụng',
    prop: 'quantityUse',
    width: 150,
  },
  {
    name: 'Còn lại',
    prop: 'quantity',
    width: 150,
  },
];
