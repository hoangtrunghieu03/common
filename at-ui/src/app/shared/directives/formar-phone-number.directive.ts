import { Directive, OnInit, ElementRef, HostListener, Renderer2, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Directive({
  selector: '[phone-number]'
})
export class FormatPhoneNumberDirective implements OnInit {

  private _formControl: AbstractControl;
  private _preValue: string;
  private _formName: string;

  constructor(public el: ElementRef, public renderer: Renderer2) { }

  @Input()
  set formControl(control: AbstractControl) {
    this._formControl = control;
  }

  @Input()
  set preValue(value: string) {
    this._preValue = value;
  }

  @Input()
  set formName(value: string) {
    this._formName = '#' + value;
  }

  @HostListener('input', ["$event.target.value"]) onInput(e: string) {
    this.phoneValidate(e);
  };

  @HostListener('paste', ["$event.target.value"]) onPaste(e: string) {
    this.phoneValidate(e);
  };

  ngOnInit() {
    setTimeout(() => {
      this.phoneValidate(this.el.nativeElement.value);
    }, 100);
  }

  phoneValidate(data: string) {
    let preInputValue: string = this._preValue;
    var newVal = data.replace(/\D/g, '');

    let start = this.renderer.selectRootElement(this._formName).selectionStart;
    let end = this.renderer.selectRootElement(this._formName).selectionEnd;

    if (newVal.length == 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,4})/, '$1');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})/, '$1 $2');
    } else {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,3})(.*)/, '$1 $2 $3');
    }

    if (data?.length < preInputValue?.length) {
      // this.renderer.setProperty(this.el.nativeElement, 'value', newVal);
      this._formControl.setValue(newVal, { emitEvent: false });
      this.renderer.selectRootElement(this._formName).setSelectionRange(start, end);
    } else {
      if (preInputValue?.length >= start) {
        // this.renderer.setProperty(this.el.nativeElement, 'value', newVal);
        this._formControl.setValue(newVal, { emitEvent: false });
        this.renderer.selectRootElement(this._formName).setSelectionRange(start, end);
      } else {
        // this.renderer.setProperty(this.el.nativeElement, 'value', newVal);
        this._formControl.setValue(newVal, { emitEvent: false });
        this.renderer
          .selectRootElement(this._formName)
          .setSelectionRange(start + 2, end + 2);
      }
    }
  }

}