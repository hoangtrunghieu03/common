import { createAction, props } from '@ngrx/store';
import DeliveryNote from '../../../../../at-common/model/DeliveryNote';
import MedicalScheduleReport from '../../../../../at-common/model/MedicalScheduleReport';

export const DeliveryNoteAction = {
    onLoadDeliveryNote: '[DeliveryNote] on load delivery note',
    onLoadDeliveryNoteSuccess: '[DeliveryNote] on load delivery note successfully',

    onCreateDeliveryNote: '[DeliveryNote] Create delivery note',
};

export const onLoadDeliveryNote = createAction(DeliveryNoteAction.onLoadDeliveryNote);
export const onLoadDeliveryNoteSuccess = createAction(DeliveryNoteAction.onLoadDeliveryNoteSuccess,
    props<{ deliveryNote: DeliveryNote[] }>()
);

export const onCreateDeliveryNote = createAction(DeliveryNoteAction.onCreateDeliveryNote,
    props<{ deliveryNote: DeliveryNote, scheduleReport: MedicalScheduleReport }>()
);