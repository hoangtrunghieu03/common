import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormatDateComponent } from '../../functions/function-helper';
import { CustomAdapter } from '../at-datepicker/custom-adapter.service';


@Component({
  selector: 'at-datetimepicker',
  templateUrl: './at-datetimepicker.component.html',
  styleUrls: ['./at-datetimepicker.component.scss'],
  providers: [DatePipe, FormatDateComponent, CustomAdapter]
})
export class DateTimePickerComponent implements OnInit {

  @Output() eventDateTime: EventEmitter<any> = new EventEmitter();

  @Input() label: string;
  @Input() formCtrlName: string;
  @Input() dataDateTime: string;
  @Input() inputRequired: boolean;
  @Input() minDate: any = null;
  @Input() maxDate: any = null;

  date: any = null;
  time: any = null;
  dateTimeDisplay: any = null;
  showDateTimeDrop: boolean = false;

  _required: boolean;
  @Input()
  set required(val: any) { this._required = coerceBooleanProperty(val); }
  get castedRequired(): boolean { return this._required; }
  get requiredType(): string { return typeof this.castedRequired }

  _disabled: boolean = false;
  @Input()
  set disabled(value: boolean) { this._disabled = coerceBooleanProperty(value); }
  get castedDisabled(): boolean { return this._disabled; }
  get disabledType(): string { return typeof this.castedDisabled }

  constructor(
    private customAdapter: CustomAdapter,
    private ngbCalendar: NgbCalendar,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inputRequired = changes.inputRequired?.currentValue ? changes.inputRequired?.currentValue : null;
    if (this.dataDateTime) {
      if (!this.isIsoDate(this.dataDateTime)) {
        let dateTime = this.datePipe.transform(this.dataDateTime, 'yyyy-MM-dd HH:mm') + ' UTC';
        this.dataDateTime = new Date(dateTime).toISOString();
      }
      this.dateTimeDisplay = this.datePipe.transform(this.dataDateTime, 'dd/MM/yyyy HH:mm', 'UTC');
      this.date = this.getDate(this.datePipe.transform(this.dataDateTime, 'dd-MM-yyyy', 'UTC'));
      this.time = this.getTime(this.datePipe.transform(this.dataDateTime, 'HH:mm', 'UTC'));
    } else {
      this.date = this.getDate(this.getToday());
      this.time = this.getTime('00:00');
    }
  }

  getDate = (value: string | null): NgbDateStruct | null => {
    return this.customAdapter.fromModel(value);
  }

  getTime = (value: string | null): NgbTimeStruct | null => {
    if (value) {
      const date = value.split(':');
      return {
        hour: parseInt(date[0], 10),
        minute: parseInt(date[1], 10),
        second: null
      };
    }
    return null;
  }

  formatDateTime(date: NgbDateStruct | null, time: NgbTimeStruct | null) {
    return date.year + '-' + `0${date.month}`.slice(-2) + '-' + `0${date.day}`.slice(-2) + 'T' +
      `0${time?.hour ? time?.hour : 0}`.slice(-2) + ':' + `0${time?.minute ? time?.minute : 0}`.slice(-2);
  }

  getDateTime = () => {
    let dateTime = this.formatDateTime(this.date, this.time);
    this.dateTimeDisplay = this.datePipe.transform(dateTime, 'dd/MM/yyyy HH:mm');
    let dateTimeEmit = this.datePipe.transform(dateTime, 'yyyy-MM-dd HH:mm') + ' UTC';
    this.eventDateTime.emit(new Date(dateTimeEmit).toISOString());
  }

  getToday = () => {
    return this.customAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  isIsoDate = (str) => {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    return d instanceof Date && !isNaN(Number(d)) && d.toISOString() === str; // valid date 
  }

  editDateTimeDrop = () => {
    this.showDateTimeDrop = !this.showDateTimeDrop;
  }
}
