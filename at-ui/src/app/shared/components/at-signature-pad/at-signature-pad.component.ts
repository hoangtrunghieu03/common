import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { pairwise, takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'at-signature-pad',
  templateUrl: './at-signature-pad.component.html',
  styleUrls: ['./at-signature-pad.component.scss']
})
export class AtSignaturePadComponent implements OnInit {
  @ViewChild('drawer') public canvas: ElementRef;
  bodyEl: HTMLElement;
  modalEl: HTMLElement;
  canvasEl: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:touchend', ['$event'])
  touchReleaseEventHandler(event: TouchEvent) {
    this.modalEl.style.overflow = 'auto'
  }

  ngAfterViewInit() {
    this.bodyEl = document.getElementsByTagName("BODY")[0] as HTMLElement;
    this.modalEl = document.getElementsByTagName("ngb-modal-window")[0] as HTMLElement;
    this.canvasEl = this.canvas.nativeElement;
    this.context = this.canvasEl.getContext('2d');

    this.context.lineWidth = 1;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';

    this.captureEvents(this.canvasEl);
  }

  captureEvents = (canvasEl: HTMLCanvasElement) => {
    fromEvent(canvasEl, 'touchstart')
      .pipe(
        switchMap((e) => {
          Array.from(document.querySelectorAll('input')).forEach(el => el.blur())
          this.modalEl.style.overflow = 'hidden';
          return fromEvent(canvasEl, 'touchmove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'touchend')),
              // takeUntil(fromEvent(canvasEl, 'mouseleave')),
              pairwise() /* Return the previous and last values as array */
            )
        })
      ).subscribe((res: [TouchEvent, TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].touches[0].clientX - rect.left,
          y: res[0].touches[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].touches[0].clientX - rect.left,
          y: res[1].touches[0].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  drawOnCanvas = (prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) => {
    if (!this.context) { return; }

    this.context.beginPath();

    if (prevPos) {
      this.context.moveTo(prevPos.x, prevPos.y); // from
      this.context.lineTo(currentPos.x, currentPos.y);
      this.context.stroke();
    }
  }

  reFresh = () => {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.context.clearRect(0, 0, canvasEl.width, canvasEl.height)
  }
}
