import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';

import { filter } from 'rxjs/operators';
import { map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs;
  public title: string;
  
  customerId:string = '';
  customerName: string = '';

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(filter(route => route.outlet === PRIMARY_OUTLET))
      .subscribe(route => {
        
        let snapshot = this.router.routerState.snapshot;
        let title = route.snapshot.data['title'];
        let parent = route.parent.snapshot.data['breadcrumb'];
        let paren_one = route.snapshot.data['breadcrumb_one']; 
        let paren_two = route.snapshot.data['breadcrumb_two'];
        let paren_three = route.snapshot.data['breadcrumb_three'];
        let child = route.snapshot.data['breadcrumb'];        
        this.breadcrumbs = {};
        this.title = title;
        this.breadcrumbs = {
          "parentBreadcrumb": parent,
          "parent_oneBreadcrumb": paren_one,
          "parent_towBreadcrumb": paren_two,
          "parent_threeBreadcrumb": paren_three,
          "childBreadcrumb": child
        }
      });
  }

  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(param => {
      if(param!=null && param.id!=null){
        this.customerId = param.id;
        this.customerName = param.name
      }else {
        this.customerName = '';
      }
    })
   }

  ngOnDestroy() { }

}
