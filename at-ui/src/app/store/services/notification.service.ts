import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import NotificationManager from '../../../../../at-common/model/manager/NotificationManager';
import Notification from '../../../../../at-common/model/Notification';

@Injectable()
export class NotificationService {

  constructor() {
  }

  async onLoadNotification(): Promise<HttpStatus<Notification[]>> {
    const notificationManager = new NotificationManager(null);
    notificationManager.classInfo.endPoint = notificationManager.classInfo.endPoint.concat('/notificationme');
    return notificationManager.search(null);
  }

  async onUpdateNotification(notify): Promise<HttpStatus<Notification>> {
    const notificationManager = new NotificationManager(null);
    notificationManager.classInfo.endPoint = notificationManager.classInfo.endPoint.concat('/markRead');
    return notificationManager.update({ _id: notify._id }, notify);
  }

}