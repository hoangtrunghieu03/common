import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, Input, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'at-input',
  templateUrl: './at-input.component.html',
  styleUrls: ['./at-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtInputComponent),
      multi: true
    }
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class AtInputComponent implements OnInit {

  @Input() label: string;
  @Input() pattern:string ='';
  @Input() formName: string; // formControlName
  @Input() typeInput: string = 'text' // type of input -> text, number, date-time, password,...;
  @Input() inputType: string = 'text' // number | money | text: default;
  @Input() placeholder: string = 'Nhập thông tin';

  _required: boolean = false;
  @Input()
  set required(value: boolean) { this._required = coerceBooleanProperty(value); }
  get castedRequired(): boolean { return this._required; }
  get requiredType(): string { return typeof this.castedRequired }

  _inputRequired: boolean = false;
  @Input()
  public set inputRequired(value: boolean) { this._inputRequired = coerceBooleanProperty(value) }
  get castedInputRequired(): boolean { return this._inputRequired }
  get inputRequiredType(): string { return typeof this.castedInputRequired }


  _inputValid: boolean = false;
  @Input()
  set inputValid(value: boolean) { this._inputValid = coerceBooleanProperty(value) }
  get castedInputValid(): boolean { return this._inputValid }
  get inputValidType(): string { return typeof this.castedInputValid }

  _disabled: boolean = false;
  @Input()
  set disabled(value: boolean) { this._disabled = coerceBooleanProperty(value); }
  get castedDisabled(): boolean { return this._disabled; }
  get disabledType(): string { return typeof this.castedDisabled }

  _formControl: AbstractControl;
  @Input()
  set formControl(control: AbstractControl) {
    this._formControl = control;
  }

  _preValue: string;
  @Input()
  set preValue(value: string) {
    this._preValue = value;
  }

  subject$ = new Subject();
  @Output() inputChange = this.subject$.pipe(
    debounceTime(500)
  )

  @HostListener('input', ["$event.target.value"]) onInput(e: string) {
    (this.inputType == 'phoneNumber' && this._formControl) && this.phoneValidate(e);
    (this.inputType == 'name' && this._formControl) && this.nameValidate(e);
  };

  @HostListener('paste', ["$event.target.value"]) onPaste(e: string) {
    (this.inputType == 'phoneNumber' && this._formControl) && this.phoneValidate(e);
    (this.inputType == 'name' && this._formControl) && this.nameValidate(e);
  };

  constructor(
    private cd: ChangeDetectorRef,
    public el: ElementRef,
    public renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      (this.inputType == 'phoneNumber' && this._formControl) && this.phoneValidate(this._formControl.value);
      (this.inputType == 'name' && this._formControl) && this.nameValidate(this._formControl.value);
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.preValue) {
      this._preValue = changes.preValue.previousValue;
    }
  }
  nameValidate(data: string) {
    if (!data) {
      return this._formControl.setValue('', { emitEvent: false });
    }
    const cleanInput = data.replace(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/\-="']/g, '')
    this._formControl.setValue(cleanInput, { emitEvent: false });
  }
  writeValue = (value: string): void => {
  }
  registerOnChange = (fn: any): void => {
  }
  registerOnTouched = (fn: any): void => {
  }
  setDisabledState = (isDisabled: boolean): void => {
  }

  onChangeVal = (event): void => {
    this.subject$.next(event.target.value)
  }

  phoneValidate(data: string) {
    if (!data) {
      return this._formControl.setValue('', { emitEvent: false });
    }

    let preInputValue: string = this._preValue;
    var newVal = data.replace(/\D/g, '');

    let start = this.renderer.selectRootElement('#' + this.formName).selectionStart;
    let end = this.renderer.selectRootElement('#' + this.formName).selectionEnd;

    if (newVal.length == 0) {
      newVal = '';
    } else if (newVal.length <= 4) {
      newVal = newVal.replace(/^(\d{0,4})/, '$1');
    } else if (newVal.length <= 7) {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})/, '$1 $2');
    } else {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})(.*)/, '$1 $2 $3');
    }

    if (data.length < preInputValue?.length) {
      // this.renderer.setProperty(this.el.nativeElement, 'value', newVal);
      this._formControl.setValue(newVal, { emitEvent: false });
      this.renderer.selectRootElement('#' + this.formName).setSelectionRange(start, end);
    } else {
      if (preInputValue?.length >= start) {
        // this.renderer.setProperty(this.el.nativeElement, 'value', newVal);
        this._formControl.setValue(newVal, { emitEvent: false });
        this.renderer.selectRootElement('#' + this.formName).setSelectionRange(start, end);
      } else {
        // this.renderer.setProperty(this.el.nativeElement, 'value', newVal);
        this._formControl.setValue(newVal, { emitEvent: false });
        this.renderer
          .selectRootElement('#' + this.formName)
          .setSelectionRange(start + 2, end + 2);
      }
    }
  }

}
