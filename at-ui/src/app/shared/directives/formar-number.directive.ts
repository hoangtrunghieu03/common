import { Directive, OnInit, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[format-number]'
})
export class FormatNumberDirective implements OnInit {

  constructor(public el: ElementRef, public renderer: Renderer2) { }

  ngOnInit() {
    setTimeout(() => {
      this.format(this.el.nativeElement.value);
    }, 100);
  }

  @HostListener('input', ["$event.target.value"]) onInput(e: string) {
    this.format(e);
  };

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.format(event.clipboardData.getData('text/plain'));
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.nativeElement.select();
  }

  format(val: string) {
    let numberFormat = val.replace(/[^0-9]+/g, '');
    if (numberFormat.length > 1 && numberFormat.substr(0, 1) == '0') {
      numberFormat = numberFormat.substr(1, numberFormat.length);
      if (numberFormat.includes('00')) {
        numberFormat = '';
      }
    } else if (numberFormat.length < 1) {
      numberFormat = '';
    } else if (numberFormat.length == 14 && Number(numberFormat.replace(/\./g, '')) > 90000000000 || numberFormat.length == 15) {
      numberFormat = '90000000000';
    }
    this.renderer.setProperty(this.el.nativeElement, 'value', numberFormat);
  }

}