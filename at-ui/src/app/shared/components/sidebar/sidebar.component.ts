import { Component, ViewEncapsulation } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/entities/state.entity';
import Role from '../../../../../../at-common/model/Role';
import Staffs from '../../../../../../at-common/model/Staffs';
import { DestroySubsribeService } from '../../service/destroySubscribe.service';
import { Menu, NavService } from '../../service/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [DestroySubsribeService],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

  public menuItems: Menu[];
  public url: any;
  public fileurl: any;
  public staff: Staffs;
  public role: Role;

  constructor(private router: Router,
    public navServices: NavService,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService) {
    this.navServices.items.subscribe(menuItems => {
      this.menuItems = menuItems
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let url = this.removeStringSpecial(event.url);
          menuItems.filter(items => {
            if (items.path === url)
              this.setNavActive(items)
            if (!items.children) return false
            items.children.filter(subItems => {
              if (subItems.path === url)
                this.setNavActive(subItems)
              if (!subItems.children) return false
              subItems.children.filter(subSubItems => {
                if (subSubItems.path === url)
                  this.setNavActive(subSubItems)
              })
            })
          })
        }
      })
    })
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel))
      .subscribe((val) => {
        this.selectSidebar(this.router.url)
      });

      this.onLoadStaffLogin();
  }

  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem != item)
        menuItem.active = false
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true
            submenuItems.active = true
          }
        })
      }
    })
  }

  onLoadStaffLogin = () => {
    this.store.select(state => state.staff.staffLogin)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((staff: Staffs) => {
        if (!staff) return;
        this.staff = staff;
        this.onLoadMenuItems();
      })
  }

  onLoadMenuItems = () => {
    this.store.select(state => state.role.roleStaffLogin)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((role: Role) => {
        if (!role) return;
        this.role = role;

        this.menuItems.filter(items => {
          if (!items.children) return items.hide = this.onCheckHideMenuItem(items.title, items.type, items);
          items.hide = this.onCheckHideMenuItem(items.title, items.type, items);
          items?.children.filter(subItems => {
            if (!subItems.children) return subItems.hide = this.onCheckHideMenuItem(items.title, subItems.type, subItems);
            subItems.hide = this.onCheckHideMenuItem(items.title, subItems.type, subItems);
            subItems?.children.filter(subSubItems => {
              return subSubItems.hide = this.onCheckHideMenuItem(items.title, subSubItems.type, subSubItems);
            })
          })
        })
      })
  }

  onCheckHideMenuItem = (group: string, type: string, item: Menu) => {
    if (!this.role) return false;

    let dataAccess: Array<any> = this.role.dataAccesses;
    dataAccess = dataAccess.concat(this.staff.dataAccessNameExtends);
    return dataAccess?.some(data => data.group.toLocaleLowerCase() == group.toLocaleLowerCase() &&
      (type != 'sub' ? data.dataAccessName.toLocaleLowerCase() == item.title.toLocaleLowerCase() :
        item.children.some(dataSub => dataSub.type != 'sub' ? dataSub.title.toLocaleLowerCase() == data.dataAccessName.toLocaleLowerCase() :
          dataSub.children.some(dataSubSub => dataSubSub.title.toLocaleLowerCase() == data.dataAccessName.toLocaleLowerCase())
        )));
  }

  // Click Toggle menu
  toggletNavActive(item) {
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item))
          a.active = false
        if (!a.children) return false
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false
          }
        })
      });
    }
    item.active = !item.active
  }

  selectSidebar(value) {
    this.onCheckHiddenMenu();
    let el = value.split('/')[1];
    let el_child = value.split('/')[2];
    for (const nav of this.menuItems) {
      if (nav.type === 'sub') {
        if (nav.children[0].type !== 'sub') {
          if (nav.children[0].path.includes(el)) {
            if (!nav.active) return this.toggletNavActive(nav);
            else return
          }
        } else {
          for (const child of nav.children) {
            if (child.children && child.children[0]?.path?.includes(el_child)) {
              if (!nav.active) this.toggletNavActive(nav);
              if (!child.active) this.toggletNavActive(child);
              return
            }
          }
        }
      } else {
        if (nav.path.includes(el)) {
          if (!nav.active) return this.toggletNavActive(nav);
          else return
        }
      }
    }
  }

  onCheckHiddenMenu = () => {
    if(!this.navServices.collapseSidebar && window.innerWidth < 1200){
      this.navServices.collapseSidebar = true
    }
  }

  //Fileupload
  readUrl(event: any) {
    if (event.target.files.length === 0)
      return;
    //Image upload validation
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    }
  }

  removeStringSpecial(text: string) {
    let str
    str = text.substr(0, text.indexOf('?'));
    return str;
  }

}
