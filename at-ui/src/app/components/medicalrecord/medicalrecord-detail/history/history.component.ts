import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import MedicalRecordReport from '../../../../../../../at-common/model/MedicalRecordReport';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'at-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  limit = 10;
  @Input() customerMedical: MedicalRecordReport[] = [];
  colDef = COL_DEF;

  constructor(
    private router: Router,
    private datePipe: DatePipe
    
  ) { }

  ngOnInit(): void {
  }

  onNavigateViewDetail = (row) => {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: row._id,
      }
    }
    this.router.navigate(['/benh-an/chi-tiet/i'], navigationExtras);
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Mã bệnh án',
    prop: 'medicalRecordCode',
    width: 100,
    router: true,
    path: '/kham-benh/phong-tong-quat/chi-tiet/i',
  },
  {
    name: 'Tên bệnh án',
    prop: 'medicalRecordName',
    width: 100,
  },
  {
    name: 'Bác sĩ thực hiện',
    prop: 'staffName',
    width: 150,
  },
  {
    name: 'Ngày',
    prop: 'date',
    width: 100,
    colType: 'date'
  },
  {
    name: 'Trạng thái',
    prop: 'statusMedical',
    width: 100,
  },
];