import { createAction, props } from "@ngrx/store";
import Notification from '../../../../../at-common/model/Notification';

export const NotificationAction = {
    onLoadNotification: '[Noti] load all noti',
    onLoadNotificationSuccess: '[Noti] load all noti successfully',

    onUpdateNotification: '[Noti] update all noti',
}

export const onLoadNotification = createAction(NotificationAction.onLoadNotification);
export const onLoadNotificationSuccess = createAction(NotificationAction.onLoadNotificationSuccess,
    props<{ notification: Notification[] }>()
)

export const onUpdateNotification = createAction(NotificationAction.onUpdateNotification,
    props<{ _id: string }>()
);