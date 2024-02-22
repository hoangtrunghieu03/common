export const SEX_OPTION = ['Nam', 'Nữ']
export const SETTING_SERVICE = [
  {
    code: 'DV1',
    name: 'Trám răng',
    totalPrice: 1000000,
  },
  {
    code: 'DV2',
    name: 'Làm trắng răng',
    totalPrice: 1000000,
  },
  {
    code: 'DV3',
    name: 'Nhổ răng',
    totalPrice: 1000000,
  },
];

export const DATA_ACCESS = [
  { label: 'Tổng quan', group: [] },
  { label: 'Tiếp nhận', group: [] },
  { label: 'Hồ sơ khám bệnh', group: [] },
  { label: 'Lịch hẹn', group: [] },
  {
    label: 'Khám bệnh',
    group: [
      { label: 'Phòng tiếp tân', options: [] },
      { label: 'Phòng tổng quát', options: [] },
      { label: 'Phòng chỉ định', options: [] },
      { label: 'Phòng niền răng', options: [] },
      { label: 'Phòng tiểu phẫu', options: [] },
      { label: 'Phòng cấy implant', options: [] },
    ],
  },
  { label: 'Nhân viên', group: [] },
  { label: 'Quản lý kho', group: [] },
  {
    label: 'Báo cáo',
    group: [
      {
        label: 'Báo cáo doanh thu',
        options: ['Báo cáo tổng quan', 'Báo cáo nhân viên', 'Báo cáo dịch vụ'],
      },
      { label: 'Báo cáo hàng tồn', options: [] },
    ],
  },
  {
    label: 'Cài đặt',
    group: [
      { label: 'Dịch vụ', options: [] },
      { label: 'Combo dịch vụ', options: [] },
      { label: 'Chỉ định', options: [] },
      { label: 'Phân quyền', options: [] },
    ],
  },
];

export enum SERVICE_COMBO_FILTER {
  price = 'Giá'
}

export enum SERVICE_SETTING_FILTER {
  price = 'Giá',
  tagService = 'Nhóm dịch vụ'
}