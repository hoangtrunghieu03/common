import {MEDICAL_SERVICE_TYPE} from '../model/enum'
export default class MedicalRecordData {
    date: Date = null; //Ngày khám
    medicalRecordId: string = null; // Id hồ sơ bệnh án
    medicalRecordExaminationType: string = null; // loại khám hồ sơ bệnh án (Tổng quát/Implant/Niềng răng)
    medicalRecordCode: string = null; // Mã bệnh án
    medicalRecordName: string = MEDICAL_SERVICE_TYPE.BRACES; //
    note: string = null; // Ghi chú
    staffName: string = null; // Bác sĩ thực hiện
    status: string = null; // Trạng thái
    chairId: string = null; //Id ghế
}