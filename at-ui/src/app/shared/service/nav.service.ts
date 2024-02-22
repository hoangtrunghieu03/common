import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { WINDOW } from "./windows.service";
// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
	classes?: string;
	hide?: boolean;
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	public screenWidth: any
	public collapseSidebar: boolean = false;

	constructor(@Inject(WINDOW) private window) {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}
	}

	// Windows width
	@HostListener("window:resize", ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			path: '/tong-quan', title: 'Tổng quan', icon: 'airplay', type: 'link', badgeType: 'primary', active: false
		},
		{
			path: '/tiep-nhan', title: 'Tiếp nhận', icon: 'edit', type: 'link', badgeType: 'primary', active: false, classes: 'hide_lt-md'
		},
		{
			title: 'Khám bệnh', icon: 'headphones', type: 'sub', active: false, classes: 'hide_lt-md', children:[
				{ path: '/kham-benh/phong-tiep-tan', title: 'Phòng tiếp tân', type: 'link' },
				{ path: '/kham-benh/phong-tong-quat', title: 'Phòng tổng quát', type: 'link' },
				{ path: '/kham-benh/phong-chi-dinh', title: 'Phòng chỉ định', type: 'link' },
				{ path: '/kham-benh/phong-nieng-rang', title: 'Phòng niềng răng', type: 'link' },
				{ path: '/kham-benh/phong-tieu-phau', title: 'Phòng tiểu phẫu', type: 'link' },
				{ path: '/kham-benh/phong-cay-implant', title: 'Phòng cấy implant', type: 'link' },
			]
		},
		{
			path: '/benh-an', title: 'Hồ sơ bệnh án', icon: 'book-open', type: 'link', badgeType: 'primary', active: false, classes: 'hide_lt-md'
		},
		{
			path: '/lich-hen', title: 'Lịch hẹn', icon: 'calendar', type: 'link', badgeType: 'primary', active: false
		},
		{
			path: '/nhan-vien', title: 'Nhân viên', icon: 'user', type: 'link', badgeType: 'primary', active: false
		},
		{
			path: '/quan-ly-ghe', title: 'Quản lý ghế', icon: 'grid', type: 'link', badgeType: 'primary', active: false
		},
		{
			title: 'Quản lý kho', icon: 'package', type: 'sub', badgeType: 'primary', active: false, children: [
				{ path: '/ton-kho/vat-dung', title: 'Vật dụng tiêu hao', type: 'link' },
				{ path: '/ton-kho/thiet-bi', title: 'Trang thiết bị', type: 'link' },
				{ path: '/ton-kho/lich-su-xuat', title: 'Lịch sử xuất', type: 'link' },
				{ path: '/ton-kho/lich-su-nhap', title: 'Lịch sử nhập', type: 'link' },
				{ path: '/ton-kho/lich-su-tieu-hao', title: 'Lịch sử tiêu hao', type: 'link' },
				{ path: '/ton-kho/lich-su-dieu-chinh', title: 'Lịch sử điều chỉnh', type: 'link' },
				{ path: '/ton-kho/lich-su-giao-nhan', title: 'Lịch sử phiếu giao nhận', type: 'link' },
			]
		},
		{
			title: 'Báo cáo', icon: 'bar-chart-2', type: 'sub', badgeType: 'primary', active: false, children: [
				{ path: '/bao-cao/doanh-thu', title: 'Báo cáo doanh thu', type: 'sub', children: [
					{ path: '/bao-cao/doanh-thu/tong-quan', title: 'Doanh thu tổng quan', type: 'link' },
					{ path: '/bao-cao/doanh-thu/dich-vu', title: 'Báo cáo dịch vụ', type: 'link' },
					{ path: '/bao-cao/doanh-thu/phong', title: 'Doanh thu theo phòng', type: 'link' }
					]
				},
				{ path: '/bao-cao/nhan-vien', title: 'Báo cáo nhân viên', type: 'link' },
				{ path: '/bao-cao/hang-ton', title: 'Báo cáo hàng tồn', type: 'sub', children: [
					{ path: '/bao-cao/hang-ton/tong-kho', title: 'Hàng tồn tổng kho', type: 'link' }, // group: 'Báo cáo' , groupOrder: '50'
					{ path: '/bao-cao/hang-ton/theo-phong', title: 'Hàng tồn theo phòng', type: 'link' }, // group: 'Báo cáo' , groupOrder: '51'
					] }
			]
		},
		{
			title: 'Cài đặt', icon: 'settings', type: 'sub', active: false, children: [
				{ path: '/cai-dat/dich-vu', title: 'Dịch vụ', type: 'link' },
				{ path: '/cai-dat/combo-chi-dinh', title: 'Combo chỉ định', type: 'link' },
				{ path: '/cai-dat/chi-dinh', title: 'Chỉ định', type: 'link' },
				{ path: '/cai-dat/phan-quyen', title: 'Phân quyền', type: 'link' },
				{ path: '/cai-dat/phieu-in', title: 'Phiếu in', type: 'link' },
        { path: '/cai-dat/zalo', title: 'Zalo', type: 'link' }
			]
		}
	]

	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

}
