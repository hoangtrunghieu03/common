import DashBoardChartData from "./DashBoardChartData";

/** THÔNG TIN KHÁCH HÀNG */
export default class DashBoardCustomerDetail {
  public room: string = null;// tên phòng
  public customerWaiting: number = 0;// số lượng bệnh nhân chờ
  public customerAction: number = 0;// số lượng bệnh nhân đang khám
  public customerNonePayment: number = 0;// số lượng bệnh nhân chưa thanh thoán
  public customerPaymented: number = 0;// số lượng bệnh nhân đã thanh thoán
  public customerCurrent: number = 0; // bệnh nhân hiện tại
}