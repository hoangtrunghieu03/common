import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PRINT_STATUS } from 'src/app/shared/enum/share.enum';
import { PrintService } from 'src/app/shared/service/print.service';
import { onLoadSettings } from 'src/app/store/actions/setting.action';
import { RootState } from 'src/app/store/entities/state.entity';
import ColumnDef from '../../at-base-table/at-base-table.component';

@Component({
  selector: 'app-export-history-print',
  templateUrl: './inventory-history-print.component.html',
  styleUrls: ['./inventory-history-print.component.scss']
})
export class InventoryHistoryPrintComponent implements OnInit {

  dataCustom: { title: string, data: [], columnDef: [] };
  subject = new Subject();

  columnDef = [];

  dateCurrent: any = [];

  constructor(
    private printService: PrintService,
    private activeRoute: ActivatedRoute,
    private store: Store<RootState>,
    private datePipe: DatePipe,
  ) {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe(() => this.printService.onDataReady())
    this.dateCurrent = this.datePipe.transform(new Date, 'dd-MM-yyyy', 'UTC')?.split('-');
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(param => {
      if (param) {
        this.onLoadDataPrint();
      }
    })

    this.subject.next(true);
  }

  onLoadDataPrint = (): void => {
    this.printService.exportHistoryPrint.subscribe(val => {
      if (val === PRINT_STATUS.exportHistoryPrint) return;
      this.dataCustom = JSON.parse(val);
      this.columnDef =  this.dataCustom.columnDef;
    })
  }

}