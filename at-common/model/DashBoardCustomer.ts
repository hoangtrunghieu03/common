import DashBoardChartData from "./DashBoardChartData";
import DashBoardCustomerDetail from "./DashBoardCustomerDetail";

/** THÔNG TIN KHÁCH HÀNG */
export default class DashBoardCustomer {
  public customers:Array<DashBoardCustomerDetail> = null;// thông tin bệnh nhân
  public total: number =null;// tổng doanh thu
}