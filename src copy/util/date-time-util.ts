import {Injectable} from "@angular/core";
import * as moment from 'moment';

@Injectable()
export class DateTimeUtil {

  static submissionDisplayedTime(date) {
    return moment(date).format('dddd, MMMM DD[th] YYYY')
  }
}
