import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'at-tooth-diagram',
  templateUrl: './at-tooth-diagram.component.html',
  styleUrls: ['./at-tooth-diagram.component.scss']
})
export class AtToothDiagramComponent implements OnInit {

  subject = new Subject();
  @Input() tooth: number[]=[];
  @Input() disableTooth: boolean = false;
  @Output() selectedTooth$ = this.subject;
  toothSelected: number[]
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.toothSelected = _.cloneDeep(!this.tooth ? [] : this.tooth)
  }

  onCheckNumber = (num:number, rowInd:number, colInd:number):void => {
    if (this.disableTooth) return;
    let indexOfNum: number = this.toothSelected?.findIndex(val => val === Number(num+''+rowInd+''+colInd))
    if ( indexOfNum > -1 ) {
      this.toothSelected?.splice(indexOfNum ,1)
    } else {
      this.toothSelected?.push(Number(num+''+rowInd+''+colInd))
    }
    this.subject.next(this.toothSelected);
  }

  checkIncludeNum = (num, rowInd, colInd):boolean => {
    return this.toothSelected?.some(val => val === Number(num+''+rowInd+''+colInd))
  }

  handleRenderData = (key: boolean): Array<number> => {
    return key ? [1,2,3,4,5,6,7,8] : [1,2,3,4,5,6,7,8].reverse();
  }
}
