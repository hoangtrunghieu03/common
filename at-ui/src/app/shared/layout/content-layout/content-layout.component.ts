import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavService } from '../../service/nav.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce, zoomOut, zoomIn, fadeIn, bounceIn } from 'ng-animate';
import { ProgressBarService } from '../../service/progress-bar.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  animations: [
    trigger('animateRoute', [transition('* => *', useAnimation(fadeIn, {
      // Set the duration to 5seconds and delay to 2 seconds
      //params: { timing: 3}
    }))])
  ]
})
export class ContentLayoutComponent implements OnInit {

  public right_side_bar: boolean;
  public layoutType: string = 'RTL';
  public layoutClass: boolean = false;
  isLoading: boolean = false;

  constructor(
    public navServices: NavService, 
    private cd: ChangeDetectorRef,
    public progressBarService: ProgressBarService,
    )    
   { }

  ngDoCheck(): void {
    if (this.isLoading !== this.progressBarService.progress) {
      this.isLoading = this.progressBarService.progress
      this.cd.detectChanges;
    }
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  public rightSidebar($event) {
    this.right_side_bar = $event;
  }

  public headerCollap(event) {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      this.cd.detectChanges(); 
    }, 250);  
  }

  public clickRtl(val) {
    if (val === 'RTL') {
      document.body.className = 'rtl';
      this.layoutClass = true;
      this.layoutType = 'LTR';
    } else {
      document.body.className = '';
      this.layoutClass = false;
      this.layoutType = 'RTL';
    }
  }

  closeSidebar(){
    // this.navServices.collapseSidebar = true;
    
  }

  ngOnInit() { }

}
