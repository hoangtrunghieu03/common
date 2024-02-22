import { Component, EventEmitter, Output } from '@angular/core';
import { AtTableComponent } from '../at-table/at-table.component';

@Component({
  selector: 'at-table-sumary',
  templateUrl: './at-table-sumary.component.html',
  styleUrls: ['./at-table-sumary.component.scss']
})
export class AtTableSumaryComponent extends AtTableComponent {
  @Output() onSelectEvent: EventEmitter<any> = new EventEmitter();

  onActivate(event) {
    event.type == 'click' && this.onSelectEvent.emit(event.row);
  }
}