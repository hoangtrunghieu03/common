export class ChartModel {
    data: Array<string | any> = []
    label: Array<string | number> = []
    option: any = null
    color: any[] = []
}

export interface FilterContent {
    condition: string,
    conditionSelect: string,
    value: string,
    from: string | number,
    to: string | number
}