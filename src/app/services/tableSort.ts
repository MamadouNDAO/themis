import { Pipe, PipeTransform } from '@angular/core';
import {Sort} from "@angular/material/sort";

@Pipe({
  name: 'tableSort'
})
export class TableSortPipe implements PipeTransform {
  transform(data: any[], sort: Sort): any[] {
    const active = sort.active;
    const direction = sort.direction;

    if (!active || direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const valueA = a.active;
      const valueB = b.active;

      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
