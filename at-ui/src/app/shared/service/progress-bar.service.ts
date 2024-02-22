import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
let Promise = require('promise');
@Injectable({
    providedIn: 'any'
})
export class ProgressBarService {
    // Private
    private _bufferValue: BehaviorSubject<number>;
    private _mode: BehaviorSubject<string>;
    private _value: BehaviorSubject<number>;
    private _visible: BehaviorSubject<boolean>;
    private _visibleArray = new BehaviorSubject<boolean[]>([]);
    _visibleArray$ = this._visibleArray.asObservable();
    /**
     * Constructor
     *
     * @param {Router} _router
     */
    constructor(
        private _router: Router,
    ) {
        // Initialize the service
        this._init();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Buffer value
     */
    get bufferValue(): Observable<any> {
        return this._bufferValue.asObservable();
    }

    setBufferValue(value: number): void {
        this._bufferValue.next(value);
    }

    /**
     * Mode
     */
    get mode(): Observable<any> {
        return this._mode.asObservable();
    }

    setMode(value: 'determinate' | 'indeterminate' | 'buffer' | 'query'): void {
        this._mode.next(value);
    }

    /**
     * Value
     */
    get value(): Observable<any> {
        return this._value.asObservable();
    }

    setValue(value: number): void {
        this._value.next(value);
    }

    /**
     * Visible
     */
    get visible(): Observable<any> {
        return this._visible.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Initialize
     *
     * @private
     */
    private _init(): void {
        // Initialize the behavior subjects
        this._bufferValue = new BehaviorSubject(0);
        this._mode = new BehaviorSubject('indeterminate');
        this._value = new BehaviorSubject(0);
        this._visible = new BehaviorSubject(false);

        // Subscribe to the router events to show/hide the loading bar
        this._router.events
            .pipe(filter((event) => event instanceof NavigationStart))
            .subscribe(() => {
                this.isLoading(true);
            });

        this._router.events
            .pipe(filter((event) => event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel))
            .subscribe((val) => {
                setTimeout(() => {
                    this.isLoading(false);
                }, 500);
            });
    }

    /**
  * function to listen if something is currently loading.
  *
  * @param loading
  */

    progress: boolean;
    isLoading(loading: boolean): Promise<boolean> {
        this.progress = loading;
        let promise = new Promise((resolve, reject) => {
            const loadingArray = this._visibleArray.getValue();
            if (loading) {
                loadingArray.push(true);
            } else {
                loadingArray.splice(0, 1);
            }
            this._visibleArray.next(loadingArray);
            resolve(true);
        });
        return promise;
    }

    removeAllLoading(): void {
        const loadingArray = this._visibleArray.getValue();
        loadingArray.splice(0, loadingArray.length);
        this._visibleArray.next(loadingArray);
    }

}