import BraceExaminationDiagnostic from "./BraceExaminationDiagnostic";

/**  Khám chức năng và cận chức năng */
export default class BraceExaminationFuntional {
    public temporomandibularJointAboveStraight: boolean = false;// Khớp thái dương hàm Hướng đóng mở hàm dưới Thẳng
    public temporomandibularJointAboveDeviated: Array<string> = null;// Khớp thái dương hàm Hướng đóng mở hàm dưới Lệch Trái/Lệch Phải
    public temporomandibularJointAboveZigzag: boolean = false;// Khớp thái dương hàm Hướng đóng mở hàm dưới Dích dắc
    public temporomandibularJointSideNormal: boolean = false;// Khớp thái dương Cử động hàm dưới sang bên Bình thường
    public temporomandibularJointSideLimit: Array<string> = null;// Khớp thái dương Cử động hàm dưới sang bên Hạn chế Trái/Hạn chế Phải
    public temporomandibularJointNoise: boolean = false;  //Khớp thái dương  có tiếng kêu
    public temporomandibularJointPain: boolean = false;  //Khớp thái dương  Đau
    public closedlips: string = null; //Hai môi khép kín: Thư giản/Không thư giản
    public noClosedlips: boolean = false; //Hai môi Không khép kín
    public lipMuscleCompulsion: string = null; //Tính cưỡng cơ môi:  Bình thường/Thiểu năng/Cương cơ (môi ngắn)
    public lipLowGrip: string = null; //Thắng môi bám thấp Hàm trên/Hàm dưới/Không có
    public tongue: string = null; //Lưỡi Lưỡi lớn/Lười để thấp/Lưỡi đẩy
    public amydal: string = null; //Amydal Bình thường/Kích thước lớn, có vấn đề
    public teethingForm: string = null;//Dạng mọc răng Bình thường/Sớm/Trễ
    public habit: string = null;//Thói quen Cắn môi/Mút tay/Thở miệng/Chống cằm hoặc chống tay lên mặt/Thói quen khác
    public dentalHygiene: string = null;//vệ sinh răng miệng Tốt/Khá/Trung Bình/Kém
}
