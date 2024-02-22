import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { logout } from 'src/app/store/actions/authentication.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { AuthencationEffect } from 'src/app/store/effects/authentication.effect';
import { RootState } from 'src/app/store/entities/state.entity';
import Role from '../../../../../../at-common/model/Role';
import Staffs from '../../../../../../at-common/model/Staffs';
import { DestroySubsribeService } from '../../service/destroySubscribe.service';
import { NavService } from '../../service/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public right_sidebar: boolean = false;
  public open: boolean = false;
  public openNav: boolean = false;
  public isOpenMobile : boolean;
  userLogin = {userName: null, email: null}
  @Output() rightSidebarEvent = new EventEmitter<boolean>();
  @Output() headerCollap = new EventEmitter<boolean>();

  public Employees = [
    {MHSBA: 20220601144811, fullName: 'Trần Đức B', room: 'Tiếp tân', read: false },
    {MHSBA: 20220601144812, fullName: 'Lê Thị C', room: 'Chỉ định', read: false},
    {MHSBA: 20220601144813, fullName: 'Nguyễn Văn D', room: 'Tiểu phẫu', read: false},
    {MHSBA: 20220601144814, fullName: 'Võ Văn H', room: 'Implant', read: false},
    {MHSBA: 20220601144815, fullName: 'Đinh Văn L', room: 'Niềng răng', read: false}
  ]
  constructor(public navServices: NavService,
    private router: Router,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    public authencationEffect: AuthencationEffect,) { }

  collapseSidebar() {
    this.open = !this.open;
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;    
    window.dispatchEvent(new Event('resize'));
    this.headerCollap.emit(true);
  }
  right_side_bar() {
    this.right_sidebar = !this.right_sidebar
    this.rightSidebarEvent.emit(this.right_sidebar)
  }

  openMobileNav() {
    this.openNav = !this.openNav;
  }

  logout():void {
    this.store.dispatch(logout());
  }
  moveToUserProfile(): void{
    this.router.navigate(['/ho-so/thong-tin']);
  }

  ngOnInit() {
    this.store.dispatch(loadStaff());
    this.store
    .select(state => state.authencation._id )
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe( result => {
      if ( !result ) { return }
      this.store
      .select( state => state.staff.staffList )
      .pipe( takeUntil(this.destroy.destroySub$))
      .subscribe( staff => {
        if (!staff) { return }
        let staffItem:Staffs = staff.find( item => item._id === result);
        this.userLogin.userName = staffItem?.fullName;
        this.userLogin.email = staffItem?.email;
      });
    })
  }

  onNavigateHomePage = () => {
    this.store.select(state => state.role.roleStaffLogin)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((role: Role) => {
        if (!role) return;
        this.store.select(state => state.staff.staffLogin)
          .pipe(takeUntil(this.destroy.destroySub$))
          .subscribe((staff: Staffs) => {
            if (!staff) return;
            this.authencationEffect.onActiveMenu(role.dataAccesses, staff.dataAccessNameExtends);
          })
      })
  }
}
