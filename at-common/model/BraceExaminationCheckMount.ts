import AngleRank from "./AngleRank";
import SurfaceEdentulousness from "./SurfaceEdentulousness";
import SurfaceLook from "./SurfaceLook";
import AnalyticPartern from "./AnalyticPartern";

/** KHÁM TRONG MIỆNG*/
export default class BraceExaminationCheckMount {
    // 1. Khám răng
    public toothCheck : Array<string> = [];// khám răng  
    public toothCheckChild : Array<string> = [];// khám răng cho trẻ em
    public toothCheckAbove : Array<string> = null;//  khám răng hàm trên Cân đối,Không cân đối,Chen chúc,Hài hòa,Có răng xoay,Có khoảng trống
    public toothCheckAboveShape : Array<string> = null;//  khám răng hàm trên Hình trứng/Hình vuông/Hình nón/Hình omega
    public toothCheckAboveBackteeth : Array<string> = null;//  khám răng hàm trên Răng sau Thắng/Răng sau Nghiêng trong/Răng sau Nghiêng ngoài
    public toothCheckBellow : Array<string> = null;// khám răng hàm dưới Cân đối,Không cân đối,Chen chúc,Hài hòa,Có răng xoay,Có khoảng trống
    public toothCheckBellowShape : Array<string> = null;// khám răng hàm dưới Hình trứng/Hình vuông/Hình nón/Hình omega,Cân đối,Không cân đối
    public toothCheckBellowBackteeth : Array<string> = null;// khám răng hàm dưới Răng sau Thắng/Răng sau Nghiêng trong/Răng sau Nghiêng ngoài
    public analyticPartern: AnalyticPartern = new AnalyticPartern();//Phân tích mẫu hàm
    // 2.Tương quan hai hàm
    public correlationTeethFrontCoverage: string  =null;//Tương quan hai hàm  Phía trước  Độ cắn phủ Bình thường/Cắn sâu/Cắn hở
    public correlationTeethFrontMedianDuplicate: string  =null;//Tương quan hai hàm Phía trước Đường giữa Trùng nhau: Bên phải/Bên trái/Giữa mặt
    public correlationTeethFrontMedianNoDuplicateAbove: string  =null;//Tương quan hai hàm Phía trước Đường giữa không Trùng nhau Hàm trên:Lệch trái/Lệch phải
    public correlationTeethFrontMedianNoDuplicateBellow: string  =null;//Tương quan hai hàm Phía trước Đường giữa không Trùng nhau Hàm dưới:Lệch trái/Lệch phải
    public correlationTeethFrontBackCover: boolean  = false;//Tương quan hai hàm Phía trước Răng sau Cắn phủ
    public correlationTeethFrontBackCross: string  =null;//Tương quan hai hàm Phía trước Răng sau Cắn chéo Trái/Phải/ Hai bên
    public correlationTeethFrontAlveolarBone : string  =null;//Tương quan hai hàm Phía trước Răng Xương ổ răng hai bên Cân xứng/Không cân xứng
    public correlationTeethSideAngleRank: Array<AngleRank> = [];// Tương quan hai hàm Phía bên
    public correlationTeethSideAlignment: string = null;// Tương quan hai hàm Phía bên Độ căn chìa Bình thường/Cắn chìa/Cắn đối đầu/Cắn chéo
    public correlationTeethSideSpee: string = null;// Tương quan hai hàm Phía bên Spee Phẳng/Sâu/Ngược

}
  