/** THÔNG TIN BÁO CÁO DOANH THU TỔNG QUÁT */
export default class ReportRevenueGeneral {
  public examinationDate: string = null;// ngày khám bệnh
  public totalCustomer: number = 0;// tổng số bệnh nhân
  public revenue: number = 0;// doanh thu
  public debt: number = 0;// nợ
  public income: number = 0;// đã thu
  public discountCurrent: number = 0; // Giam gia
  public id: string = null;
}