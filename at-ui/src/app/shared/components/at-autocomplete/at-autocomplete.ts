import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'at-autocomplete',
  templateUrl: './at-autocomplete.html',
  styleUrls: ['./at-autocomplete.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AtCompleteComponent implements OnInit {

  subject$ = new Subject<string>();
  @Output() onChange = new EventEmitter<any>();
  @Output() setName = this.subject$.pipe(
    debounceTime(500)
  )
  @Input() _keySearch: string = null;
  @Input() _data: Array<ATAuComplete>;
  @Input() _dataSelected: Array<any> = [];
  @Input() _label: string;
  @Input() _class: string;
  @Input() container: string = 'body';
  @Input() inpId: string;
  @Input() inpClass: string;
  @Input() formValue: string; // formControlName

  private _require: boolean = false;
  @Input()
  set require(value: boolean) { this._require = coerceBooleanProperty(value) }
  get castedRequire(): boolean { return this._require; }
  get requireType ():string { return typeof this.castedRequire}

  private _disabled: boolean = false;
  @Input()
  set disabled(value: boolean) {this._disabled = coerceBooleanProperty(value) }
  get castedDisabled(): boolean { return this._disabled; }
  get disabledType():string { return typeof this.castedDisabled }

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes || !changes.formValue) return;
    this._keySearch = changes.formValue?.currentValue;
  }

  handleSelectData = (item):void => {
    this.onChange.emit(item)
  }

  blurInputScope = ():void => {
    this.formValue && ( this._keySearch = this.formValue )
  }

  onkeyUp = (event):void => {
    this.subject$.next(event.target.value)
  }
}

export default interface ATAuComplete {
  label: string
  value: number | string
  _id: string
}