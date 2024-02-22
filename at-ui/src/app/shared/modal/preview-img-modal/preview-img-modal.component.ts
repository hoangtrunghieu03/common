import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'at-preview-img-modal',
  templateUrl: './preview-img-modal.component.html',
  styleUrls: ['./preview-img-modal.component.scss']
})
export class PreviewImgModalComponent implements OnInit {

  img: string | undefined;
  @Input() pictureAction: { delete?: boolean, download?: boolean };

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
