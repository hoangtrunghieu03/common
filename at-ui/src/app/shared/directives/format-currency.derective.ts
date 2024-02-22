import { Directive, HostListener, ElementRef, OnInit, Input } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
import { SimpleChanges } from "@angular/core";
import { ProgressBarService } from "../service/progress-bar.service";
import { RootState } from "src/app/store/entities/state.entity";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

@Directive({ selector: "[currencyInput]" })
export class CurrencyInputDirective implements OnInit {

  sub:  Subscription;
  // build the regex based on max pre decimal digits allowed
  private regexString(max?: number) {
    const maxStr = max ? `{0,${max}}` : `+`;
    return `^(\\d${maxStr}(\\.\\d{0,2})?|\\.\\d{0,2})$`
  }
  private digitRegex: RegExp;
  private setRegex(maxDigits?: number) {
    this.digitRegex = new RegExp(this.regexString(maxDigits), 'g')
  }
  @Input()
  set maxDigits(maxDigits: number) {
    this.setRegex(maxDigits);
  } 

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private store: Store<RootState>
  ) {
    this.el = this.elementRef.nativeElement;
    this.setRegex();
  }

  ngOnInit() {
    this.sub = this.store.select(state => state.progress.count).subscribe(show => {
      setTimeout(() => {
        if (this.el.value != '') {
          this.format(this.el.value);
          if (!this.el.value.includes('đ') && this.el != document.activeElement) {
            this.el.value = this.el.value + ' đ'
          }
        }
      }, 100);
    })
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = value.replace(/[^0-9.]+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.el.select();
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    if (value != '') {
      if (!this.el.value.includes('đ')) {
        this.el.value = this.el.value + ' đ'
      }
    }
  }

  @HostListener('input', ['$event'])
  onInput(event) {
    this.format(event.target.value);
  }

  format(val: string) {
    let numberFormat = val.replace(/[^0-9]+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (numberFormat.length > 1 && numberFormat.substr(0, 1) == '0') {
      numberFormat = numberFormat.substr(1, numberFormat.length);
      if (numberFormat.includes('00')) {
        numberFormat = ''
      }
    } else if (numberFormat.length < 1) {
      numberFormat = ''
    } else if (numberFormat.length == 14 && Number(numberFormat.replace(/\./g, '')) > 90000000000 || numberFormat.length == 15) {
      numberFormat = '90.000.000.000'
    }
    this.el.value = numberFormat;    
  }
}