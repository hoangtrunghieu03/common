import { createAction, props } from '@ngrx/store';
import MedicalSchedule from '../../../../../at-common/model/MedicalSchedule';
import MedicalScheduleReport from '../../../../../at-common/model/MedicalScheduleReport';

export const MedicalScheduleAction = {
    onLoadMedicalScheduleById: '[MedicalSchedule] load medical Schedule By Id',
    onLoadMedicalScheduleByIdSuccess: '[MedicalSchedule] load medical Schedule By Id Success',

    onCreateMedicalSchedule: '[MedicalSchedule] create new medical Schedule',
    onUpdateMedicalSchedule: '[MedicalSchedule] update medical Schedule',
    onMedicalScheduleReminder: '[MedicalSchedule] medical Schedule Reminder',
    onUpdateMedicalScheduleStatus: '[MedicalSchedule] medical Schedule Status',
    onRemoveMedicalSchedule: '[MedicalSchedule] remove medical Schedule',
    onUpdateStatusArcMaking: '[MedicalSchedule] update status making',
    onConfirmArcMaking: '[MedicalSchedule] confirm arc making',

    onLoadMedicalScheduleFilter: '[MedicalSchedule] filter medical Schedule',
    onLoadMedicalScheduleFilterSuccess: '[MedicalSchedule] filter medical Schedule Success',

    onLoadMedicalScheduleStatusWait: '[MedicalSchedule] filter medical Schedule status wait',
    onLoadMedicalScheduleStatusWaitSuccess: '[MedicalSchedule] filter medical Schedule status wait Success',

    onLoadArcMakingFilter: '[MedicalSchedule] filter arc making',
    onLoadArcMakingFilterSuccess: '[MedicalSchedule] filter arc making Success',
    onLoadMedicalScheduleCustomerQR: '[MedicalSchedule] load medical Schedule Customer QR',
    onLoadMedicalScheduleCustomerQRSuccess: '[MedicalSchedule] load medical Schedule Customer QR Success]',

    onConfirmSchedule: '[MedicalSchedule] on confirm medical Schedule Customer'
}

/**
 * action load medical Schedule By Id
 */
export const onLoadMedicalScheduleById = createAction(MedicalScheduleAction.onLoadMedicalScheduleById,
    props<{ _id: string }>()
)
export const onLoadMedicalScheduleCustomerQR = createAction(MedicalScheduleAction.onLoadMedicalScheduleCustomerQR,
  props<{customerCode: string}>()
)
export const onLoadMedicalScheduleCustomerQRSuccess = createAction(MedicalScheduleAction.onLoadMedicalScheduleCustomerQRSuccess,
  props<MedicalSchedule>()
)
export const onLoadMedicalScheduleByIdSuccess = createAction(MedicalScheduleAction.onLoadMedicalScheduleByIdSuccess,
    props<MedicalSchedule>()
)
/**
 * action create new medical Schedule
 */
export const onCreateMedicalSchedule = createAction(MedicalScheduleAction.onCreateMedicalSchedule,
    props<{ medicalSchedule: MedicalSchedule, scheduleReport: MedicalScheduleReport }>()
)
/**
 * action update medical Schedule
 */
export const onUpdateMedicalSchedule = createAction(MedicalScheduleAction.onUpdateMedicalSchedule,
    props<MedicalSchedule>()
)
/**
 * action remove medical Schedule
 */
export const onRemoveMedicalSchedule = createAction(MedicalScheduleAction.onRemoveMedicalSchedule,
    props<MedicalSchedule>()
)
/**
 * action update medical Schedule Status
 */
export const onUpdateMedicalScheduleStatus = createAction(MedicalScheduleAction.onUpdateMedicalScheduleStatus,
    props<MedicalSchedule>()
)
/**
 * action update status marking
 */
export const onUpdateStatusArcMaking = createAction(MedicalScheduleAction.onUpdateStatusArcMaking,
    props<{ _id: string, statusArc: string, scheduleReport: MedicalScheduleReport }>()
)
/**
 * action confirm arc marking
 */
export const onConfirmArcMaking = createAction(MedicalScheduleAction.onConfirmArcMaking,
    props<{ medicalSchedule: { listSchduleConfirm: string[] }, scheduleReport: MedicalScheduleReport }>()
)
/**
 * action medical Schedule Reminder
 */
export const onMedicalScheduleReminder = createAction(MedicalScheduleAction.onMedicalScheduleReminder,
    props<{ _id: string }>()
)
/**
 * action filter medical Schedule
 */
export const onLoadMedicalScheduleFilter = createAction(MedicalScheduleAction.onLoadMedicalScheduleFilter,
    props<MedicalScheduleReport>()
)
export const onLoadMedicalScheduleFilterSuccess = createAction(MedicalScheduleAction.onLoadMedicalScheduleFilterSuccess,
    props<{ medicalSchedule: MedicalSchedule[] }>()
)

export const onLoadMedicalScheduleStatusWait = createAction(MedicalScheduleAction.onLoadMedicalScheduleStatusWait,
  props<MedicalScheduleReport>()
)
export const onLoadMedicalScheduleStatusWaitSuccess = createAction(MedicalScheduleAction.onLoadMedicalScheduleStatusWaitSuccess,
  props<{ medicalSchedule: MedicalSchedule[] }>()
)

export const onLoadArcMakingFilter = createAction(MedicalScheduleAction.onLoadArcMakingFilter,
    props<MedicalScheduleReport>()
)
export const onLoadArcMakingFilterSuccess = createAction(MedicalScheduleAction.onLoadArcMakingFilterSuccess,
    props<{ arcMaking: MedicalSchedule[] }>()
)
export const onConfirmSchedule = createAction(MedicalScheduleAction.onConfirmSchedule,
  props<MedicalSchedule>()
)
