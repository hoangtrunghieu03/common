
/** THÔNG TIN KHO */
export default class ReportSupplyRoom {
  public supplyId: string = null;// id vat tu
  public name: string = null;// tên vật tư
  public quantity: number = 0; //Số lượng còn lại hiện tại
  public quantityImport: number = 0;// số lượng đầu kì
  public quantityRemain: number = 0;// số lượng cuối kỳ 
  public quantityUse: number = 0;// số lượng đã dùng
  public unit: string = null;// đơn vị
  public dateImport: Date = null; //Ngày nhập
}