import { Directive, OnInit, forwardRef, ElementRef, HostListener, Renderer2 } from '@angular/core';
@Directive({
  selector: '[regex-number]'
})
export class RegexNumber implements OnInit {
  constructor(public el: ElementRef, public renderer: Renderer2) {}
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
  format(val:string) {
    const numberFormat = val.replace(/[^0-9\.]+/g, '');
    this.renderer.setProperty(this.el.nativeElement, 'value', numberFormat);
  }
}