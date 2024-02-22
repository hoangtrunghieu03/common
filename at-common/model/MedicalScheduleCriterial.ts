import {  SCHEDULE_STATUS } from "./enum";
export default class MedicalServiceCriterial{
    fromDate: string = null; // 
    toDate: string = null;  // Ngày 
    deliveryDateFrom: string = null; // 
    deliveryDateTo: string = null;  // Ngày 
    sampleReceiveDateFrom: string = null;  // Ngày 
    sampleReceiveDateTo: string = null;  // Ngày 
    status: string = SCHEDULE_STATUS.NOTYETARRIVED; // Trạng thái lịch hẹn
    name: string = null; //Search theo Tên, SĐT, Mã bệnh nhân
    typeSchedule: string = null;//Loại lịch hẹn
    executeOutSide: boolean = null;//Loại lịch hẹn
    isConfirm: boolean = null;//Lịch hẹn làm cung đã xác nhận hay chưa
    statusArc: string = null;//Lịch hẹn làm cung đã xác nhận hay chưa
}