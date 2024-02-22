import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterName'
})
export class FilterWidthProNamePipe implements PipeTransform {

  transform(data: any, param: any, colName: string): any {
    if (param) {
      return data?.filter(val => val[colName]?.toLowerCase().includes(param?.toLowerCase().replace(/\s+/g,' ').trim()))
    } else {
      return data;
    }
  }

}