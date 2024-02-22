export default class CustomerSchedule {
    public phone: string = null;
    public customer_name : string = null; 
    public company_address : string = null;
    public date_schedule: string = null; // Ngày hẹn: vd:10/10/2022
    public day_schedule: string = null; // Ngày hẹn: VD: Thứ 3
    public contentSchedule: string = null; // Nội dung lịch hẹn
    public schedule_code: string = null; // Mã bệnh nhân có lịch hẹn
    public moneyPayment: number = 0; // Số tiền còn nợ
}