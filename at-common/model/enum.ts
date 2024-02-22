export enum SEX_TYPE {
    MALE = 'Nam',
    FEMALE = 'Nữ'
}

export enum SCHEDULE_STATUS {
    NOTYETARRIVED = 'Chưa đến',
    ARRIVED = 'Đã đến',
    NOTARRIVE = 'Không đến'
}

/** dịch vụ khách hàng chọn */
export enum MEDICAL_SERVICE_TYPE {
    BRACES = 'Niềng răng',
    GENERAL = 'Tổng quát',
    IMPLANT = 'Implant'
}
/** */
export enum MEDICAL_SERVICE_STATUS {
    IN_PROGRESS = 'Đang điều trị',
    SEE_AGAIN = 'Hẹn tái khám',
    FINISH = 'Hoàn thành'
}
export enum OPERATOR_SERVICE_STATUS {
    NOT_FINISH = 'Chưa thực hiện',
    FINISH = 'Đã thực hiện',
}
/** */
export enum ROOM_STATUS {
    WAITING = 'Đang đợi',
    OPERATOR = 'Đang thực hiện',
    WAIT_FOR_PAYMENT = 'Chờ thanh toán',
    SEE_YOU = 'Đã về'
}
export enum ANGLE_POSITION {
    RIGHT = 'Bên phải',
    LEFT = 'Bên trái'
}
export enum ANGLE_TOOTH {
    MOLAR = 'Răng cối',
    FANG = 'Răng Nanh'
}
export enum ANGLE_TYPE {
    CLASS_ONE = 'Hạng I',
    CLASS_TWO = 'Hạng II',
    CLASS_THREE = 'Hạng III'
}
export enum CHAIR_STATUS {
    TODO = 'Đang đợi chỉ định',
    IN_PROGRESS = 'Đang tiến hành',
    IN_TEST = 'Đợi kiểm tra',
    AVAILABLE = 'Có thể sử dụng' ,
    WAIT = "Chờ vào ghế",
    FINISH = "Hoàn thành ghế",
    WAITING_PROCESS = 'Đợi thực hiện',
}

export enum NOTIFICATION_ACTION {
    TRANFER_ROOM = 'Chuyển phòng',
    CHAIR_STATUS = 'Trạng thái ghế',
    APPOINTMENT = 'Lịch hẹn'
}

export enum PRICE_TYPE {
    FIX = 'Cố định',
    ADJUST = 'Điều chỉnh'
}


export enum ADJUST_WAREHORSE_REASON {
    INPUT = 'Nhập hàng',
    EXPORT = 'Xuất kho',
    ADJUST = 'Điều chỉnh kho',
    COMSUME = 'Tiêu hao'
}

/** */
export enum MEDICAL_RECORD_IMAGE_TYPE {
    IMAGEGENERALS = 'hinh-anh-chung',    
    IMAGESMILE = 'hinh-anh-cuoi', // chứa hình ảnh cười
    IMAGESTRAIGHTINCLINED = 'hinh-anh-thang-nghieng', // chứa hình ảnh thẳng nghiêng
    XRAYGENERALS = 'xquang-chung', // chứa hình ảnh xquang chung
    XRAYTILTEDSKULL = 'xquang-so-nghieng', // chứa hình ảnh xquang sọ nghiêng
    XRAYSTRAIGHTSKULL = 'xquang-so-thang', // chứa hình ảnh xquang sọ thẳng
    XRAYCT = 'xquang-ct', // chứa hình ảnh xquang CT
    XRAYHAND = 'xquang-ban-tay', // chứa hình ảnh xquang bàn tay 
}
export enum MEDICAL_RECORD_COMMITMENT_TYPE {
    COMMITMENTBARACES = 'cam-ket-nieng-rang',    // Chứa file pdf bản cam kết niềng răng
    COMMITMENTSURGERY = 'cam-ket-phau-thuat',    // Chứa file pdf bản cam kết phẫu thuật
}

export enum DELIVERY_NOTES_TYPE {
    RECEIPT = 'PHIEU-NHAN',    // Chứa file image phiếu nhận
    DELIVERY_NOTES = 'PHIEU-GIAO',    // Chứa file image phiếu giao
}
export enum PAYMENT_STATUS {
    PAYMENTED = 'Đã thanh toán',    // PAYMENTED
    PAYMENT_PARTICIPAL = 'Thanh toán một phần',   // PAYMENT_PARTICIPAL
    NOT_PAYMENTED = 'Chưa thanh toán' , //NOT_PAYMENTED
    CANCEL = "Hủy thanh toán"
}
export enum PAYMENT_METHOD {
    BANK_TRANFER = 'Chuyển khoản',//Chuyển khoản 
    CASH = 'Tiền mặt',//Tiền mặt       
}
export enum IMG_TYPE {
    IMAGE = "HINH_ANH",
    CUSTOMER_INFO = 'BAN_TU_KHAI',
    COMMITMENT = 'BAN_CAM_KET',
    DELIVERY_NOTES = 'PHIEU_GIAO_NHAN',
    LOGO = 'LOGO'
}
export enum UNIT {
    PERCENT = '%',  //Phần trăm
    PRICE = 'VND' //Số tiền
}
export enum SERVICE_REQUEST {
    RECEPTION = 'Tiếp nhận',
    TREATMENT_PROCESS = 'Quy trình điều trị'
}
export enum TYPE_SCHEDULE {
    REEXAMINATION = "Tái khám",
    ORTHER = "Khác",
    ARCMAKING = "Làm cung"
}
export enum SETTING_PRINT {
    NAME = "Tên",
    EMAIL = "Email",
    LOGO = "Logo",
    ADDRESS = "Địa chỉ",
    TEL = "Số điện thoại",
    WEBSITE = "Website",
    FOOTERINFO = "Thông tin chân trang"
}
export enum SETTING_TYPE {
    PRINT = "Phiếu in",
    ZALO_TEMPLATE = "Mẫu thông báo zalo"
}
export enum SETTING_NAME {
    ZALO_TEMP_1 = "Thông báo lịch hẹn",
    ZALO_TEMP_2 = "Thông báo lịch hẹn kèm nợ",
    ZALO_TEMP_3 = "Thông báo thanh toán nợ",
}
export enum DELIVERYNOTE_TYPE {
    RECEIPT_LABO = "Nhận dấu",
    RECEIPT_ARC = "Nhận cung",
    DELIVERY_LABO = "Giao dấu"
}
export enum ARCMAKING_STATUS {
    NOTYET = "Chưa",
    DONE = "Xong",
    DELIVERED = "Đã giao"
}
export enum TYPE_SERVICEINDICATE {
    CAPTUREIMAGE = "Chụp hình",
    ARCMAKING = "Làm cung"
}
export enum TYPE_URL_ZALO {
    PERMISSION = "permission",
    ACCESS_TOKEN = "access_token"
}

export * from './enum';
