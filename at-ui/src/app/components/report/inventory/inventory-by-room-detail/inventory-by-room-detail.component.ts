import { filter, takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { ATContent, FilterModel } from 'src/app/shared/data/at.model';
import { onLoadReportSupplyInventoryByRoom, onLoadReportSupplyInventoryByRoomDetail } from 'src/app/store/actions/report.action';
import { RootState } from 'src/app/store/entities/state.entity';
import ReportSupply from '../../../../../../../at-common/model/ReportSupply';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-inventory-by-room-detail',
  templateUrl: './inventory-by-room-detail.component.html',
  styleUrls: ['./inventory-by-room-detail.component.scss'],
})
export class InventoryByRoomDetailComponent implements OnInit {
  inventoryContent: ATContent[];
  roomDetails: any[] = [];
  columnDef: ColDef[] = COL_DEF;
  room: any = {};
  conditionData = {date: 'Ngày'};
  // conditionData = ROOM_REPORT_FILTER;
  filterResult: FilterModel = {
    condition: 'date',
    conditionSelect: this.conditionData.date,
    value: null,
    fromDate: null,
    toDate: null,
  };
  filters = new ReportSupply();
  constructor(
    private router: Router,
    public location: Location,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      if (param && param._id) {

        this.onLoadreportInventoryMedicalDetail(param.roomId, param._id, param.fromDate, param.toDate);
        this.onLoadReportInventoryByRoomDetail(param.roomId, param._id, param.fromDate, param.toDate);
      }
    });
  }
  onLoadReportInventoryByRoomDetail = (roomId:string, supplyId:string, from, to) => {
    let filter = { ...this.filters.filter }
    filter.roomId = roomId;
    filter.fromDate = from;
    filter.toDate = to;
    filter.medicalSupplyId=null;
    this.filters.filter = filter;

    this.store.dispatch(onLoadReportSupplyInventoryByRoom(this.filters));
    this.store.select(state => state.report.inventoryByRoom)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(inventoryByRoom => {
      if (!inventoryByRoom || !inventoryByRoom['rooms']) return this.room = [];
      this.room = inventoryByRoom['rooms'].find(item => item.supplyId === supplyId);
      this.inventoryContent = [
        // {label: 'Tên vật tư', value: 'Lợi'},
        { label: 'Số lượng nhập', value: this.room?.quantityRemain },
        { label: 'Số lượng đã dùng', value: this.room?.quantityUse },
        { label: 'Số lượng còn lại', value: this.room?.quantity },
      ];
    })
  }
  onSelectRow(medicalRecordId, prop) {
    if (!prop) return;
    if (!medicalRecordId) {
      return;
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: medicalRecordId,
      },
    };

    this.router.navigate(
      ['benh-an/chi-tiet/i'],
      navigationExtras
    );
  }
  // navigateSupply(id:string) {
  //   let navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       _id: id,
  //     },
  //   };
  //   this.router.navigate(['ton-kho/vat-dung/I'],navigationExtras);
  // }
  onLoadreportInventoryMedicalDetail( roomId: string, id: string, from: string, to: string) {
    let filter = { ...this.filters.filter };
    filter.medicalSupplyId = id;
    filter.fromDate = from;
    filter.toDate = to;
    filter.roomId = roomId;
    this.filters.filter = filter;
    this.store.dispatch(onLoadReportSupplyInventoryByRoomDetail(this.filters));
    this.store
      .select((state) => state.report.roomDetails)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((roomDetails) => {
        if (!roomDetails || !roomDetails['roomDetails'])
          return (this.roomDetails = []);

        const formatData = this.handleDate(roomDetails['roomDetails']);
        this.roomDetails = this.sortData(formatData);

      });
  }
  handleDate (data: any[]) {
    const formattedData = data.map(item => {
      const date = new Date(item.dateUse); // Convert dateUse to a Date object
      const day = date.getDate().toString().padStart(2, '0'); // Get the day as a two-digit string
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month as a two-digit string (month index is zero-based)
      const year = date.getFullYear(); // Get the full year
      const formattedDate = `${day}/${month}/${year}`; // Format the date as "DD/MM/YYYY"
      return { ...item, dateUse: formattedDate }; // Return a new object with the dateUse property formatted
  });
  return formattedData;
  }
  sortData(data) {
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.dateUse);
      const dateB = new Date(b.dateUse);
      a.customerName?.trim().localeCompare(b.customerName?.trim());
      return dateA.getTime() - dateB.getTime();
    });

    return sortedData;
  }
  onBackClick = () => {
    this.router.navigate(['bao-cao/hang-ton/theo-phong']);
  };
}
const COL_DEF: Array<ColDef> = [
  {
    name: 'Mã bệnh nhân',
    prop: 'medicalRecordCode',
    width: 100,
    router: true,
    path: 'I',
  },
  {
    name: 'Họ tên',
    prop: 'customerName',
    width: 150,
  },
  {
    name: 'Số lượng dùng',
    prop: 'qtyUse',
    width: 100,
  },
  {
    name: 'Ngày dùng',
    prop: 'dateUse',
    width: 150,
  },
];
