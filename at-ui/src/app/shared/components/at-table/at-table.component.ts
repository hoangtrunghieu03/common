import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootState } from '../../../store/entities/state.entity';
import { onReceiveCustomerToRoom } from 'src/app/store/actions/medicalRecord.action';
import { ROOM_STATUS } from '../../../../../../at-common/model/enum';
import { formatPhoneNumber } from '../../functions/function-helper';
import { RoomList } from '../../enum/share.enum';
import Room from '../../../../../../at-common/model/Room';
import { DestroySubsribeService } from '../../service/destroySubscribe.service';

@Component({
  selector: 'at-table',
  templateUrl: './at-table.component.html',
  styleUrls: ['./at-table.component.scss']
})
export class AtTableComponent implements OnInit {
  @Input() totalFooterShow: Array<{label: string, value: number}> = [];
  @Input() tableData: Array<any>;
  @Input() limit: number = 10;
  @Input() columnDef: Array<ColDef> = []
  @Input() haveCheckbox: boolean = false;
  @Input() emptyMessage: string = 'Không có dữ liệu';
  _scrollbarH: boolean;
  @Input()
  set scrollbarH(val: any){ this._scrollbarH = coerceBooleanProperty(val) };
  get castedScrollbarH ():boolean { return this._scrollbarH }
  get scrollbarHType():string { return typeof this.castedScrollbarH }
  SelectionType = SelectionType;
  selected:Array<any> = [];
  subject$ = new Subject();
  @Output() emitSelectRow = this.subject$.pipe(
    debounceTime(300)
  )

  rooms: Room[] = [];

  formatPhoneNumber = formatPhoneNumber;

  constructor(
    private router: Router,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.onLoadRooms();
  }

  onLoadRooms = (): void => {
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(room => {
        this.rooms = room;
      })
  }

  onSelect({ selected }):void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.subject$.next(this.selected)
  }

  onSelectRow(col, row) {
    if(col?.router) {
      if (!this.columnDef?.some(x => x.router)) return;
      let navigationExtras: NavigationExtras = {
        queryParams: {
          _id: row._id
        }
      }
      if(col?.urlRoot && col?.urlRoot[1] && row[col?.urlRoot[1]])  {
        navigationExtras = {
          queryParams: {
            _id: row[col?.urlRoot[1]]
          }
        }
      }
      let routerCurrent = this.router.url + '/I';
      if (row?.examinationFlag || (row.currentRoom ? row.serviceType != this.getRoomName(row.currentRoom) : false)) {
        routerCurrent = this.router.url + '/chi-tiet/I';
      }
      if(col?.urlRoot && col?.urlRoot[0]) routerCurrent = col?.urlRoot[0];
      this.router.navigate([routerCurrent], navigationExtras);
    }
  }

  getRoomName = (_id: string): string => {
    return this.rooms?.find(room => room._id === _id)?.name;
  }

}

export default interface ColDef{
  name: string
  prop: string
  width: number | string
  colType?: string
  styleHeader?: string
  styleBody?: string
  router?: boolean
  path?: string
  urlRoot?: Array<any> // url discontinuance - urlRoot[0] = url | urlRoot[1] = queryParams
  summaryPosition?: string
  summaryRow?: boolean
  summaryFunc?: (cell: any) => number | string
}
