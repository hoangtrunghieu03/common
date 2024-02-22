
/** THÔNG TIN CHI TIẾT SỬ DỤNG VẬT TƯ TIÊU HAO */
export default class ReportSupplyRoomDetail {
  medicalRecordId: string = null; //Id hồ sơ bệnh án
  medicalRecordCode: string = null; //mã hồ sơ bệnh án
  customerCode: string = null; //mã bệnh nhân
  customerName: string = null; //tên bệnh nhân
  dateUse: Date = null; // Ngày sử dụng vật tư
  qtyUse: number = 0;// Số lượng đã dùng
}