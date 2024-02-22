import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, input: any): any {
    if (input) {
      return value?.filter(val => val.name.toLowerCase().includes(input.toLowerCase()))
    } else {
      return value;
    }
  }

}