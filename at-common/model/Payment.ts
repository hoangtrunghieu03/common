import { UNIT } from "./enum";
/** THÔNG TIN THANH TOÁN */
export default class Payment {
  public medicalServiceMoney: number = 0;// tiền sử dụng dịch vu
  public medicalServiceIndicateMoney: number = 0;// tiền sử dụng dịch vu chỉ định
  public moneyPaymented: number = 0;// tiền đã thanh toán
  public totalMoney: number = 0;// tổng tiền
  public moneyPayment: number = 0;// tiền cần thanh toán
  public discountAmount: number = 0;// Số tiền giảm giá
  public discountUnit: string = UNIT.PRICE; // Loại giảm giá
  public discountValue: number = 0; // Giá trị giảm giá
}