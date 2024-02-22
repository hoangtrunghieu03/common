import BaseEntity from "../base/BaseEntity";
import DashBoardChartData from "./DashBoardChartData";
import ReportRevenueCriterial from "./ReportRevenueCriterial";
import ReportRevenueGeneral from "./ReportRevenueGeneral";
import ReportRevenueGeneralDetail from "./ReportRevenueGeneralDetail";
import ReportRevenueStaffDetail from "./ReportRevenueStaffDetail";

/** BÁO CÁO DOANH THU */
export default class ReportRevenue extends BaseEntity<ReportRevenue> {
  filter : ReportRevenueCriterial = null;
  general: Array<ReportRevenueGeneral> = null;// doanh thu tổng quát
  generalDetails: Array<ReportRevenueGeneralDetail> = null;// doanh thu chi tiết tổng quát
  staffs: Array<DashBoardChartData> = null;// doanh thu bởi nhân viên
  services: Array<DashBoardChartData> = null;// doanh thu bởi dịch vu
  staffDetails:Array<ReportRevenueStaffDetail> = null;// doanh thu chi tiết của nhân viên
  rooms: Array<DashBoardChartData> = null;//doanh thu theo phong
  constructor() {
    super();
    this.general = new Array<ReportRevenueGeneral>();
    this.generalDetails = new Array<ReportRevenueGeneralDetail>();
    this.staffs = new Array<DashBoardChartData>();
    this.services = new Array<DashBoardChartData>();
    this.rooms = new Array<DashBoardChartData>();
    this.staffDetails = new Array<ReportRevenueStaffDetail>();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.filter = obj.hasOwnProperty("filter") ? obj.filter : this.filter;
    this.general = obj.hasOwnProperty("general") ? obj.general : this.general;
    this.generalDetails = obj.hasOwnProperty("generalDetails") ? obj.generalDetails : this.generalDetails;
    this.staffs = obj.hasOwnProperty("staffs") ? obj.staffs : this.staffs;
    this.staffDetails = obj.hasOwnProperty("staffDetails") ? obj.staffDetails : this.staffDetails;
    this.services = obj.hasOwnProperty("services") ? obj.services : this.services;
    this.rooms = obj.hasOwnProperty("rooms") ? obj.rooms : this.rooms;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): ReportRevenue {
    let result = new ReportRevenue();
    return result;
  }
}