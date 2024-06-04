import {Pipe, PipeTransform} from "@angular/core";
import { formatDistanceToNow, parseISO } from 'date-fns';
import {fr} from "date-fns/locale";

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {
  transform(dateString: string): string {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr  });
  }
}
