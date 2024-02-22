import { createAction, props } from '@ngrx/store';
import { RoomInfo } from 'src/app/shared/data/at.model';
import BraceExamination from '../../../../../at-common/model/BraceExamination';
import GeneralExamination from '../../../../../at-common/model/GeneralExamination';
import ImplantExamination from '../../../../../at-common/model/ImplantExamination';
import MedicalBaseModel from '../../../../../at-common/model/MedicalBaseModel';
import MedicalRecord from '../../../../../at-common/model/MedicalRecord';
import MedicalRecordReport from '../../../../../at-common/model/MedicalRecordReport';
import PaymentHistory from '../../../../../at-common/model/PaymentHistory';
import TreatmentProcess from '../../../../../at-common/model/TreatmentProcess';

export const MedicalRecordAction = {
    onCreateMedicalRecord: '[MedicalRecord] create new MedicalRecord',
    onCreateMedicalRecordOther: '[MedicalRecord] create new MedicalRecord Other',
    onLoadMedicalRecordById: '[MedicalRecord] load medical record by Id',
    onLoadMedicalRecordByIdSuccess: '[MedicalRecord] load medical record by Id successfully',
    onLoadMedicalRecordDetailById: '[MedicalRecord] load medical record detail by Id',
    onLoadMedicalRecordDetailByIdSuccess: '[MedicalRecord] load medical record detail by Id successfully',
    onLoadMedicalRecordByDate: '[MedicalRecord] load medical record by Date',
    onLoadMedicalRecordByDateSuccess: '[MedicalRecord] load medical record by Date successfully',
    onLoadMedicalRecordPaymentHistory: '[MedicalRecord] load medical record payment history',
    onLoadMedicalRecordPaymentHistorySuccess: '[MedicalRecord] load medical record payment history successfully',
    onMedicalRecordPayment: '[MedicalRecord] Medical Record Payment',
    onMedicalRecordOldPayment: '[MedicalRecord] Medical Record Old Payment',
    onUpdateMedicalRecordGeneral: '[MedicalRecord] Update Medical Record General',
    onUpdateMedicalRecordBrace: '[MedicalRecord] Update Medical Record Brace',
    onAddTreatmentProcess: '[MedicalRecord] add Medical Record Treatment Process',
    onDeleteTreatmentProcess: '[MedicalRecord] Delete Treatment Process',
    onUpdateTreatmentProcess: '[MedicalRecord] update Medical Record Treatment Process',
    onFinishTreatmentProcess: '[MedicalRecord] finish Medical Record Treatment Process',
    onAddMedicalServiceIndicates: '[MedicalRecord] Add Medical Service Indicates',
    onAddMedicalService: '[MedicalRecord] Add Medical Service',
    onTransferRoom: '[MedicalRecord] transfer room',
    onTransferRoomAndResetChair: '[MedicalRecord] transfer room and reset chair',
    onReceiveCustomerToRoom: '[MedicalRecord] receive Customer To Room',
    onMedicalCustomerChair: '[MedicalRecord] update patient chair information',
    clearStateMedicalRecord: '[MedicalRecord] clear State Medical Record',
    onMedicalSICommand: '[MedicalRecord] medical Service Indicate Command',
    onUpLoadImg: '[MedicalRecord] Up Load Img medical record',
    onExaminationFinish: '[MedicalRecord] Examination Finish',
    onMedicalRecordFinish: '[MedicalRecord] Medical Record Finish',
    onMedicalServiceCommand: '[MedicalRecord] medical Service Command',
    onUpdateMedicalRecordImplant: '[MedicalRecord] Update Medical Record Implaint',
    onCreateMedicalRecordAndTranferRoom: '[MedicalSchedule] create new Medical Record And Transfer Room',
    onAddMedicalServiceIndicatesAndTranferRoom: '[MedicalSchedule] Add Medical Service Indicates And Transfer Room',
    onReExamination: '[MedicalRecord] Return Examination',
    onUpdateMedicalRecordName: '[MedicalRecord] Update Medical Record Name',
    onRemoveExamination: '[MedicalRecord] Remove Examination',
    onMedicalRecordNote: '[MedicalRecord] Medical Record Note',
    onMedicalRecordImages: '[MedicalRecord] Medical Record Images',

    onLoadMedicalRecordFilter: '[MedicalRecord] load medical record filter',
    onLoadMedicalRecordFilterSuccess: '[MedicalRecord] load medical record filter Successfully',

    onGetFilterExamine: '[MedicalRecord] Filter Examine',

    onDeletePayHistoryMedicalRecord: '[MedicalRecord] remove Pay History Record',
};

/**
 * action create medical record
 */
export const onCreateMedicalRecord = createAction(MedicalRecordAction.onCreateMedicalRecord,
  props<MedicalRecord>()
);
export const onCreateMedicalRecordOther = createAction(MedicalRecordAction.onCreateMedicalRecordOther,
  props<MedicalRecord>()
);
/**
 * load medical record by id
 */
 export const onLoadMedicalRecordById = createAction(MedicalRecordAction.onLoadMedicalRecordById,
  props<{id: string}>()
);

export const onLoadMedicalRecordByIdSuccess = createAction(MedicalRecordAction.onLoadMedicalRecordByIdSuccess,
  props<MedicalRecord>()
);

export const onDeletePayHistoryMedicalRecord = createAction(MedicalRecordAction.onDeletePayHistoryMedicalRecord,
  props<PaymentHistory>()
);
/**
 * load medical record detail by id
 */
 export const onLoadMedicalRecordDetailById = createAction(MedicalRecordAction.onLoadMedicalRecordDetailById,
  props<{id: string}>()
);

export const onLoadMedicalRecordDetailByIdSuccess = createAction(MedicalRecordAction.onLoadMedicalRecordDetailByIdSuccess,
  props<MedicalRecord>()
);

/**
 * load medical record by id
 */
 export const onLoadMedicalRecordByDate = createAction(MedicalRecordAction.onLoadMedicalRecordByDate,
  props<{id: string, examinationDate: string}>()
);

export const onLoadMedicalRecordByDateSuccess = createAction(MedicalRecordAction.onLoadMedicalRecordByDateSuccess,
  props<MedicalRecord>()
);
/**
 * load medical record by id
 */
 export const onLoadMedicalRecordPaymentHistory = createAction(MedicalRecordAction.onLoadMedicalRecordPaymentHistory,
  props<{ medicalRecordCode: string }>()
);

export const onLoadMedicalRecordPaymentHistorySuccess = createAction(MedicalRecordAction.onLoadMedicalRecordPaymentHistorySuccess,
  props<{ paymentHistory: PaymentHistory[]} >()
);

/**
 * action payment
 */
export const onMedicalRecordPayment = createAction(MedicalRecordAction.onMedicalRecordPayment,
  props<{ medicalRecord: MedicalRecordPayment, print: boolean }>()
);
/**
 * action payment
 */
export const onMedicalRecordOldPayment = createAction(MedicalRecordAction.onMedicalRecordOldPayment,
  props<{ medicalRecord: MedicalRecordPayment, print: boolean }>()
);

/**
 * add medical record general
 */
export const onUpdateMedicalRecordGeneral = createAction(MedicalRecordAction.onUpdateMedicalRecordGeneral,
  props<{_id: string, generalExamination: GeneralExamination}>()
)

/**
 * add medical record brace
 */
export const onUpdateMedicalRecordBrace = createAction(MedicalRecordAction.onUpdateMedicalRecordBrace,
  props<{_id: string, braceExamination: BraceExamination}>()
)

/**
 * add medical record general
 */
 export const onAddTreatmentProcess = createAction(MedicalRecordAction.onAddTreatmentProcess,
  props<{_id: string, treatmentProcess: TreatmentProcess}>()
)

/**
 * delete medical record general
 */
 export const onDeleteTreatmentProcess = createAction(MedicalRecordAction.onDeleteTreatmentProcess,
  props<{_id: string, treatmentProcess: {id: string}}>()
)

/**
 * add medical record general
 */
 export const onUpdateTreatmentProcess = createAction(MedicalRecordAction.onUpdateTreatmentProcess,
  props<{_id: string, treatmentProcess: TreatmentProcess}>()
)
/**
 * finish medical record treatment process
 */
 export const onFinishTreatmentProcess = createAction(MedicalRecordAction.onFinishTreatmentProcess,
  props<{_id: string, fromRoom: string, treatmentProcess: {id: string}}>()
)

/**
 * add medical Service Indicates
 */
export const onAddMedicalServiceIndicates = createAction(MedicalRecordAction.onAddMedicalServiceIndicates,
  props<{_id: string, medicalServiceIndicatesUpdate: MedicalBaseModel[]}>()
)

/**
 * add medical Service Indicates
 */
 export const onAddMedicalService = createAction(MedicalRecordAction.onAddMedicalService,
  props<{_id: string, medicalServicesUpdate: MedicalBaseModel[]}>()
)

/**
 * transfer room
 */

export const onTransferRoom = createAction(MedicalRecordAction.onTransferRoom,
  props<RoomInfo>()
)
/**
 * transfer room and reset chair
 */

export const onTransferRoomAndResetChair = createAction(MedicalRecordAction.onTransferRoomAndResetChair,
  props<RoomInfo>()
)

/**
 * transfer room
 */

export const onReceiveCustomerToRoom = createAction(MedicalRecordAction.onReceiveCustomerToRoom,
  props<{_id: string}>()
)

/**
 * customer chair
 */

export const onMedicalCustomerChair = createAction(MedicalRecordAction.onMedicalCustomerChair,
  props<{ _id: string, chair: any }>()
)

/**
 * medical Service Indicate Command
 */

export const onMedicalSICommand = createAction(MedicalRecordAction.onMedicalSICommand,
  props<{_id: string, medicalServiceIndicate: MedicalBaseModel}>()
)

/**
 * examination Finish
  Cập nhập trạng thái hoàn thành khám
 */

export const onExaminationFinish = createAction(MedicalRecordAction.onExaminationFinish,
  props<{ _id: string }>()
)

/**
 * medical Record Finish
  Cập nhập trạng thái hoàn thành và kết thúc hồ sơ bệnh án
 */

export const onMedicalRecordFinish = createAction(MedicalRecordAction.onMedicalRecordFinish,
  props<{ _id: string, medicalRecord: MedicalRecord }>()
)

/**
 *
 */

export const onMedicalServiceCommand = createAction(MedicalRecordAction.onMedicalServiceCommand,
  props<{_id: string, medicalService: MedicalBaseModel}>()
)

/**
 * add medical record implant
 */
 export const onUpdateMedicalRecordImplant = createAction(MedicalRecordAction.onUpdateMedicalRecordImplant,
  props<{_id: string, implantExamination: ImplantExamination}>()
)
/**
 * action create new medical And Transfer Room
 */
export const onCreateMedicalRecordAndTranferRoom = createAction(MedicalRecordAction.onCreateMedicalRecordAndTranferRoom,
  props<{ medicalRecord: { customerCode: any; serviceType: string; }, roomInfo: RoomInfo }>()
)
/**
 * action add medical service indicate And Transfer Room
 */
export const onAddMedicalServiceIndicatesAndTranferRoom = createAction(MedicalRecordAction.onAddMedicalServiceIndicatesAndTranferRoom,
  props<{_id: string, medicalServiceIndicatesUpdate: MedicalBaseModel[], roomInfo: RoomInfo}>()
)
/**
 * action re examination
 */
export const onReExamination = createAction(MedicalRecordAction.onReExamination,
  props<{ _id: string }>()
)
export const onUpdateMedicalRecordName = createAction(MedicalRecordAction.onUpdateMedicalRecordName,
  props<{ _id: string, medicalRecordName: string, serviceType: string }>()
)
/**
 * action remove examination
 */
export const onRemoveExamination = createAction(MedicalRecordAction.onRemoveExamination,
  props<{ _id: string }>()
)
/**
 * medical record note
 */
export const onMedicalRecordNote = createAction(MedicalRecordAction.onMedicalRecordNote,
  props<{ _id: string, note: string }>()
)
/**
 * medical record images
 */
export const onMedicalRecordImages = createAction(MedicalRecordAction.onMedicalRecordImages,
  props<{ _id: string, images: Array<any>, date: string }>()
)

export const onLoadMedicalRecordFilter = createAction(MedicalRecordAction.onLoadMedicalRecordFilter,
  props<MedicalRecordReport>()
);
export const onLoadMedicalRecordFilterSuccess = createAction(MedicalRecordAction.onLoadMedicalRecordFilterSuccess,
  props<{ medicalRecordFilter: MedicalRecordReport | MedicalRecordReport[] }>()
);

export const clearStateMedicalRecord = createAction(MedicalRecordAction.clearStateMedicalRecord);

export default interface MedicalRecordPayment {
  _id: string
  currentPayment: {
    moneyCustomerProvide: string | number,
    moneyPayment: string | number
  }
}

