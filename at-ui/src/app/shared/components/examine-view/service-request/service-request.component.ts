import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { RootState } from 'src/app/store/entities/state.entity';
import { DestroySubsribeService } from '../../../service/destroySubscribe.service';
import ServiceRequest from '../../../../../../../at-common/model/ServiceRequest';
import { ControlContainer, FormGroupDirective, FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { formatTextLating, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { onCreateServiceRequest, onLoadServiceRequest } from 'src/app/store/actions/serviceRequest.action';
import { Observable, of, Subject, timer } from 'rxjs';
import { onLoadServiceRequestFilter } from '../../../../store/actions/serviceRequest.action';

@Component({
  selector: 'at-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss'],
  providers: [DestroySubsribeService],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class ServiceRequestComponent implements OnInit {

  @Input() typeRequestSelect: string = null;
  @Input() formControlSelect: FormControl;

  @Input() label: string;
  @Input() textPlaceHolder: string = "Tìm kiếm";
  @Input() textSearch: string;

  @Input() required: boolean;
  @Input() selectValid: boolean;
  @Input() selectRequired: boolean;
  @Input() disabled: boolean;

  @Output() _onChangeValueSelected: EventEmitter<string | number | boolean> = new EventEmitter();


  serviceRequest: ServiceRequest[] = [];
  serviceRequestFilter: ServiceRequest[] = [];

  isCreate: boolean = false;

  serviceRequestForm: FormGroup;

  validateForm = validateForm;

  private subject = new Subject<string | any>();

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.onLoadServiceRequest();
    this.serviceRequestForm = this.createServiceRequestForm();

    this.subject.pipe(
      debounceTime(500)
    ).subscribe(val => {
      this.onSearch(val)
    })
  }

  createServiceRequestForm = (): FormGroup => {
    return this.formBuilder.group({
      serviceRequestName: [null, [Validators.required], this.validIncludeServiceRequest.bind(this)],
      typeServiceRequest: [this.typeRequestSelect],
      description: [null],
    })
  }

  handleSelectedChange(valueName: string, value: string): void {
    this.textSearch = valueName;
    this.formControlSelect.setValue(valueName);
    this._onChangeValueSelected.emit(value);
  }

  onLoadServiceRequest = (): void => {
    this.store.dispatch(onLoadServiceRequestFilter({ typeServiceRequest: this.typeRequestSelect }));
    this.store.select(state => state.serviceRequest.serviceRequestFilter)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(serviceRequest => {
        if (!serviceRequest) return this.serviceRequest = [];
        this.serviceRequest = serviceRequest;
        this.serviceRequestFilter = serviceRequest;
        this.textSearch = this.formControlSelect?.value;
      })
  }

  onCreateServiceRequest = () => {
    if (this.serviceRequestForm.valid) {
      this.serviceRequestForm.get('description').setValue(this.serviceRequestForm.get('serviceRequestName').value);
      this.store.dispatch(onCreateServiceRequest(this.serviceRequestForm.value));
      this.isCreate = false;
      this.serviceRequestForm = this.createServiceRequestForm();
      return;
    }
    validateAllFormFields(this.serviceRequestForm);
    scrollToFirstInvalidControl(this.serviceRequestForm);
  }

  getServiceRequestName = (serviceRequestId: string): string => {
    let serviceName = this.serviceRequest.find(serviceRequest => serviceRequest._id === serviceRequestId)?.serviceRequestName;
    return serviceName ? serviceName : null;
  }

  onSearch(event): void {
    this.serviceRequestFilter = this.serviceRequest.filter((val) => (event
        ? formatTextLating(val.serviceRequestName).indexOf(formatTextLating(event)) > -1
        : true)
    );
  }

  onKeyUp(event) {
    let val = event.target.value?.replace(/\s+/g,' ')
    this.textSearch = val;
    this.subject.next(val);
  }

  removeText(){
    this.textSearch = null;
    this.subject.next(this.textSearch);
    this.formControlSelect.setValue(null);
  }

  validatorName = (name: string): Observable<boolean> => {
    let isValid: boolean = this.serviceRequest.every(val => val.serviceRequestName.toLocaleLowerCase() !== name.toLocaleLowerCase())
    return of(isValid)
  }

  validIncludeServiceRequest = (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500)
      .pipe(
        switchMap(() =>
          this.validatorName(control.value)
            .pipe(
              map(isValid => {
                if (isValid) return null;
                return {
                  nameDuplicated: true
                }
              }
              )
            ))
      )
  }
}
