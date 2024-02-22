import { MEDICAL_SERVICE_TYPE, SEX_TYPE, MEDICAL_SERVICE_STATUS, PAYMENT_STATUS } from "./enum";
export default class CustomerCriterial {
    examinationDateFrom: string = null; // Ngày khám
    examinationDateTo: string = null; // Ngày khám
    createDateFrom: string = null; // Ngày tạo hồ sơ (ngày khám đầu tiên)
    createDateTo: string = null; // Ngày tạo hồ sơ (ngày khám đầu tiên)
    birthDayFrom: string = null; // Ngày sinh
    birthDayTo: string = null; // Ngày sinh
    medical_service_type: string = null // Loại dịch vụ
    currentRoom: string = null; //Phòng hiện tại
    fromRoom: string = null; // Phòng chuyển đến 
    name: string = null;
    sex: string = null; // Giới tính
    statusMedical:string = null; // Trạng thái
    roomStatus : string = null; // Trạng thái phòng chờ
    // serviceRequest : string = null; // Chi dinh thuc hien
    statusPayment: string = null; //
    examinationFlag: boolean = null;//
    chairStatus: string = null; // Trạng thái ghế
}