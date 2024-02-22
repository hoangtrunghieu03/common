import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'at-base-table',
  templateUrl: './at-base-table.component.html',
  styleUrls: ['./at-base-table.component.scss']
})
export class AtBaseTableComponent implements OnInit {

  @Input() colDef: ColumnDef[];
  @Input() tableData: Array<any>;
  @Input() emptyMessage: string = 'Không có dữ liệu';
  @Input() action: {isDelete: boolean, isDone: boolean}
  @Output() deleteRowEvent: EventEmitter<any> = new EventEmitter();
  @Output() saveRowEvent: EventEmitter<any> = new EventEmitter();
  @Output() reduceEvent: EventEmitter<any> = new EventEmitter();
  @Output() addEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onDeleteRow = (row):void => {
    this.deleteRowEvent.emit(row)
  }

  onSave = (row): void => {
    this.saveRowEvent.emit(row)
  }

  onDecrease = (row, fieldName, fieldCompare): void => {
    row[fieldName] -= 1;
  }

  onIncrease = (row, fieldName, fieldCompare): void => {
    if (fieldCompare && row[fieldName] >= row[fieldCompare]) return;
    row[fieldName] += 1;
  }

  changeQuantity(row, event, fieldName, fieldCompare) {
    if (Number(event.target.value) == 0) {
      row[fieldName] = 1;
      event.target.value = 1;
    } else if (fieldCompare && Number(event.target.value) >= row[fieldCompare]) {
      if (Number(row[fieldCompare]) < 0) {
        row[fieldName] = 1;
      } else {
        row[fieldName] = Number(row[fieldCompare]);
      }
      event.target.value = row[fieldName];
    } else {
      row[fieldName] = Number(event.target.value);
    }
  }

  onGetColSpan = () => {
    return (this.action?.isDelete ? 1 : 0) + (this.action?.isDone ? 1 : 0) + this.colDef.length
  }

}

export default interface ColumnDef {
  value?: string | number;
  title: string
  label: string
  colType?: string // currency | date | default
  style?:string
  headerStyle?: string
  canUpdate?: boolean //true show input update item
  fieldUpdate?: string
  fieldCompare?: string
  updateType?: string // currency | number | string
}