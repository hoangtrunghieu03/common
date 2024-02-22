import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceNull'
})
export class ConvertNullPipe implements PipeTransform {

  transform(data: string | number): any {
    return (data || data === 0)  ? data : '--';
  }

}