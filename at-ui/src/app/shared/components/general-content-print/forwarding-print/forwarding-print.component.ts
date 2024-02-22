import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataForwardingCustomToPrint } from 'src/app/shared/data/at.model';
import { PRINT_STATUS } from 'src/app/shared/enum/share.enum';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { PrintService } from 'src/app/shared/service/print.service';
import { onLoadSettings } from 'src/app/store/actions/setting.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { to_vietnamese } from '../../../functions/convertNumberToCharacter';
import ColumnDef from '../../at-base-table/at-base-table.component';

@Component({
  selector: 'app-forwarding-print',
  templateUrl: './forwarding-print.component.html',
  styleUrls: ['./forwarding-print.component.scss']
})
export class ForwardingPrintComponent implements OnInit {

  dataCustom: DataForwardingCustomToPrint = new DataForwardingCustomToPrint();

  subject = new Subject();

  columnDef = COLDEF;

  to_vietnamese = to_vietnamese;

  dateCurrent: any = [];

  constructor(
    private printService: PrintService,
    private activeRoute: ActivatedRoute,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
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
        this.onLoadMedicalRecord();
      }
    })

    this.subject.next(true)
  }

  onLoadMedicalRecord = (): void => {
    this.printService.forwardingPrint.subscribe(val => {
      if (val === PRINT_STATUS.forwardingPrint) return;
      this.dataCustom = JSON.parse(val);
    })
  }

}

const COLDEF: ColumnDef[] = [
  {
    title: 'name',
    label: 'Nội dung dịch vụ',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    title: 'unit',
    label: 'ĐVT',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    title: 'quantity',
    label: 'SL',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    title: 'money',
    label: 'Giá dịch vụ',
    colType: 'money',
    headerStyle: 'text-align: center',
    style: 'text-align: right; padding-right: 12px'
  },
  {
    title: 'discountMoney',
    label: 'Giảm giá',
    colType: 'money',
    headerStyle: 'text-align: center',
    style: 'text-align: right; padding-right: 12px'
  },
  {
    title: 'totalMoney',
    label: 'Thành tiền',
    colType: 'money',
    headerStyle: 'text-align: center',
    style: 'text-align: right; padding-right: 12px'
  },
]