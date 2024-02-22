import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'at-textarea',
  templateUrl: './at-textarea.component.html',
  styleUrls: ['./at-textarea.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AtTextareaComponent implements OnInit {

  @Input() label: string;
  @Input() formName: string; // formControlName
  @Input() placeholder: string = 'Nhập thông tin';

  _required: boolean;
  @Input()
  set required(val: any) { this. _required = coerceBooleanProperty(val); }
  get castedRequired():boolean { return this._required; }
  get requiredType():string { return typeof this.castedRequired }

  _valid: boolean = false;
  @Input()
  set valid(value: boolean) { this._valid = coerceBooleanProperty(value) }
  get castedValid(): boolean { return this._valid; }
  get validType():string { return typeof this.castedValid}

  private _disabled: boolean = false;
  @Input()
  set disabled(value: boolean) { this._disabled = coerceBooleanProperty(value) }
  get castedDisabled(): boolean { return this._disabled; }
  get disabledType():string { return typeof this.castedDisabled}

  subject$ = new Subject();
  @Output() inputChange = this.subject$.pipe(
    debounceTime(500)
  )

  constructor() { }

  ngOnInit(): void {
  }

}
