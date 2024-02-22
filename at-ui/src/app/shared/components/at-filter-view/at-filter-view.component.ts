import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'at-filter-view',
  templateUrl: './at-filter-view.component.html',
  styleUrls: ['./at-filter-view.component.scss']
})
export class AtFilterViewComponent implements OnInit {

  @Input() title: string
  @Output() eventAddFilter: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onAddFilter = ():void => {
    this.eventAddFilter.emit();
  }
}
