import BraceExamination from '../../../../../at-common/model/BraceExamination';

const getValueByArray = (data) => {
  if (!data || data.length == 0) return null;
  let dataValue: any = null;
  data.forEach((element, index) => {
    if (index == 0) {
      dataValue = element;
    } else {
      dataValue = dataValue + ', ' + element;
    }
  });
  return dataValue;
}

export const onLoadOrthopedicContent = (braceExaminationData: BraceExamination) => {
  let orthopedic: any[] = [];

  // Tiền sử y khoa
  if (braceExaminationData?.orthopedicCase.medicalHistory && braceExaminationData?.orthopedicCase.medicalHistory.length !== 0) {
    orthopedic.push(
      { label: 'Tiền sử y khoa', value: getValueByArray(braceExaminationData?.orthopedicCase.medicalHistory) }
    );
  }

  // Bản thân
  let firstValue: { label: any, group: any[] } = { label: 'Tiền sử nha khoa', group: [] };

  if (braceExaminationData?.orthopedicCase.dentalHygiene && braceExaminationData?.orthopedicCase.dentalHygiene.length !== 0) {
    firstValue.group.push(
      {
        label: 'Vệ sinh răng miệng',
        value: getValueByArray(braceExaminationData?.orthopedicCase.dentalHygiene),
      }
    )
  }

  if (braceExaminationData?.orthopedicCase.personalHistory && braceExaminationData?.orthopedicCase.personalHistory.length !== 0) {
    firstValue.group.push(
      {
        label: 'Tiền sử nha khoa',
        value: getValueByArray(braceExaminationData?.orthopedicCase.personalHistory),
      }
    )
  }

  orthopedic.push(firstValue);

  //Gia đình
  if (braceExaminationData?.orthopedicCase.teeth && braceExaminationData?.orthopedicCase.teeth.length !== 0) {
    orthopedic.push(
      {
        label: 'Gia đình',
        group: [
          {
            label: 'Tiền sử gia đình',
            value: getValueByArray(braceExaminationData?.orthopedicCase.teeth),
          }
        ]
      },
    );
  }
  return orthopedic;
}

export const onLoadExamineContent = (braceExaminationData: BraceExamination) => {
  let firstValue: { label: any, group: any[] } = { label: 'Nhìn thẳng', group: [] };

  // Hình dạng mặt
  if ((braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshape &&
    braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshape.length !== 0) ||
    braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshapeBlance ||
    (braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshapeNotBlance &&
      braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshapeNotBlance.length !== 0)) {
    firstValue.group.push(
      {
        label: 'Hình dạng mặt',
        value: (getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshape) ?
          getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshape) + ', ' : '') +
          (braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshapeBlance ? 'Cân đối, ' : '') +
          (getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshapeNotBlance) ?
            'Không cân đối: ' + getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.faceshapeNotBlance) : ''),
      }
    )
  }

  // Cười
  if ((braceExaminationData?.braceExaminationCheck?.surfaceLook?.laughBlance) ||
    (braceExaminationData?.braceExaminationCheck?.surfaceLook?.laughNotBlance && braceExaminationData?.braceExaminationCheck?.surfaceLook?.laughNotBlance.length !== 0) ||
    (braceExaminationData?.braceExaminationCheck?.surfaceLook?.smile && braceExaminationData?.braceExaminationCheck?.surfaceLook?.smile.length !== 0) ||
    (braceExaminationData?.braceExaminationCheck?.surfaceLook?.breakCorridor && braceExaminationData?.braceExaminationCheck?.surfaceLook?.breakCorridor.length !== 0)) {
    firstValue.group.push(
      {
        label: 'Cười',
        value: (braceExaminationData?.braceExaminationCheck?.surfaceLook?.laughBlance ? 'Cân đối, ' : '') +
          (getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.laughNotBlance) ?
            'Không cân đối: ' + (getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.laughNotBlance) + ', ') : '') +
          (getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.smile) ? (
            'Nụ cười: ' + getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.smile) + ', ') : '') +
          (getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.breakCorridor) ? (
            'Ngắt hành lang: ' + getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.breakCorridor)
          ) : '')
      }
    )
  }

  // Môi
  if (braceExaminationData?.braceExaminationCheck?.surfaceLook?.lip && braceExaminationData?.braceExaminationCheck?.surfaceLook?.lip.length !== 0) {
    firstValue.group.push(
      {
        label: 'Môi',
        value: getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceLook?.lip),
      }
    )
  }

  // Hai tầng mặt
  let secondValue: { label: any, group: any[] } = { label: 'Nhìn nghiêng', group: [] };
  if (braceExaminationData?.braceExaminationCheck?.surfaceEdentulousness?.layerBlance ||
    (braceExaminationData?.braceExaminationCheck?.surfaceEdentulousness?.layerNotBlance &&
      braceExaminationData?.braceExaminationCheck?.surfaceEdentulousness?.layerNotBlance.length !== 0)) {
    secondValue.group.push(
      {
        label: 'Hai tầng mặt',
        value: (braceExaminationData?.braceExaminationCheck?.surfaceEdentulousness?.layerBlance ? 'Cân đối, ' : '') +
          (getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceEdentulousness?.layerNotBlance) ?
            'Không cân đối: ' + getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceEdentulousness?.layerNotBlance) + ', ' : ''),
      }
    )
  }

  // Hình dạng mặt
  if (braceExaminationData?.braceExaminationCheck?.surfaceEdentulousness?.faceshape &&
    braceExaminationData?.braceExaminationCheck?.surfaceEdentulousness?.faceshape.length !== 0) {
    secondValue.group.push(
      {
        label: 'Hình dạng mặt',
        value: getValueByArray(braceExaminationData?.braceExaminationCheck?.surfaceEdentulousness?.faceshape),
      }
    )
  }

  // Cằm
  if (braceExaminationData?.braceExaminationCheck?.chin && braceExaminationData?.braceExaminationCheck?.chin.length !== 0) {
    return [
      firstValue,
      secondValue,
      {
        label: 'Cằm',
        group: null,
        value: getValueByArray(braceExaminationData?.braceExaminationCheck?.chin)
      }
    ];
  }

  return [firstValue, secondValue];
}

export const onLoadOralExamineContent = (braceExaminationData: BraceExamination) => {
  let firstValue: { label: any, group: any[] } = { label: 'Hàm trên', group: [] };
  if (braceExaminationData?.braceExaminationCheckMount?.toothCheckAboveShape && braceExaminationData?.braceExaminationCheckMount?.toothCheckAboveShape.length !== 0) {
    firstValue.group.push(
      {
        label: 'Hình dáng',
        value: getValueByArray(braceExaminationData?.braceExaminationCheckMount?.toothCheckAboveShape),
      }
    )
  }
  if (braceExaminationData?.braceExaminationCheckMount?.toothCheckAboveBackteeth && braceExaminationData?.braceExaminationCheckMount?.toothCheckAboveBackteeth.length !== 0) {
    firstValue.group.push(
      {
        label: 'Răng sau',
        value: getValueByArray(braceExaminationData?.braceExaminationCheckMount?.toothCheckAboveBackteeth),
      }
    )
  }

  let secondValue: { label: any, group: any[] } = { label: 'Hàm dưới', group: [] };
  if (braceExaminationData?.braceExaminationCheckMount?.toothCheckBellowShape && braceExaminationData?.braceExaminationCheckMount?.toothCheckBellowShape.length !== 0) {
    secondValue.group.push(
      {
        label: 'Hình dáng',
        value: getValueByArray(braceExaminationData?.braceExaminationCheckMount?.toothCheckBellowShape),
      }
    )
  }
  if (braceExaminationData?.braceExaminationCheckMount?.toothCheckBellowBackteeth && braceExaminationData?.braceExaminationCheckMount?.toothCheckBellowBackteeth.length !== 0) {
    secondValue.group.push(
      {
        label: 'Răng sau',
        value: getValueByArray(braceExaminationData?.braceExaminationCheckMount?.toothCheckBellowBackteeth),
      }
    )
  }

  let thirdValue: { label: any, group: any[] } = { label: 'Phân tích mẫu hàm', group: [] };
  if (braceExaminationData?.braceExaminationCheckMount?.analyticPartern?.uald) {
    thirdValue.group.push(
      {
        label: 'U - ALD',
        value: braceExaminationData?.braceExaminationCheckMount?.analyticPartern?.uald,
      }
    )
  }
  if (braceExaminationData?.braceExaminationCheckMount?.analyticPartern?.lald) {
    thirdValue.group.push(
      {
        label: 'L - ALD',
        value: braceExaminationData?.braceExaminationCheckMount?.analyticPartern?.lald,
      }
    )
  }
  if (braceExaminationData?.braceExaminationCheckMount?.analyticPartern?.bolton) {
    thirdValue.group.push(
      {
        label: 'Bolton',
        value: braceExaminationData?.braceExaminationCheckMount?.analyticPartern?.bolton,
      }
    )
  }


  let oralExamineContent = { jaw: [firstValue, secondValue], analysis: [thirdValue] };

  if (getValueByArray(braceExaminationData?.braceExaminationCheckMount?.toothCheckAbove)) {
    braceExaminationData?.braceExaminationCheckMount?.toothCheckAbove.forEach((element, index) => {
      if (element == 'Hình dáng' || element == 'Răng sau') return;
      let data = { label: element, value: '', };
      oralExamineContent.jaw[0].group.splice(index + 1, 0, data);
    });
  }

  if (getValueByArray(braceExaminationData?.braceExaminationCheckMount?.toothCheckBellow)) {
    -
      braceExaminationData?.braceExaminationCheckMount?.toothCheckBellow.forEach((element, index) => {
        if (element == 'Hình dáng' || element == 'Răng sau') return;
        let data = { label: element, value: '', };
        oralExamineContent.jaw[1].group.splice(index + 1, 0, data);
      });
  }
  return oralExamineContent;
}

export const onLoadJawBeforeContent = (braceExaminationData: BraceExamination) => {
  let jawBeforeContent: { front: any[], side: any[] } = { front: [], side: [] };

  // Phía trước
  let firstValue: { label: any, data: any[] } = { label: 'Phía trước', data: [] };
  if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontCoverage && braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontCoverage.length !== 0) {
    firstValue.data.push(
      {
        label: 'Độ cắn phủ',
        options: [
          { label: getValueByArray(braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontCoverage), options: [] },
        ],
      }
    )
  }

  // Đường giữa
  let firstValueSub: { label: any, sub: any[] } = { label: 'Đường giữa', sub: [] };
  if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianDuplicate && braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianDuplicate.length !== 0) {
    firstValueSub.sub.push(
      {
        label: 'Trùng nhau',
        sub: [
          { label: getValueByArray(braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianDuplicate), options: [] },
        ]
      }
    )
  }
  if ((braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateAbove &&
    braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateAbove.length !== 0) ||
    (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateBellow &&
      braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateBellow.length !== 0)) {

    let firstValueSubSub: { label: any, sub: any[] } = { label: 'Không trùng nhau', sub: [] };
    if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateAbove &&
      braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateAbove.length !== 0) {
        firstValueSubSub.sub.push(
        { label: 'Hàm trên', options: braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateAbove }
      )
    }
    if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateBellow &&
      braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateBellow.length !== 0) {
        firstValueSubSub.sub.push(
        { label: 'Hàm dưới', options: braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontMedianNoDuplicateBellow }
      )
    }
    firstValueSub.sub.push(firstValueSubSub);
  }

  firstValue.data.push(firstValueSub); // Đường giữa

  // Răng sau
  if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontBackCover ||
    (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontBackCross &&
      braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontBackCross.length !== 0)) {

    let firstValueSubSub: { label: any, options: any[] } = { label: 'Răng sau', options: [] };
    if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontBackCover) {
      firstValueSubSub.options.push(
        { label: braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontBackCover ? 'Cắn phủ' : '', options: [] }
      )
    }
    if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontBackCross &&
      braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontBackCross.length !== 0) {
      firstValueSubSub.options.push(
        { label: 'Cắn chéo', options: braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontBackCross }
      )
    }
    firstValue.data.push(firstValueSubSub);
  }

  // Xương ổ răng hai bên
  if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontAlveolarBone && braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontAlveolarBone.length !== 0) {
    firstValue.data.push(
      {
        label: 'Xương ổ răng hai bên',
        options: [
          { label: getValueByArray(braceExaminationData?.braceExaminationCheckMount?.correlationTeethFrontAlveolarBone), options: [] },
        ],
      }
    );
  }

  jawBeforeContent.front.push(firstValue); // Phía trước

  // Phía bên
  let secondValue: { label: any, data: any[] } = { label: 'Phía bên', data: [] };
  if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethSideAlignment && braceExaminationData?.braceExaminationCheckMount?.correlationTeethSideAlignment.length !== 0) {
    secondValue.data.push(
      {
        label: 'Độ cắn chìa',
        options: [
          { label: getValueByArray(braceExaminationData?.braceExaminationCheckMount?.correlationTeethSideAlignment), options: [] },
        ],
      }
    );
  }

  // Đường cong Spee
  if (braceExaminationData?.braceExaminationCheckMount?.correlationTeethSideSpee && braceExaminationData?.braceExaminationCheckMount?.correlationTeethSideSpee.length !== 0) {
    secondValue.data.push(
      {
        label: 'Đường cong Spee',
        options: braceExaminationData?.braceExaminationCheckMount?.correlationTeethSideSpee ? [
          { label: getValueByArray(braceExaminationData?.braceExaminationCheckMount?.correlationTeethSideSpee), options: [] },
        ] : [],
      }
    );
  }

  jawBeforeContent.side.push(secondValue);
  return jawBeforeContent;
}

export const onLoadFunctionContent = (braceExaminationData: BraceExamination) => {
  let firstValue: { label: any, data: any[] } = { label: 'Khớp thái dương hàm', data: [] };

  // Hướng đóng mở hàm dưới
  if (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveStraight ||
    (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveDeviated &&
      braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveDeviated.length !== 0) ||
    braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveZigzag) {
    let firstValueSub: { label: any, options: any[] } = { label: 'Hướng đóng mở hàm dưới', options: [] };
    if (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveStraight) {
      firstValueSub.options.push(
        { label: braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveStraight ? 'Thẳng' : null, options: null }
      )
    }

    // Lệch
    if (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveDeviated &&
      braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveDeviated.length !== 0) {
      firstValueSub.options.push(
        { label: 'Lệch', options: braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveDeviated }
      )
    }

    // Dích dắc
    if (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveZigzag) {
      firstValueSub.options.push(
        { label: braceExaminationData?.braceExaminationFuntional?.temporomandibularJointAboveZigzag ? 'Dích dắc' : null, options: null }
      )
    }

    firstValue.data.push(firstValueSub);
  }

  // Cử động hàm dưới sang bên
  if (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointSideNormal ||
    (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointSideLimit &&
      braceExaminationData?.braceExaminationFuntional?.temporomandibularJointSideLimit.length !== 0)) {
    let firstValueSub: { label: any, options: any[] } = { label: 'Cử động hàm dưới sang bên', options: [] };
    if (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointSideNormal) {
      firstValueSub.options.push(
        { label: braceExaminationData?.braceExaminationFuntional?.temporomandibularJointSideNormal ? 'Bình thường' : null, options: null }
      )
    }

    if (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointSideLimit &&
      braceExaminationData?.braceExaminationFuntional?.temporomandibularJointSideLimit.length !== 0) {
      firstValueSub.options.push(
        { label: 'Hạn chế', options: braceExaminationData?.braceExaminationFuntional?.temporomandibularJointSideLimit }
      )
    }

    firstValue.data.push(firstValueSub);
  }

  // Có tiếng kêu
  if (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointNoise) {
    firstValue.data.push(
      {
        label: braceExaminationData?.braceExaminationFuntional?.temporomandibularJointNoise ? 'Có tiếng kêu' : null,
        boolean: true
      }
    )
  }

  // Đau
  if (braceExaminationData?.braceExaminationFuntional?.temporomandibularJointPain) {
    firstValue.data.push(
      {
        label: braceExaminationData?.braceExaminationFuntional?.temporomandibularJointPain ? 'Đau' : null,
        boolean: true
      }
    )
  }

  // Môi
  let secondValue: { label: any, data: any[] } = { label: 'Môi', data: [] };
  // Hai môi khép kín
  if (braceExaminationData?.braceExaminationFuntional?.closedlips && braceExaminationData?.braceExaminationFuntional?.closedlips.length !== 0) {
    secondValue.data.push(
      {
        label: 'Hai môi khép kín',
        options: [{ label: getValueByArray(braceExaminationData?.braceExaminationFuntional?.closedlips), options: [] }]
      }
    )
  }

  // Không khép kín
  if (braceExaminationData?.braceExaminationFuntional?.noClosedlips) {
    secondValue.data.push(
      {
        label: braceExaminationData?.braceExaminationFuntional?.noClosedlips ? 'Không khép kín' : null,
        boolean: true
      }
    )
  }

  // Tính cưỡng cơ môi
  if (braceExaminationData?.braceExaminationFuntional?.lipMuscleCompulsion && braceExaminationData?.braceExaminationFuntional?.lipMuscleCompulsion.length !== 0) {
    secondValue.data.push(
      {
        label: 'Tính cưỡng cơ môi',
        options: [{ label: getValueByArray(braceExaminationData?.braceExaminationFuntional?.lipMuscleCompulsion), options: [] }]
      }
    )
  }

  // Thắng môi bám thấp
  if (braceExaminationData?.braceExaminationFuntional?.lipLowGrip && braceExaminationData?.braceExaminationFuntional?.lipLowGrip.length !== 0) {
    secondValue.data.push(
      {
        label: 'Thắng môi bám thấp',
        options: [{ label: getValueByArray(braceExaminationData?.braceExaminationFuntional?.lipLowGrip), options: [] }]
      }
    )
  }

  // Lưỡi
  if (braceExaminationData?.braceExaminationFuntional?.tongue && braceExaminationData?.braceExaminationFuntional?.tongue.length !== 0) {
    secondValue.data.push(
      {
        label: 'Lưỡi',
        options: [{ label: getValueByArray(braceExaminationData?.braceExaminationFuntional?.tongue), options: [] }]
      }
    )
  }

  // Amydal
  if (braceExaminationData?.braceExaminationFuntional?.amydal && braceExaminationData?.braceExaminationFuntional?.amydal.length !== 0) {
    secondValue.data.push(
      {
        label: 'Amydal',
        options: [{ label: getValueByArray(braceExaminationData?.braceExaminationFuntional?.amydal), options: [] }]
      }
    )
  }

  // Dạng mọc răng
  if (braceExaminationData?.braceExaminationFuntional?.teethingForm && braceExaminationData?.braceExaminationFuntional?.teethingForm.length !== 0) {
    secondValue.data.push(
      {
        label: 'Dạng mọc răng',
        options: [{ label: getValueByArray(braceExaminationData?.braceExaminationFuntional?.teethingForm), options: [] }]
      }
    )
  }

  // Thói quen
  if (braceExaminationData?.braceExaminationFuntional?.habit && braceExaminationData?.braceExaminationFuntional?.habit.length !== 0) {
    secondValue.data.push(
      {
        label: 'Thói quen',
        options: [{ label: getValueByArray(braceExaminationData?.braceExaminationFuntional?.habit), options: [] }]
      }
    )
  }

  // Vệ sinh răng miệng
  if (braceExaminationData?.braceExaminationFuntional?.dentalHygiene && braceExaminationData?.braceExaminationFuntional?.dentalHygiene.length !== 0) {
    secondValue.data.push(
      {
        label: 'Vệ sinh răng miệng',
        options: [{ label: getValueByArray(braceExaminationData?.braceExaminationFuntional?.dentalHygiene), options: [] }]
      }
    )
  }

  return [firstValue, secondValue];
}

export const onLoadPlanContent = (braceExaminationData: BraceExamination) => {
  let planContent: any[] = [];
  if (braceExaminationData?.braceExaminationPlan?.chewingtrough) {
    planContent.push(
      {
        label: braceExaminationData?.braceExaminationPlan?.chewingtrough ? 'Máng nhai' : null,
      }
    )
  }
  if (braceExaminationData?.braceExaminationPlan?.instruments) {
    planContent.push(
      {
        label: braceExaminationData?.braceExaminationPlan?.instruments ? 'Khí cụ chức năng' : null,
      }
    )
  }
  if (braceExaminationData?.braceExaminationPlan?.fixedInstrument && braceExaminationData?.braceExaminationPlan?.fixedInstrument.length !== 0) {
    planContent.push(
      {
        label: 'Khí cụ cố định',
        options: [
          { label: getValueByArray(braceExaminationData?.braceExaminationPlan?.fixedInstrument), options: [] },
        ],
      }
    )
  }
  let firstValue: { label: any, sub: any[] } = { label: 'Phẫu thuật', sub: [] };
  if (braceExaminationData?.braceExaminationPlan?.surgeryASO && braceExaminationData?.braceExaminationPlan?.surgeryASO.length !== 0) {
    firstValue.sub.push(
      {
        label: 'ASO',
        sub: [
          { label: getValueByArray(braceExaminationData?.braceExaminationPlan?.surgeryASO), options: [] },
        ],
      }
    )
  }
  if (braceExaminationData?.braceExaminationPlan?.surgeryBSSO) {
    firstValue.sub.push(
      {
        label: braceExaminationData?.braceExaminationPlan?.surgeryBSSO ? 'BSSO' : null,
      }
    )
  }
  if (braceExaminationData?.braceExaminationPlan?.surgeryLefort) {
    firstValue.sub.push(
      {
        label: braceExaminationData?.braceExaminationPlan?.surgeryLefort ? 'Lefort' : null,
      }
    )
  }
  if (braceExaminationData?.braceExaminationPlan?.surgeryCorticotomy) {
    firstValue.sub.push(
      {
        label: braceExaminationData?.braceExaminationPlan?.surgeryCorticotomy ? 'Corticotomy' : null,
      }
    )
  }
  if (braceExaminationData?.braceExaminationPlan?.surgeryChinPlastic) {
    firstValue.sub.push(
      {
        label: braceExaminationData?.braceExaminationPlan?.surgeryChinPlastic ? 'Phẫu thuật tạo hình cằm' : null,
      }
    )
  }
  planContent.push(firstValue);

  if (braceExaminationData?.braceExaminationPlan?.noSurgery && braceExaminationData?.braceExaminationPlan?.noSurgery.length !== 0) {
    planContent.push(
      {
        label: 'Không phẫu thuật',
        options: [
          { label: getValueByArray(braceExaminationData?.braceExaminationPlan?.noSurgery), options: [] },
        ],
      }
    )
  }
  if (braceExaminationData?.braceExaminationPlan?.bracesType && braceExaminationData?.braceExaminationPlan?.bracesType.length !== 0) {
    planContent.push(
      {
        label: 'Loại mắc cài',
        options: [
          { label: getValueByArray(braceExaminationData?.braceExaminationPlan?.bracesType), options: [] },
        ],
      }
    )
  }
  return planContent;
}