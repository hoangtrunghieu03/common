import { ANGLE_POSITION, ANGLE_TOOTH, ANGLE_TYPE } from "./enum";
/** THÔNG TIN XẾP HẠNG ANGLE */
export default class AngleRank {
  public position : string = ANGLE_POSITION.LEFT;// vị trí Bên phải/Bên trái
  public tooth : string = ANGLE_TOOTH.FANG;// Răng cối/Răng Nanh
  public class : string = ANGLE_TYPE.CLASS_ONE;// hạng Angle 
  public value: boolean = false; // Giá trị
}