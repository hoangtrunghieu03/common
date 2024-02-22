import SurfaceEdentulousness from "./SurfaceEdentulousness";
import SurfaceLook from "./SurfaceLook";

/** KHÁM */
export default class BraceExaminationCheck {
    surface:string = "";///Ngoài mặt
    surfaceLook: SurfaceLook = new SurfaceLook();//Ngoài mặt:Nhìn thẳng
    surfaceEdentulousness: SurfaceEdentulousness = new SurfaceEdentulousness();//Ngoài mặt:Nhìn nghiêng
    chin: string = null;// Cằm: Nhô/Lẹm/Bình thường
}
  