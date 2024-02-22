/** MỤC TIÊU VÀ KẾ HOẠCH ĐIỀU TRỊ*/
export default class BraceExaminationPlan {
    public treatmentGoals: string = '';//Mục tiêu điều trị
    public chewingtrough: boolean = false;//Máng nhai
    public instruments: boolean = false;//Khí cụ chức năng
    public fixedInstrument: Array<string> = null; //Khí cụ cố định: Mắc cài kim loại/Mắc cài sứ/Mắc cài mặt lưỡi
    public surgeryASO: Array<string> = null;//Phẩu thuật:ASO:Hàm trên/Hàm dưới/Hai hàm
    public surgeryBSSO: boolean = false;//Phẩu thuật:BSSO
    public surgeryLefort: boolean = false;//Phẩu thuật:Lefort
    public surgeryCorticotomy: boolean = false;//Phẩu thuật:Corticotomy
    public surgeryChinPlastic: boolean = false;//Phẩu thuật tạo hình cằm
    public noSurgery: Array<string> = null;//Không Phẩu thuật:Nhổ răng/Không nhổ răng
    public note: string = '';//ghi chú
    public bracesType: Array<string> = null;// Loại mắc cài:Kim loại/Sứ/Mặt lưỡi
}