export default class MedicalSupplyCriterial {
    origin: string = null; // Nguồn gốc
    mfgDateFrom: string = null;// Ngày sản xuất 
    mfgDateTo: string = null;// Ngày sản xuất 
    expDateFrom: string = null; //Hạn sử dụng
    expDateTo: string = null; // Hạn sử dụng
    name: string = null;
    roomId: string = null;
    expBeforeDate: string = null;
    expAfterDate: string = null;
    alertSupply: boolean = false;
}