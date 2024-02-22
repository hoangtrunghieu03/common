import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'at-card',
  templateUrl: './at-card.component.html',
  styleUrls: ['./at-card.component.scss']
})
export class AtCardComponent implements OnInit {

  @Input() cardClass: string;
  @Input() headerClass: string;
  @Input() bodyClass: string;
  constructor() { }

  ngOnInit(): void {
  }

}
