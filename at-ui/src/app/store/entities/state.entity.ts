import Customer from '../../../../../at-common/model/Customer';
import Staffs from '../../../../../at-common/model/Staffs';
import Role from '../../../../../at-common/model/Role';
import Room from '../../../../../at-common/model/Room';
import MedicalServiceGroup from '../../../../../at-common/model/MedicalServiceGroup';
import MedicalService from '../../../../../at-common/model/MedicalService';
import MedicalServiceIndicate from '../../../../../at-common/model/MedicalServiceIndicate';
import MedicalServiceIndicateGroup from '../../../../../at-common/model/MedicalServiceIndicateGroup';
import MedicalRecord from '../../../../../at-common/model/MedicalRecord';
import CustomerReport from '../../../../../at-common/model/CustomerReport';
import DataAccess from '../../../../../at-common/model/DataAccess';
import StaffReport from '../../../../../at-common/model/StaffReport';
import MedicalSupply from '../../../../../at-common/model/MedicalSupply';
import Chair from '../../../../../at-common/model/Chair';
import MedicalSchedule from '../../../../../at-common/model/MedicalSchedule';
import Notification from '../../../../../at-common/model/Notification';
import DashBoard from '../../../../../at-common/model/DashBoard';
import MedicalEquipment from '../../../../../at-common/model/MedicalEquipment';
import ReportRevenue from '../../../../../at-common/model/ReportRevenue';
import ReportSupply from '../../../../../at-common/model/ReportSupply';
import MedicalSupplyHistoryReport from '../../../../../at-common/model/MedicalSupplyHistoryReport';
import MedicalSupplyInput from '../../../../../at-common/model/MedicalSupplyInput';
import ServiceRequest from '../../../../../at-common/model/ServiceRequest';
import PaymentHistory from '../../../../../at-common/model/PaymentHistory';
import MedicalSupplyHistory from '../../../../../at-common/model/MedicalSupplyHistory';
import MedicalComboService from '../../../../../at-common/model/MedicalComboService';
import Setting from '../../../../../at-common/model/Setting';
import DeliveryNote from '../../../../../at-common/model/DeliveryNote';
import MedicalSupplyExportRequest from '../../../../../at-common/model/MedicalSupplyExportRequest';
import MedicalRecordReport from '../../../../../at-common/model/MedicalRecordReport';
import ZaloInfo from '../../../../../at-common/model/ZaloInfo';

// for notification
export interface NotificationState {
  show?: boolean;
  notifyType?: 'info' | 'success' | 'warning' | 'error';
  message?: string;
}

// for progress bar
export interface ProgressState {
  show?: boolean;
  count: any;
}

// for customer
export interface CustomerState {
  customerList: Customer[],
  customerFilter: CustomerReport,
  customerSearch: CustomerReport,
  customerItem: Customer,
  medicalCustomer: any,
  filterCustomer: CustomerReport,
  message: string
}

// for staff
export interface StaffsState {
  staffList: Staffs[],
  staffItem?: Staffs;
  staffLogin?: Staffs;
  staffFilter: StaffReport,
  message: string
}


// for medical equipment
export interface MedicalEquipmentState {
  medicalEquipmentList: MedicalEquipment[],
  medicalEquipmentDetails: MedicalEquipment,
  medicalSupplyHistory: MedicalSupplyHistoryReport,
  medicalUnitSupplyHistory: MedicalSupplyHistory[]
}


/** Role */
export interface RoleState {
  roles: Role[],
  message: string,
  dataAccess: DataAccess[],
  rolesList: Role[],
  roleItem?: Role;
  roleStaffLogin?: Role;
}

/** MedicalRecord */
export interface MedicalRecordState {
  medicalRecord: MedicalRecord,
  medicalRecordDetail: MedicalRecord,
  medicalRecordByDate: MedicalRecord,
  medicalRecordFilter: MedicalRecordReport,
  medicalRecordPaymentHistory: PaymentHistory[],
}

/** Medical Supply */
export interface MedicalSupplyState {
  medicalSupply: MedicalSupply[],
  medicalSupplyItem: MedicalSupply,
  medicalSupplyFilter: MedicalSupply[],
  medicalSupplyUnit : MedicalSupplyHistory[],
}

/** Medical Supply */
export interface MedicalSupplyRequestState {
  medicalSupplyRequest: MedicalSupplyExportRequest[],
  medicalSupplyRequestItem: MedicalSupplyExportRequest,
}

/** Medical Schedule */
export interface MedicalScheduleState {
  medicalSchedule: MedicalSchedule,
  medicalScheduleFilter: MedicalSchedule[],
  arcMakingFilter: MedicalSchedule[],
  medicalScheduleFilterStatusWait: MedicalSchedule[],
}

/** Room */
export interface RoomsState {
  rooms: Room[],
  message: string
}

/** Chair */
export interface ChairState {
  chairList: Chair[],
  chairItem: Chair,
  chairStaff: Chair,
  message: string
}

/** Notification */
export interface NotificationMedicalState {
  notificationList: Notification[],
  message: string
}

/** Dashboard */
export interface DashboardState {
  revenueDays: DashBoard[],
  customers: DashBoard[],
  medicalService: DashBoard[],
  chairStatus: DashBoard[],
  message: string
}

/** Report */
export interface ReportState {
  generals: ReportRevenue,
  generalDetail: ReportRevenue,
  staffs: ReportRevenue,
  staffDetail: ReportRevenue,
  rooms: ReportRevenue,
  inventory: ReportSupply,
  inventoryByRoom: ReportSupply,
  roomDetails: ReportSupply,
  message: string,
  serviceRevenues: ReportRevenue,
}

/** Medical Service Group State */
export interface MedicalServiceGroupState {
  medicalServiceGroups: MedicalServiceGroup[],
  message: string
}

/** Medical Service State */
export interface MedicalServiceState {
  medicalServiceItem: MedicalService,
  medicalServices: MedicalService[],
  medicalServiceFilter: MedicalService[],
  medicalServiceTag: Array<{ _id: string, tagService: string }>,
  message: string
}

/** Medical Combo Service State */
export interface MedicalComboServiceState {
  medicalComboServiceItem: MedicalComboService,
  medicalComboServices: MedicalComboService[],
  medicalComboServiceFilter: MedicalComboService[],
  message: string
}

/** Medical Service Indicate State */
export interface ServiceIndicateState {
  serviceIndicates: MedicalServiceIndicate[],
  serviceIndicateItem: MedicalServiceIndicate,
  serviceIndicateFilter: MedicalServiceIndicate[],
  tagServiceIndeicate : Array<{ _id: string, tagService: string }>,
  message: string
}

/** Medical Service Indicate Group State */
export interface ServiceIndicateGroupState {
  serviceIndicateGroups: MedicalServiceIndicateGroup[],
  message: string
}

/** Service Request State */
export interface ServiceRequestState {
  serviceRequestList: ServiceRequest[],
  serviceRequestFilter: ServiceRequest[],
  message: string
}

/** Service Request State */
export interface DeliveryNoteState {
  deliveryNoteList: DeliveryNote[],
  message: string
}

/** Setting State */
export interface SettingState {
  settings: Setting[],
  message: string
}
export interface ZaloState {
  zaloInfoList: ZaloInfo[],
  zaloInfoItem: ZaloInfo,
  zaloAuth: any
}
/**for authencation**/
export interface AuthencationState {
  userName?: string;
  token?: string;
  role?: string;
  logged: boolean;
  _id?: string;
  roomIds?: []
}

export interface HandleError {
  code?: number;
  message?: string;
  _id?: string;
  entity?: any;
}

export interface RootState {
  customer: CustomerState,
  notify: NotificationState;
  staff: StaffsState,
  progress: ProgressState,
  authencation: AuthencationState,
  medicalRecord: MedicalRecordState
  role: RoleState,
  medicalSupply: MedicalSupplyState,
  medicalSupplyRequest: MedicalSupplyRequestState,
  medicalSchedule: MedicalScheduleState,
  room: RoomsState,
  medicalServiceGroup: MedicalServiceGroupState,
  medicalService: MedicalServiceState,
  medicalComboService: MedicalComboServiceState,
  serviceIndicate: ServiceIndicateState,
  serviceIndicateGroup: ServiceIndicateGroupState,
  chair: ChairState,
  notification: NotificationMedicalState,
  dashboard: DashboardState,
  medicalEquipment: MedicalEquipmentState
  report: ReportState,
  medicalEquipmentList:MedicalEquipmentState,
  serviceRequest: ServiceRequestState,
  deliveryNote: DeliveryNoteState,
  setting: SettingState,
  zalo: ZaloState
}


