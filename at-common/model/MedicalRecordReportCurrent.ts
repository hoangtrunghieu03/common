import { MEDICAL_SERVICE_TYPE } from "./enum";
export default class MedicalRecordReportCurrent {
  customerId: string = null; // ID bệnh nhân
  customerCode: string = null; // Mã bệnh nhân
  fullName: string = null;// Họ tên
  tel: string = null;// Số điện thoại
  address: string = null;// Địa chỉ
  birthday: Date = null;// Sinh nhật
  serviceType: string = MEDICAL_SERVICE_TYPE.GENERAL;// loại dịch vụ khách hàng chọn 
  currentRoom: string = null;// phòng hiện tại
  fromRoom: string = null;//chuyển từ phòng 
  fromRoomName: string = null;// Tên phòng chuyển đến
  medicalServiceName: string = null; //Tên thủ thuật dịch vụ thực hiện (Hiển thị với phòng tiểu phẫu)
  medicalServiceStaff: string = null; //Kỹ thuật viên thực hiện dịch vụ thực hiện
  medicalIndicateStaff: string = null;// Kỹ thuật viên thực hiện dịch vụ chỉ định
  indicater: string = null;// Người chỉ định dịch vụ chỉ định thực hiện
  medicalRecordId: string = null; //Mã hồ sơ bệnh án
  statusMedical: string = null; // Trạng thái hồ sơ bệnh án
  roomStatus: string = null; // Trạng thái ở phòng khám của hồ sơ bệnh án
  stt: string = null;// Số thứ tự bệnh nhân
  inDebt: string = null; //Nợ
  chairStatus: string = null;// Trang thai ghe
  chairName: string = null;// Tên ghế
  medicalRecordCode: string = null; // Mã hồ sơ bệnh án
  treatmentNote: string = null; // Noi dung ghi chu
}