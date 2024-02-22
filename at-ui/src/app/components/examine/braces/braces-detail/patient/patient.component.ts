import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { onUpdateMedicalRecordBrace } from 'src/app/store/actions/medicalRecord.action';
import AnalyticPartern from '../../../../../../../../at-common/model/AnalyticPartern';
import AngleRank from '../../../../../../../../at-common/model/AngleRank';
import BraceExamination from '../../../../../../../../at-common/model/BraceExamination';
import BraceExaminationCheck from '../../../../../../../../at-common/model/BraceExaminationCheck';
import BraceExaminationCheckMount from '../../../../../../../../at-common/model/BraceExaminationCheckMount';
import BraceExaminationDiagnostic from '../../../../../../../../at-common/model/BraceExaminationDiagnostic';
import BraceExaminationFuntional from '../../../../../../../../at-common/model/BraceExaminationFuntional';
import BraceExaminationPlan from '../../../../../../../../at-common/model/BraceExaminationPlan';
import { ANGLE_POSITION, ANGLE_TOOTH, ANGLE_TYPE } from '../../../../../../../../at-common/model/enum';
import MedicalRecord from '../../../../../../../../at-common/model/MedicalRecord';
import OrthopedicCase from '../../../../../../../../at-common/model/OrthopedicCase';
import { RootState } from '../../../../../store/entities/state.entity';
import DeactivateGuard from '../../../../../shared/directives/deactive-guard';

@Component({
  selector: 'at-braces-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class BracesPatientComponent implements OnInit {

  @Input() medicalRecordData: MedicalRecord = null;
  @Output() eventChangeTab: EventEmitter<any> = new EventEmitter();

  orthopedic = ORTHOPEDIC_CONTENT;
  examineContent = EXAMINE_CONTENT;
  oralExamineContent = ORAL_EXAMINE_CONTENT;
  jawBeforeContent = JAW_BEFORE_CONTENT;
  jawSideContent = JAW_SIDE_CONTENT;
  functionalContent = FUNCTIONAL_CONTENT;
  planContent = PLAN_CONTENT;
  deseaseClassifyContent = DESEASE_CLASSIFY;

  braceExamination = new BraceExamination();
  braceExaminationOld = new BraceExamination();
  braceExaminationCurrentState = new BraceExamination();


  header = ['', 'Trước sau', 'Ngang', 'Đứng']
  angleType = ANGLE_TYPE;

  constructor(
    private store: Store<RootState>,
    public deactivate: DeactivateGuard
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.onLoadmedicalRecordData();
  }

  ngDoCheck(): void {
    if (!_.isEqual(this.braceExamination, this.braceExaminationCurrentState) &&
      !_.isEqual(this.braceExamination, this.braceExaminationOld) && this.deactivate.canChange) {
      this.braceExaminationCurrentState = _.cloneDeep(this.braceExamination);
      return this.deactivate.setCanDeactivate(false);
    }
    if (_.isEqual(this.braceExamination, this.braceExaminationOld) && !this.deactivate.canChange) {
      this.braceExaminationCurrentState = _.cloneDeep(this.braceExamination);
      return this.deactivate.setCanDeactivate(true);
    }
  }

  onLoadmedicalRecordData = () => {
    if (this.medicalRecordData.braceExamination) {
      this.braceExamination = _.cloneDeep(this.medicalRecordData.braceExamination);
      this.braceExaminationOld = _.cloneDeep(this.medicalRecordData.braceExamination);
      this.braceExaminationCurrentState = _.cloneDeep(this.medicalRecordData.braceExamination);
    }
  }

  handleCheckboxOrthopedicBlock = (event, first, second, thir, action) => {
    this.braceExamination[first][second] = !this.braceExamination[first][second] ? []
      : this.braceExamination[first][second];
    if (action) {
      if (thir) return this.braceExamination[first][second][thir] = event.target.checked ? true : false;
      this.braceExamination[first][second] = event.target.checked ? true : false;
      return;
    }
    let dataArray: string[] = [];
    if (thir) {
      dataArray = !this.braceExamination[first][second][thir] ? [] : this.braceExamination[first][second][thir];
    } else {
      dataArray = !this.braceExamination[first][second] ? [] : this.braceExamination[first][second];
    }
    let index: number = dataArray?.findIndex(val => val == event.target.value || val.includes(event.target.value));
    if (event.target.checked) {
      if (index == -1) {
        dataArray.push(event.target.value);
      }
    } else {
      dataArray.splice(index, 1);
    }

    if (thir) return this.braceExamination[first][second][thir] = dataArray.length == 0 ? null : dataArray;
    this.braceExamination[first][second] = dataArray.length == 0 ? null : dataArray;
  };

  handleCheckboxJawSide = (event, first, second, action) => {
    if (action) return this.braceExamination[first][second] = event.target.checked ? true : false;

    let dataArray: string[] = !this.braceExamination[first][second] ? [] : this.braceExamination[first][second];
    let index: number = dataArray?.findIndex(val => val == event.target.value);
    if (event.target.checked) {
      if (index == -1) {
        dataArray.push(event.target.value);
      }
    } else {
      dataArray.splice(index, 1);
    }

    this.braceExamination[first][second] = dataArray.length == 0 ? null : dataArray;
  };

  handleCheckboxDeseaseClassifyBlock = (event, first): void => {
    let dataArray: string[] = !this.braceExamination[first] ? [] : this.braceExamination[first];
    let index: number = dataArray?.findIndex(val => val == event.target.value);
    if (event.target.checked) {
      if (index == -1) {
        dataArray.push(event.target.value);
      }
    } else {
      dataArray.splice(index, 1);
    }

    this.braceExamination[first] = dataArray.length == 0 ? null : dataArray;
  };

  onCreateMedicalRecordBrace = (): void => {
    if (!this.medicalRecordData._id) return;
    let value = { _id: this.medicalRecordData._id, braceExamination: this.braceExamination };

    this.store.dispatch(onUpdateMedicalRecordBrace(value));
    this.deactivate.setCanDeactivate(true);
    this.eventChangeTab.emit(2);
  }

  onCheckNumber = (num: number, rowInd: number, colInd: number): void => {
    let data: any = !this.braceExamination.braceExaminationCheckMount.toothCheck ? [] : this.braceExamination.braceExaminationCheckMount.toothCheck;
    let indexOfNum: number = data?.findIndex(val => val === Number(num + '' + rowInd + '' + colInd))
    if (indexOfNum > -1) {
      data.splice(indexOfNum, 1)
    } else {
      data.push(Number(num + '' + rowInd + '' + colInd))
    }
    this.braceExamination.braceExaminationCheckMount.toothCheck = data;
  }

  onCheckCharacters = (characters: string, rowInd: number, colInd: number): void => {
    let data: any = !this.braceExamination.braceExaminationCheckMount.toothCheckChild ? [] : this.braceExamination.braceExaminationCheckMount.toothCheckChild;
    let indexOfNum: number = data?.findIndex(val => val === characters + '' + rowInd + '' + colInd)
    if (indexOfNum > -1) {
      data.splice(indexOfNum, 1)
    } else {
      data.push(characters + '' + rowInd + '' + colInd)
    }
    this.braceExamination.braceExaminationCheckMount.toothCheckChild = data;
  }

  checkIncludeNum = (num, rowInd, colInd): boolean => {
    let data: any = this.braceExamination.braceExaminationCheckMount.toothCheck;
    return data?.some(val => val === Number(num + '' + rowInd + '' + colInd))
  }

  checkIncludeCharacters = (characters, rowInd, colInd): boolean => {
    let data: any = this.braceExamination.braceExaminationCheckMount.toothCheckChild;
    return data?.some(val => val === characters + '' + rowInd + '' + colInd)
  }

  handleRenderData = (key: boolean): Array<number> => {
    let data = [1, 2, 3, 4, 5, 6, 7, 8]
    return key ? data : data.reverse();
  }

  handleRenderTitle = (key: boolean): Array<string> => {
    let data = ['A', 'B', 'C', 'D', 'E', '', '', '']
    return key ? data : data.reverse();
  }

  handleRenderColumn = (event: any, className: string, indexPosition: number) => {
    let dataArray: AngleRank[] = !this.braceExamination.braceExaminationCheckMount.correlationTeethSideAngleRank ? [] : this.braceExamination.braceExaminationCheckMount.correlationTeethSideAngleRank;
    let index = dataArray?.findIndex(x =>
    (x.class === className &&
      x.tooth === (indexPosition < 2 ? ANGLE_TOOTH.FANG : ANGLE_TOOTH.MOLAR) &&
      x.position === (indexPosition % 2 == 0 ? ANGLE_POSITION.RIGHT : ANGLE_POSITION.LEFT)));
    let data: AngleRank = null;
    if (index == -1) {
      data = {
        position: indexPosition % 2 == 0 ? ANGLE_POSITION.RIGHT : ANGLE_POSITION.LEFT,
        class: className,
        tooth: indexPosition < 2 ? ANGLE_TOOTH.FANG : ANGLE_TOOTH.MOLAR,
        value: event.target.checked,
      }
      dataArray.push(data);
    } else {
      dataArray.splice(index, 1);
    }

    this.braceExamination.braceExaminationCheckMount.correlationTeethSideAngleRank = dataArray;
  }

  getValueColumn = (className: string, indexPosition: number): boolean => {
    let dataArray = this.medicalRecordData.braceExamination?.braceExaminationCheckMount?.correlationTeethSideAngleRank;
    if (!dataArray) return null;
    let value = dataArray?.find(x =>
    (x?.class === className &&
      x?.tooth === (indexPosition < 2 ? ANGLE_TOOTH.FANG : ANGLE_TOOTH.MOLAR) &&
      x?.position === (indexPosition % 2 == 0 ? ANGLE_POSITION.RIGHT : ANGLE_POSITION.LEFT)));
    return !value ? false : value.value;
  }

  toothChecked = (value, first, second, thir, four, action) => {
    // if (!this.medicalRecordData.braceExamination) return;
    if (action) {
      if (four && this.braceExamination[first][second] && this.braceExamination[first][second][thir]) return this.braceExamination[first][second][thir][four]
      if (thir && this.braceExamination[first][second]) return this.braceExamination[first][second][thir];
      if (second) return this.braceExamination[first][second];
      return this.braceExamination[first];
    }

    if (four) return this.braceExamination[first][second] &&
      this.braceExamination[first][second][thir] &&
      this.braceExamination[first][second][thir][four]?.some(val => val === value || val.includes(value));
    if (thir) return this.braceExamination[first][second] && this.braceExamination[first][second][thir]?.some(val => val === value || val.includes(value));
    if (second) return this.braceExamination[first] && this.braceExamination[first][second]?.some(val => val === value || val.includes(value));
    return this.braceExamination[first]?.some(val => val === value);
  }

  onInputOtherRender = (first, second, label) => {
    let value: any = null;
    if (second && this.braceExamination[first]) {
      value = this.braceExamination[first][second]?.find(val => val.includes(label));
    } else {
      value = this.braceExamination[first]?.find(val => val.includes(label));
    }
    return value ? value?.split(': ')[1] : null;
  }

  onInputOtherReason = (event, first, second, label, active) => {
    if (!active) return;
    let dataArray: string[] = second ? this.braceExamination[first][second] : this.braceExamination[first];
    let value = label + event.target.value;
    let index: number = dataArray.findIndex(val => val.includes(label));
    if (second) return this.braceExamination[first][second][index] = value;
    this.braceExamination[first][index] = value;
  }

  getClassByIndex = (index: number) => {
    return Object.values(ANGLE_TYPE)[index];
  }

  correctOrder() {
    return 1;
  }

  ngOnDestroy(): void {
  }

}

const ORTHOPEDIC_CONTENT = [
  {
    label: 'Tiền sử y khoa',
    key: 'medicalHistory',
    group: null,
    option: [
      'Sứt môi, hở hàm ếch',
      'Viêm khớp, chấn thương',
      'Tiểu đường',
      'Tim mạch',
      'Hô hấp',
      'Tiêu hóa',
      'Tâm thần kinh',
      'Bệnh về máu',
      'Khác: ',
    ],
  },
  {
    label: 'Tiền sử nha khoa',
    key: 'personalHistory',
    group: [
      {
        label: 'Vệ sinh răng miệng',
        key: 'dentalHygiene',
        option: ['Kém', 'Vừa', 'Tốt'],
      },
    ],
    option: [
      'Bệnh nha chu',
      'Nghiện rượu',
      'Ma túy',
      'Khác: '
    ],
  },
  {
    label: 'Gia đình',
    key: 'teeth',
    group: null,
    option: ['Lệch lạch', 'Hô', 'Móm', 'Khác: '],
  },
];

const EXAMINE_CONTENT = [
  {
    label: 'Nhìn thẳng',
    key: 'surfaceLook',
    options: [],
    group: [
      {
        label: 'Hình dạng mặt',
        key: 'faceshape',
        options: ['Dài', 'Trung bình', 'Ngắn'],
        sub: [
          { label: 'Cân đối', key: 'faceshapeBlance', options: [''] },
          { label: 'Không cân đối', key: 'faceshapeNotBlance', options: ['Cằm lệch (P)', 'Cằm lệch (T)'] },
        ]
      },
      {
        label: 'Cười',
        key: 'laugh',
        options: [],
        sub: [
          { label: 'Cân đối', key: 'laughBlance', options: [''] },
          { label: 'Không cân đối', key: 'laughNotBlance', options: ['Lệch (P)', 'Lệch (T)'] },
          { label: 'Nụ cười', key: 'smile', options: ['Con hổ', 'Con ngựa' , 'Con trâu'] },
          { label: 'Ngắt hành lang', key: 'breakCorridor', options: ['Rộng', 'Hẹp', 'Vừa'] },
        ]
      },
      {
        label: 'Môi',
        key: 'lip',
        options: ['Dày', 'Trung bình', 'Mỏng'],
        sub: []
      }
    ],
  },
  {
    label: 'Nhìn nghiêng',
    key: 'surfaceEdentulousness',
    group: [
      {
        label: 'Hai tầng mặt',
        key: 'layerBlance',
        options: [],
        sub: [
          { label: 'Cân đối', key: 'layerBlance', options: [''] },
          { label: 'Không cân đối', key: 'layerNotBlance', options: ['Tầng mặt dưới dài', 'Tầng mặt dưới ngắn'] },
        ]
      },
      {
        label: 'Hình dạng mặt',
        key: 'faceshape',
        options: ['Lồi', 'Thẳng', 'Lõm'],
        sub: []
      }
    ],
  },
  {
    label: 'Cằm',
    key: 'chin',
    options: ['Nhô', 'Lẹm', 'Bình thường'],
    group: []
  }
];

const ORAL_EXAMINE_CONTENT = [
  {
    label: 'Hàm trên',
    key: 'toothCheckAbove',
    options: [
      { label: 'Hình dáng', key: 'toothCheckAboveShape', options: ['Hình trứng', 'Hình vuông', 'Hình nón', 'Hình omega'] },
      { label: 'Cân đối', options: [] },
      { label: 'Không cân đối', options: [] },
      { label: 'Chen chúc', options: [] },
      { label: 'Hài hòa', options: [] },
      { label: 'Có răng xoay', options: [] },
      { label: 'Có khoảng trống', options: [] },
      { label: 'Răng sau', key: 'toothCheckAboveBackteeth', options: ['Thẳng', 'Nghiêng trong', 'Nghiêng ngoài', 'Nghiêng xa', 'Nghiêng gần'] },
    ]
  },
  {
    label: 'Hàm dưới',
    key: 'toothCheckBellow',
    options: [
      { label: 'Hình dáng', key: 'toothCheckBellowShape', options: ['Hình trứng', 'Hình vuông', 'Hình nón', 'Hình omega'] },
      { label: 'Cân đối', options: [] },
      { label: 'Không cân đối', options: [] },
      { label: 'Chen chúc', options: [] },
      { label: 'Hài hòa', options: [] },
      { label: 'Có răng xoay', options: [] },
      { label: 'Có khoảng trống', options: [] },
      { label: 'Răng sau', key: 'toothCheckBellowBackteeth', options: ['Thẳng', 'Nghiêng trong', 'Nghiêng ngoài', 'Nghiêng xa', 'Nghiêng gần'] },
    ]
  },
]

const JAW_BEFORE_CONTENT = [
  {
    label: 'Độ cắn phủ',
    key: 'correlationTeethFrontCoverage',
    options: ['Bình thường', 'Cắn sâu', 'Cắn hở'],
    sub: [],
  },
  {
    label: 'Đường giữa',
    options: [],
    sub: [
      {
        label: 'Trùng nhau',
        key: 'correlationTeethFrontMedianDuplicate',
        options: ['Bên phải', 'Bên trái', 'Giữa mặt'],
        sub: [],
      },
      {
        label: 'Không trùng nhau',
        options: [],
        sub: [
          { label: 'Hàm trên', key: 'correlationTeethFrontMedianNoDuplicateAbove', options: ['Lệch trái', 'Lệch phải'] },
          { label: 'Hàm dưới', key: 'correlationTeethFrontMedianNoDuplicateBellow', options: ['Lệch trái', 'Lệch phải'] },
        ],
      },
    ],
  },
  {
    label: 'Răng sau',
    options: [],
    sub: [
      { label: 'Cắn phủ', key: 'correlationTeethFrontBackCover', options: [''] },
      { label: 'Cắn chéo', key: 'correlationTeethFrontBackCross', options: ['Trái', 'Phải', 'Hai bên'] },
    ],
  },
  {
    label: 'Xương ổ răng hai bên',
    key: 'correlationTeethFrontAlveolarBone',
    options: ['Cân xứng', 'Không cân xứng'],
    sub: [],
  },
];

const JAW_SIDE_CONTENT = [
  { label: 'Độ cắn chìa', key: 'correlationTeethSideAlignment', options: ['Bình thường', 'Cắn chìa', 'Cắn đối đầu', 'Cắn chéo'] },
  { label: 'Đường cong Spee', key: 'correlationTeethSideSpee', options: ['Phẳng', 'Sâu', 'Ngược'] },
]

const FUNCTIONAL_CONTENT = {
  title: 'Khám chức năng và cận chức năng',
  block: [
    {
      title: 'Khớp thái dương hàm',
      options: [
        {
          label: 'Hướng đóng mở hàm dưới',
          key: 'temporomandibularJointAbove',
          options: [],
          sub: [
            { label: 'Thẳng', key: 'temporomandibularJointAboveStraight', options: [''] },
            { label: 'Lệch', key: 'temporomandibularJointAboveDeviated', options: ['Trái', 'Phải'] },
            { label: 'Dích dắc', key: 'temporomandibularJointAboveZigzag', options: [''] },
          ],
        },
        {
          label: 'Cử động hàm dưới sang bên',
          key: 'temporomandibularJointSide',
          options: [],
          sub: [
            { label: 'Bình thường', key: 'temporomandibularJointSideNormal', options: [''] },
            { label: 'Hạn chế', key: 'temporomandibularJointSideLimit', options: ['Trái', 'Phải'] },
          ],
        },
        {
          label: 'Có tiếng kêu',
          key: 'temporomandibularJointNoise',
          options: [''],
          sub: [],
        },
        {
          label: 'Đau',
          key: 'temporomandibularJointPain',
          options: [''],
          sub: [],
        },
      ],
    },
    {
      title: 'Môi',
      options: [
        {
          label: 'Hai môi khép kín',
          key: 'closedlips',
          options: ['Thư giãn', 'Không thư giãn'],
          sub: [],
        },
        {
          label: 'Không khép kín',
          key: 'noClosedlips',
          options: [''],
          sub: [],
        },
        {
          label: 'Tính cưỡng cơ môi',
          key: 'lipMuscleCompulsion',
          options: ['Bình thường', 'Thiểu năng', 'Cương cơ (môi ngắn)'],
          sub: [],
        },
        {
          label: 'Thắng môi bám thấp',
          key: 'lipLowGrip',
          options: ['Hàm trên', 'Hàm dưới', 'Không có'],
          sub: [],
        },
        {
          label: 'Lưỡi',
          key: 'tongue',
          options: ['Lưỡi lớn', 'Lưỡi để thấp', 'Đẩy lưỡi'],
          sub: [],
        },
        {
          label: 'Amydal',
          key: 'amydal',
          options: ['Bình thường', 'Kích thước lớn, có vấn đề'],
          sub: [],
        },
        {
          label: 'Dạng mọc răng',
          key: 'teethingForm',
          options: ['Bình thường', 'Sớm', 'Trễ'],
          sub: [],
        },
        {
          label: 'Thói quen',
          key: 'habit',
          options: [
            'Cắn môi',
            'Mút tay',
            'Thở miệng',
            'Chống cằm hoặc chống tay lên mặt',
            'Khác: ',
          ],
          sub: [],
        },
        {
          label: 'Vệ sinh răng miệng',
          key: 'dentalHygiene',
          options: ['Tốt', 'Khá', 'Trung bình', 'Kém'],
          sub: [],
        },
      ],
    },
  ],
}

const PLAN_CONTENT = [
  { label: 'Máng nhai', key: 'chewingtrough', options: [''] },
  { label: 'Khí cụ chức năng', key: 'instruments', options: [''] },
  {
    label: 'Phẫu thuật',
    options: [],
    sub: [
      { label: 'ASO', key: 'surgeryASO', options: ['Hàm trên', 'Hàm dưới', 'Hai hàm'] },
      { label: 'BSSO', key: 'surgeryBSSO', options: [''] },
      { label: 'Lefort', key: 'surgeryLefort', options: [''] },
      { label: 'Corticotomy', key: 'surgeryCorticotomy', options: [''] },
      { label: 'Phẫu thuật tạo hình cằm', key: 'surgeryChinPlastic', options: [''] },
    ],
  },
  { label: 'Không phẫu thuật', key: 'noSurgery', options: ['Nhổ răng', 'Không nhổ răng'] },
  { label: 'Loại mắc cài', key: 'bracesType', options: ['Kim loại', 'Sứ', 'Mặt lưỡi'] },
]

const DESEASE_CLASSIFY = [
  '1', '1.a', '2', '2.a', '3', '3.a', '4', '4.a'
]