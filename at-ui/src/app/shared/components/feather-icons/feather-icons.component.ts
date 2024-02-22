import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import * as feather from 'feather-icons';

@Component({
  selector: 'at-feather-icons',
  templateUrl: './feather-icons.component.html',
  styleUrls: ['./feather-icons.component.scss']
})
export class FeatherIconsComponent implements OnInit {

  @Input('icon') public icon;

  @Input() color: string;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
      feather.replace();
      this.cd.markForCheck();
    });
  }

}
