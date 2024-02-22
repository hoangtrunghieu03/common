import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter } from "./custom-adapter.service";
import { CustomDateParserFormatter } from "./custome-formatDate.service";
import { DatePipe } from '@angular/common';
import { FormatDateComponent } from "../../functions/function-helper";

@Component({
  selector: 'at-datepicker',
  templateUrl: './at-datepicker.component.html',
  styleUrls: ['./at-datepicker.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    DatePipe,
    FormatDateComponent
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})

export class AtDatepickerComponent implements OnInit {

  @Input() date: string;
  @Input() label: string;
  @Input() formCtrlName: string;
  @Input() inputRequired: boolean;
  @Input() minDate: any = null;
  @Input() maxDate: any = null;

  _required: boolean;
  @Input()
  set required(val: any) { this. _required = coerceBooleanProperty(val); }
  get castedRequired():boolean { return this._required; }
  get requiredType():string { return typeof this.castedRequired }

  _disabled: boolean = false;
  @Input()
  set disabled(value: boolean) { this._disabled = coerceBooleanProperty(value); }
  get castedDisabled(): boolean { return this._disabled; }
  get disabledType():string { return typeof this.castedDisabled }

  constructor(
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
    private formatDate: FormatDateComponent
  ) {}


  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.date = changes.date?.currentValue ? changes.date?.currentValue : null;
    this.cd.detectChanges();
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

}
