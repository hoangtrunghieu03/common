import { Component, OnInit } from '@angular/core';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';

@Component({
  selector: 'at-designat-service',
  templateUrl: './designat-service.component.html',
  styleUrls: ['./designat-service.component.scss']
})
export class DesignatServiceComponent implements OnInit {

  colDef = _COLDEF
  itemData = _SERVICE_DATA

  constructor() { }

  ngOnInit(): void {
  }

}

const _COLDEF: Array<ColumnDef> = [
  { label: 'Tên chỉ định', title: 'designatName', colType: '', style: null, headerStyle: null, canUpdate: false, fieldUpdate: null, updateType: null },
  { label: 'Trạng thái', title: 'status', colType: '', style: 'width: 30%', headerStyle: 'width: 30%', canUpdate: false, fieldUpdate: null, updateType: null },
]

const _SERVICE_DATA = [
  {designatName: 'Chụp pano', status: 'Hoàn thành'},
  {designatName: 'Chụp cepha', status: 'Chưa hoàn thành'},
  {designatName: 'Chụp sọ thẳng', status: 'Chưa hoàn thành'},
  {designatName: 'Chụp CT', status: 'Chưa hoàn thành'},
]