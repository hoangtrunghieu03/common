import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { PATIENT_OPTION } from 'src/app/shared/data/examine';
import DeactivateGuard from 'src/app/shared/directives/deactive-guard';
import { onUpdateMedicalRecordGeneral } from 'src/app/store/actions/medicalRecord.action';
import { RootState } from 'src/app/store/entities/state.entity';
import GeneralExamination from '../../../../../../../at-common/model/GeneralExamination';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import ImplantExamination from '../../../../../../../at-common/model/ImplantExamination';
@Component({
  selector: 'at-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  @Input() _footerAction: boolean = false;
  @Input() medicalRecordData: MedicalRecord;
  @Output() eventChangeTab: EventEmitter<any> = new EventEmitter();
  patientOption = PATIENT_OPTION;
  generalExamination: GeneralExamination = new GeneralExamination();
  generalExaminationOld: GeneralExamination = new GeneralExamination();
  generalExaminationCurrentState: GeneralExamination = new GeneralExamination();

  constructor(
    private store: Store<RootState>,
    public deactivate: DeactivateGuard) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.medicalRecordData?.generalExamination) {
      this.generalExamination = _.cloneDeep(this.medicalRecordData?.generalExamination);
      this.generalExaminationOld = _.cloneDeep(this.medicalRecordData?.generalExamination);
      this.generalExaminationCurrentState = _.cloneDeep(this.medicalRecordData?.generalExamination);
    }
  }

  ngDoCheck(): void {
    if (!_.isEqual(this.generalExamination, this.generalExaminationOld) && !_.isEqual(this.generalExamination, this.generalExaminationCurrentState) && this.deactivate.canChange) {
      this.generalExaminationCurrentState = _.cloneDeep(this.generalExamination);
      return this.deactivate.setCanDeactivate(false);
    }
    if (_.isEqual(this.generalExamination, this.generalExaminationOld) && !this.deactivate.canChange) {
      this.generalExaminationCurrentState = _.cloneDeep(this.generalExamination);
      return this.deactivate.setCanDeactivate(true);
    }
  }

  onCreateMedicalRecordGeneral = (): void => {
    if (!this.medicalRecordData._id) return;
    this.store.dispatch(onUpdateMedicalRecordGeneral({ _id: this.medicalRecordData._id, generalExamination: this.generalExamination }));
    this.deactivate.setCanDeactivate(true);
    this.eventChangeTab.emit(2);
  }

  onSelectedPatient = (event, first): void => {
    let dataArray: string[] = !this.generalExamination[first] ? [] : this.generalExamination[first];
    let index: number = dataArray.findIndex(val => val == event.target.value || val.includes(event.target.value));
    if (event.target.checked) {
      if (index == -1) {
        dataArray.push(event.target.value);
      }
    } else {
      dataArray.splice(index, 1);
    }

    this.generalExamination[first] = dataArray;
  }

  toothChecked = (value, first) => {
    return this.generalExamination[first]?.some(val => (val === value || val.includes(value)));
  }

  onInputOtherRender = (first, label) => {
    let value: any = null;
    value = this.generalExamination[first]?.find(val => val.includes(label));
    return value ? value?.split(': ')[1] : null;
  }

  onInputOtherReason = (event, first, label, active) => {
    if (!active) return;
    let dataArray: string[] = this.generalExamination[first];
    let value = label + event.target.value;
    let index: number = dataArray.findIndex(val => val.includes(label));
    this.generalExamination[first][index] = value;
  }

  onSelectedTooth = (tooth: string[]) => {
    this.generalExamination.tooth = tooth;
  }

  onCreateImplantExamine = () => {
    let implantExamination = this.medicalRecordData?.implantExamination ? this.medicalRecordData?.implantExamination : new ImplantExamination();
    implantExamination.reason = this.generalExamination.reason;
    implantExamination.medicalHistory = this.generalExamination.medicalHistory;
    implantExamination.personalHistory = this.generalExamination.personalHistory;
    implantExamination.tooth = this.generalExamination.tooth;
    return implantExamination;
  }
}
