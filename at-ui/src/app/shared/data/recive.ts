export const DESIGNAT_SERVICE = [
  {
    label: 'Chụp phim',
    value: [
      'Chụp Pano',
      'Chụp Cepha',
      'Chụp sọ thẳng',
      'Xương bàn tay',
      'Chụp CT',
    ],
    group: null,
    formName: 'firmShooting',
  },
  {
    label: 'Chụp hình',
    value: ['Hoàn thành', 'Theo dõi ', 'Trong miệng', 'Chân dung', 'Ngoài mặt'],
    group: null,
    formName: 'takePicture',
  },
  {
    label: 'Cung',
    value: [
      'Cung lún',
      'Cung dixa',
      'Cung vói',
      'Linqual-retractor',
      'Cung Slide',
      'Cối xay lúa',
      'Horse shoe',
      'Máng nhai',
      'Cung Nance',
      'Miếng dán răng',
      'Neo chặn nong hàm',
      'Tongue Elevator (Ali)',
    ],
    group: [
      {
        label: 'Cung lưỡi',
        value: ['3-3', '4-4', '5-5', '6-6', '6-6 có dixa'],
        formName: 'tongue',
      },
      {
        label: 'Cung khẩu cái',
        value: ['3-3', '4-4', '5-5', '6-6'],
        formName: 'palate',
      },
    ],
    formName: 'cung',
  },
  {
    label: 'Hàm Hook',
    value: null,
    group: [
      {
        label: 'Hàm trên giữa',
        value: ['2-3', '3-4', '4-5'],
        formName: 'upperJaw',
      },
      {
        label: 'Hàm dưới giữa', 
        value: ['2-3', '3-4', '4-5'],
        formName: 'lowerJaw' },
    ],
    formName: 'hook',
  },
  {
    label: 'Cung duy trì',
    value: [
      'Máng nhựa',
      'Cung Hawley',
      'Cung Wrap & Round',
      'Miếng dán duy trì HT',
      'Miếng dán duy trì HD',
    ],
    group: [
      {
        label: 'Cung lưỡi',
        value: ['3-3', '4-4'],
        formName: 'tongue',
      },
    ],
    formName: 'maintain',
  },
  {
    label: 'Khác',
    value: null,
    group: null,
    formName: 'other',
  },
];