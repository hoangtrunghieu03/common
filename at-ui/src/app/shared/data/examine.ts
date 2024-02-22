import ColumnDef from '../components/at-base-table/at-base-table.component';
import ColDef from '../components/at-table/at-table.component';

export const SERVICE_OPTION = [
    { label: 'Niềng răng', value: 'Niềng răng' },
    { label: 'Tổng quát', value: 'Tổng quát' },
]

export const GENERAL = [
    {
        code: 'BN123',
        fullName: 'Nguyễn Văn Linh',
        birthDate: '2000-04-05T15:51:57.000Z',
        address: 'Quảng Nam',
        tel: '1231231',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Phớ',
        birthDate: '1989-03-10T15:51:57.000Z',
        address: 'Quảng Nam',
        tel: '1231231',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Leo',
        birthDate: '1993-03-01T15:51:57.000Z',
        address: 'Quảng Nam',
        tel: '1231231',
    },
];

export enum GENERAL_FILTER {
    sex = 'Giới tính',
    month = 'Tháng sinh',
    area = 'Khu vực',
    room = 'Phòng chuyển đến',
    status = 'Trạng thái',
}

export enum GFILTER {
    room = 'Phòng chuyển đến',
}

export enum MEDICAL_STATUS {
    NONE_EXAMINING = 'Đang đợi khám',
    EXAMINING_FINISH = 'Hoàn thành khám',
}

export const PATIENT_OPTION = [
    {
        label: 'Lý do đến khám',
        key: 'reason',
        value: [
            { label: 'Đau răng', value: 'Đau răng', class: 'col-3' },
            { label: 'Mất răng', value: 'Mất răng', class: 'col-3' },
            { label: 'Buốt răng', value: 'Buốt răng', class: 'col-3' },
            { label: 'Chảy máu chân răng', value: 'Chảy máu chân răng', class: 'col-3' },
            { label: 'Gãy răng', value: 'Gãy răng', class: 'col-3' },
            { label: 'Răng lung lay', value: 'Răng lung lay', class: 'col-3' },
            { label: 'Khác: ', value: 'Khác: ', class: 'col-6', input: true, isInput: true },
        ],
    },
    {
        label: 'Bệnh sử y khoa',
        key: 'medicalHistory',
        value: [
            { label: 'Bệnh đông chảy máu', value: 'Bệnh đông chảy máu', class: 'col-3' },
            { label: 'Tim mạch', value: 'Tim mạch', class: 'col-3' },
            { label: 'Huyết áp TD/TT', value: 'Huyết áp TD/TT', class: 'col-3' },
            { label: 'Gan, thận', value: 'Gan, thận', class: 'col-3' },
            { label: 'Phổi', value: 'Phổi', class: 'col-3' },
            { label: 'Tiểu đường', value: 'Tiểu đường', class: 'col-3' },
            { label: 'Ung thư (xạ trị)', value: 'Ung thư (xạ trị)', class: 'col-3' },
            { label: 'Dị ứng kháng sinh hoặc thuốc: ', value: 'Dị ứng kháng sinh hoặc thuốc: ', class: 'col-6', input: true },
            { label: 'Khác: ', value: 'Khác: ', class: 'col-6', input: true, isInput: true },
        ],
    },
    {
        label: 'Tiền sử bản thân',
        key: 'personalHistory',
        value: [
            { label: 'Hút thuốc', value: 'Hút thuốc', class: 'col-3' },
            { label: 'Nghiện rượu', value: 'Nghiện rượu', class: 'col-3' },
            { label: 'Ma túy', value: 'Ma túy', class: 'col-3' },
            { label: 'Khác: ', value: 'Khác: ', class: 'col-3', input: true, isInput: true },
        ],
    },
];

export const SERVICE_COLDEF: Array<ColumnDef> = [
    {
        label: 'ID',
        title: '_id',
        colType: '',
        style: 'text-align: center',
        headerStyle: 'text-align: center',
        canUpdate: false,
        fieldUpdate: null,
        updateType: null,
    },
    {
        label: 'Tên dịch vụ',
        title: 'serviceName',
        colType: '',
        style: 'text-align: center',
        headerStyle: 'text-align: center',
        canUpdate: false,
        fieldUpdate: null,
        updateType: null,
    },
];

export const SERVICE_ITEM_DATA = [
    { _id: 1, serviceName: 'Găng tay vô trùng' },
    { _id: 2, serviceName: 'Chỉ nha khoa' },
    { _id: 1, serviceName: 'Bột làm trắng răng' },
];

export const TREAMENT_COLDEF: Array<ColDef> = [
    {
        name: 'Ngày',
        prop: 'date',
        width: 100,
        colType: 'date',
        styleHeader: '',
        styleBody: '',
        router: false,
        path: '',
    },
    {
        name: 'Thực hành y lệnh',
        prop: 'code',
        width: 100,
        colType: '',
        styleHeader: '',
        styleBody: '',
        router: false,
        path: '',
    },
    {
        name: 'Ghi chú',
        prop: 'note',
        width: 100,
        colType: '',
        styleHeader: '',
        styleBody: '',
        router: false,
        path: '',
    },
    {
        name: 'Người thực hiện',
        prop: 'performer',
        width: 100,
        colType: '',
        styleHeader: '',
        styleBody: '',
        router: false,
        path: '',
    },
];

export const TREAMENT_ITEM_DATA = [
    {
        date: '1989-03-10T15:51:57.000Z',
        relize: null,
        note: null,
        doctor: 'Lê Ngọc Tuấn',
    },
    {
        date: '1989-03-10T15:51:57.000Z',
        relize: null,
        note: null,
        doctor: 'Lê Ngọc Tuấn',
    },
];

export const DESIGNAT = [
    {
        code: 'BN123',
        fullName: 'Nguyễn Văn Linh',
        birthDate: '2000-04-05T15:51:57.000Z',
        room: 'Tiếp tân',
        designator: 'Lê Ngọc Tuấn',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Phớ',
        birthDate: '1989-03-10T15:51:57.000Z',
        room: 'Tiếp tân',
        designator: 'Lê Ngọc Tuấn',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Leo',
        birthDate: '1993-03-01T15:51:57.000Z',
        room: 'Tiếp tân - Tổng quát - Implant',
        designator: 'Lê Ngọc Tuấn',
    },
];

export const MINORSURGERY = [
    {
        code: 'BN123',
        fullName: 'Nguyễn Văn Linh',
        birthDate: '2000-04-05T15:51:57.000Z',
        room: 'Tiếp tân',
        inplaTrick: 'Nhổ răng',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Phớ',
        birthDate: '1989-03-10T15:51:57.000Z',
        room: 'Tiếp tân',
        inplaTrick: 'Cắt lợi thẩm mỹ',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Leo',
        birthDate: '1993-03-01T15:51:57.000Z',
        room: 'Tiếp tân - Tổng quát - Implant',
        inplaTrick: 'Cấy implant',
    },
];

export const IMPLANT = [
    {
        code: 'BN123',
        fullName: 'Nguyễn Văn Linh',
        birthDate: '2000-04-05T15:51:57.000Z',
        address: 'Đà Nẵng',
        tel: '058546465',
        doctor: 'Nguyễn Văn Linh',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Phớ',
        birthDate: '1989-03-10T15:51:57.000Z',
        address: 'Hội An, Quảng Nam',
        tel: '058546465',
        doctor: 'Lê Ngọc Tuấn',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Leo',
        birthDate: '1993-03-01T15:51:57.000Z',
        address: 'Điện Bàn, Quảng Nam',
        tel: '058546465',
        doctor: 'Lê Ngọc Tấn',
    },
];

export const SERVICE_DESIGNATE_COLDEF: Array<ColumnDef> = [
    {
        label: 'ID',
        title: 'id',
        colType: '',
        style: 'width: 10%',
        headerStyle: 'width: 10%',
        canUpdate: false,
        fieldUpdate: null,
        updateType: null,
    },
    {
        label: 'Tên dịch vụ',
        title: 'serviceName',
        colType: '',
        style: 'text-align: center;width: 30%',
        headerStyle: 'text-align: center;width: 25%',
        canUpdate: false,
        fieldUpdate: null,
        updateType: null,
    },
    {
        label: 'Giá dịch vụ',
        title: 'priceService',
        colType: 'money',
        style: 'text-align: center; width: 15%',
        headerStyle: 'text-align: center; width: 15%',
        canUpdate: false,
        fieldUpdate: null,
        updateType: null,
    },
    {
        label: 'Người thực hiện',
        title: 'staff',
        colType: '',
        style: 'text-align: center;width: 25%',
        headerStyle: 'text-align: center;width: 25%',
        canUpdate: false,
        fieldUpdate: null,
        updateType: null,
    },
    {
        label: 'Trạng thái',
        title: 'status',
        colType: '',
        style: 'text-align: center;width: 20%',
        headerStyle: 'text-align: center;width: 15%',
        canUpdate: false,
        fieldUpdate: null,
        updateType: null,
    },
];

export const RECEPTION = [
    {
        code: 'BN123',
        fullName: 'Nguyễn Văn Linh',
        birthDate: '2000-04-05T15:51:57.000Z',
        address: 'Hội An',
        tel: '0981482328',
        service: 'Implant',
    },
    {
        code: 'BN456',
        fullName: 'Dàn A Phớ',
        birthDate: '1989-03-10T15:51:57.000Z',
        address: 'Quảng Nam',
        tel: '0981482328',
        service: 'Niềng răng',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Leo',
        birthDate: '1993-03-01T15:51:57.000Z',
        address: 'Đà Nẵng',
        tel: '0981482328',
        service: 'Tổng quát',
    },
];

export const BRACES = [
    {
        code: 'BN123',
        fullName: 'Nguyễn Văn Linh',
        birthDate: '2000-04-05T15:51:57.000Z',
        address: 'Hội An',
        tel: '0981482328',
        doctor: 'Lê Ngọc Tuấn',
    },
    {
        code: 'BN456',
        fullName: 'Dàn A Phớ',
        birthDate: '1989-03-10T15:51:57.000Z',
        address: 'Quảng Nam',
        tel: '0981482328',
        doctor: 'Nguyễn Văn Linh',
    },
    {
        code: 'BN123',
        fullName: 'Dàn A Leo',
        birthDate: '1993-03-01T15:51:57.000Z',
        address: 'Đà Nẵng',
        tel: '0981482328',
        doctor: 'In To The SKy',
    },
];

export const PICTURE = [
    {
        label: 'Hình ảnh', images: [
            'data:image/jpeg;base64,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',
            'https://img.lostbird.vn/2018/05/09/173947/5.jpg'
        ]
    },
    {
        label: 'CT', images: [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJGjdut-OhTlAlWHRKaCp9m8BX_MmDA6_z_kSUiNbYWbn8L6HmaGrwP6rd4jZJknfsT9M&usqp=CAU',
            'https://cdn.onshop.asia/images/zimpet/cho-meo-tu-suong1.jpg'
        ]
    },
    {
        label: 'XQuang', images: [
            'https://s.blobla.com/data/img/20160113/73b19d14743d47029acf0401a8bd7896/e81a65af73614ebdaf35c6d429718c27.jpg',
            'https://files.giaoducthoidai.vn/Uploaded/yench/2016_01_02/anhmeoselfiegaybaoinstagramee24808b8a_HXOZ.jpg'
        ]
    },
  ]
