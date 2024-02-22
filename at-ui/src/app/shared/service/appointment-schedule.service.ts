import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
// import MedicalSchedule from '../../../../../at-common/model/MedicalSchedule';

@Injectable({
    providedIn: 'root'
})

export class AppointmentScheduleService {

    appointmentSchedule: any[] = APPOINTMENT;

    constructor() {

    }

    getAppointmentSchedules = ():Observable<any[]> => {
        const role = of(this.appointmentSchedule);
        return role
    }

    onAddAppointmentSchedule = (param):void => {
        this.appointmentSchedule.push(param);
    }

    onDeleteAppointmentSchedule = ():void => {
        // this.roles = this.roles.filter()
    }
}

const APPOINTMENT: any [] = [{
    _id: 1,
    medicalRecordCode: 'LH1',
    customerName: 'Tuấn',
    creator: 'Nguyễn Văn Linh',
    scheduleTime: '2000-04-05T15:51:57.000Z',
    content: 'Giờ cao su',
    status: 'Chưa đến',
 }]
