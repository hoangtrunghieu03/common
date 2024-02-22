import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'at-input-delay-search',
  templateUrl: './input-delay-search.component.html',
  styleUrls: ['./input-delay-search.component.scss'],
})
export class InputDelaySearchComponent implements OnInit {

  private subject = new Subject<string | any>();
  @Output() inputEmitter = this.subject.pipe(
    debounceTime(500)
  );
  @Output() clearTextSearchEmitter: EventEmitter<any> = new EventEmitter();
  @Input() textPlaceHolder:string = 'Tìm kiếm';
  @Input() textSearch: string;

  ngOnInit() {
  }

  onKeyUp(event) {
    let valueCheck = event.target.value.slice(-1);
    if(valueCheck.search(/[^a-zA-Z0-9]+/)){
      if(event.target.value.search(/[^a-zA-Z0-9]+/)) {
        let val = event.target.value?.replace(/\s+/g,' ')
        this.textSearch = val;
        this.subject.next(val);
      }
    }
  }

  removeText(){
    this.textSearch = '';
    this.subject.next(this.textSearch);
    this.clearTextSearchEmitter.emit();
  }

  ngOnDestroy(): void {
  }

}
