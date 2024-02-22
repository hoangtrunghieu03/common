import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective } from '@angular/forms';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { formatTextLating } from '../../functions/function-helper';

@Component({
  selector: 'at-select',
  templateUrl: './at-select.component.html',
  styleUrls: ['./at-select.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AtSelectComponent implements OnInit {

  @Input() isEnum: boolean;

  @Input() formName: string;
  @Input() formControlSelect: FormControl;
  @Input() textPlaceHolder: string = "Tìm kiếm";

  @Input() AtData: Array<{label: string, value: string | number}>;
  @Input() AtDataFilter: Array<{label: string, value: string | number}>;
  @Input() label: string;

  @Input() required: boolean;
  @Input() selectValid: boolean;
  @Input() selectRequired: boolean;
  @Input() disabled: boolean;
  @Input() textSearch: string;

  @Output() _onChangeValueSelected: EventEmitter<string | number | boolean> = new EventEmitter();
  @Output() _onChangeValue: EventEmitter<string | number | boolean> = new EventEmitter();

  private subject = new Subject<string | any>();
  @Output() inputEmitter = this.subject.pipe(
    debounceTime(500)
  );

  constructor() { }

  ngOnInit(): void {
    this.subject.pipe(
      debounceTime(500)
    ).subscribe(val => {
      this.onSearch(val)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.AtDataFilter = _.cloneDeep(this.AtData);
    let value = this.AtData.find(x => x.value == this.formControlSelect?.value)?.label;
    this.textSearch = (value ? value : this.textSearch) as any;
  }

  onKeyUp(event) {
    let val = event.target.value?.replace(/\s+/g,' ')
    this.textSearch = val;
    this.subject.next(val);
    this._onChangeValue.emit(val)
  }

  removeText(){
    this.textSearch = null;
    this.subject.next(this.textSearch);
    this.formControlSelect.setValue(null);
  }

  handleSelectedChange(valueName: string, value: string):void {
    this.textSearch = valueName;
    this.subject.next(null);
    this.formControlSelect.setValue(value);
    this._onChangeValueSelected.emit(value);
    this._onChangeValue.emit(valueName);
  }

  onSearch(event): void {
    this.AtDataFilter = this.AtData.filter((val) => (event
        ? formatTextLating(val.label).indexOf(formatTextLating(event)) > -1
        : true)
    );
  }
}
