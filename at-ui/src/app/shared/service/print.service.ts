import { Platform } from '@angular/cdk/platform';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { hiddenProgress } from 'src/app/store/actions/progress.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { PRINT_STATUS } from '../enum/share.enum';
@Injectable({
    providedIn: 'root'
})
export class PrintService {

    private keyMedicalRecordPrint = new BehaviorSubject(PRINT_STATUS.medicalRecordPrint);
    private keyForwardingPrint = new BehaviorSubject(PRINT_STATUS.forwardingPrint);
    private keyExportHistpryPrint = new BehaviorSubject(PRINT_STATUS.exportHistoryPrint);

    medicalRecordPrint = this.keyMedicalRecordPrint.asObservable();
    forwardingPrint = this.keyForwardingPrint.asObservable();
    exportHistoryPrint = this.keyExportHistpryPrint.asObservable();
    paymentDate : Date;

    public isPrinting = false;
    subject = new Subject();
    navigationExtras: NavigationExtras;

    constructor(
        private router: Router,
        private _platform: Platform,
        private store: Store<RootState>,
        private _location: Location
    ) {
        this.subject.pipe(debounceTime(300))
        .subscribe(() => {
            window.print();
            this.isPrinting = false;
            this.router.navigate([{ outlets: { print: null } }])
            .then(() => this.router.navigate([{ outlets: { print: null }}], this.navigationExtras));
        })
    }
    setPaymentDate(date: Date) {
      this.paymentDate = date;
    }
    onPrint(_id: string, printOutlet: string):void {

        this.navigationExtras = {
            queryParams: {
                _id: _id,
            }
        }
        this.isPrinting = true;

        this.router.navigate([{ outlets: { print: [printOutlet] } }], this.navigationExtras)
    }

    onDataReady():void {
        this.subject.next(true);
    }

    onGetMedicalRecordDataPrint(key: any) {
        this.keyMedicalRecordPrint.next(key)
    }

    onGetForwardingDataPrint(key: any) {
        this.keyForwardingPrint.next(key)
    }

    onGetExportHistoryDataPrint(key: any) {
        this.keyExportHistpryPrint.next(key)
    }
}
