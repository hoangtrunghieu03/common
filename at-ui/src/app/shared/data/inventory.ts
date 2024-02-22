
export const INVENTORY = [
    {
        code: 'VT1',
        name: 'Chỉ nha khoa',
        unit: 'Cái',
        quantity: 10,
        price: 100000,
        source: 'France',
        producerDate: '2000-04-05T15:51:57.000Z',
        expiry: '2000-04-05T15:51:57.000Z'
    },
    {
        code: 'VT2',
        name: 'Mắc cài',
        unit: 'Cái',
        quantity: 100,
        price: 100000,
        source: 'France',
        producerDate: '2000-04-05T15:51:57.000Z',
        expiry: '2000-04-05T15:51:57.000Z'
    },
    {
        code: 'VT3',
        name: 'Kim tiêm',
        unit: 'Cái',
        quantity: 100,
        price: 100000,
        source: 'France',
        producerDate: '2000-04-05T15:51:57.000Z',
        expiry: '2000-04-05T15:51:57.000Z'
    }
];

export const UNIT = [
    {label: 'Cái', value: 'Cái'},
    {label: 'Chiếc', value: 'Chiếc'}
]

export const SOURCE = [
    {label: 'France', value: 'France'},
    {label: 'Thailand', value: 'Thailand'},
    {label: 'VietNamese', value: 'VietNamese'},
    {label: 'Korea', value: 'Korea'},
]

export const INVENTORYHISTORY = [
    {createDate: '2000-04-05T15:51:57.000Z', quantity: 20, price: 10000, origin: 'France', producerDate: '2000-04-05T15:51:57.000Z', expiry: '2000-04-05T15:51:57.000Z', importer: 'Nguyễn Văn Linh'}
]

export const EQUIPMENT = [
    {
        name: 'Chỉ nha khoa',
        unit: 'Cái',
        quantity: 10,
        price: 100000,
        origin: 'France',
        date: '2000-04-05T15:51:57.000Z',
    }
];

export enum INVENTORY_EQUIPMENT {
    // origin = 'Nguồn gốc',
    date = 'Ngày nhập'
}

export enum INVENTORY_SUPPLY {
    expDate = 'Hạn sử dụng',
    room = 'Phòng',
    origin ='Đơn vị cung cấp',
    quantity = 'Số lượng'
}