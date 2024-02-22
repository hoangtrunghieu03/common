export default class MedicalRecordCriterial {
    examinationDateFrom: string = null; // Ngày khám
    examinationDateTo: string = null; // Ngày khám
    currentRoom: string = null; //Phòng hiện tại
    fromRoom: string = null; // Phòng chuyển đến 
    name: string = null;
    statusMedical:string = null; // Trạng thái
    roomStatus : string = null; // Trạng thái phòng chờ
    examinationFlag: boolean = null;//
    chairStatus: string = null; // Trạng thái ghế
}