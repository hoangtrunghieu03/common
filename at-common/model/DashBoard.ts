import BaseEntity from "../base/BaseEntity";
import DashBoardChartData from "./DashBoardChartData";
import DashBoardCustomer from "./DashBoardCustomer";
import DashBoardMedicalService from "./DashBoardMedicalService";
import DashBoardRevenueDay from "./DashBoardRevenueDay";

/** THÔNG TIN TỔNG QUAN */
export default class DashBoard extends BaseEntity<DashBoard> {
  revenueDays: DashBoardRevenueDay = null;// doanh thu theo ngày giờ
  customers: DashBoardCustomer = null;// thông tin khách hàng
  medicalServices: Array<DashBoardMedicalService> = null;// thông tin sử dụng dịch vụ
  chairs: Array<DashBoardChartData> = null;// trạng thái ghế
  constructor() {
    super();
    this.medicalServices = new Array<DashBoardMedicalService>();
    this.chairs = new Array<DashBoardChartData>();
  }
  

  public assign(obj: any) {
    this._id = obj._id;
    this.revenueDays = obj.hasOwnProperty("revenueDays") ? obj.revenueDays : this.revenueDays;
    this.customers = obj.hasOwnProperty("customers") ? obj.customers : this.customers;
    this.medicalServices = obj.hasOwnProperty("medicalServices") ? obj.medicalServices : this.medicalServices;
    this.chairs = obj.hasOwnProperty("chairs") ? obj.chairs : this.chairs;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): DashBoard {
    let result = new DashBoard();
    return result;
  }
}