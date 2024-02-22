import {Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';

@Directive({selector: '[ngbDropdownMenu][matchWidth]'})
export class MatchWidthDirective implements OnDestroy {

  private subscription: Subscription;

  @Input() matchWidth: HTMLElement;

  constructor(private dropdown: NgbDropdown, private elementRef: ElementRef) {
    this.subscription = dropdown.openChange.subscribe(opened => {
      if (opened && this.matchWidth) {
        this.elementRef.nativeElement.style.width = `${this.matchWidth.clientWidth}px`;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
