import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment'

@Injectable({
  providedIn: 'root'
})
export class DatetimeService {

  private _installDate: Date;
  private _todayDate: Date;
  private _selectedDate: BehaviorSubject<Date>;

  constructor() { 

    this._selectedDate = new BehaviorSubject<Date>(this.getCurrentDateTime());
  }

  async getSelectedDate(): Promise<Date>{

    return this._selectedDate.getValue();
  }

  async setSelectedDate(date: Date | string): Promise<void>{

    return this._selectedDate.next(typeof date == 'string' ? this.createDateFromString(date): date);
  }

  getSelectedDateSubscription(): BehaviorSubject<Date>{

    return this._selectedDate;
  }

  getCurrentDateTime(): Date{
    return moment().toDate();
  }

  getDateIso(date?: Date): string{

    return date ? moment(date).format() : moment().format();
  }

  startingDateIsoFromYear(date: string): string{

    return date.substr(0,10).split('-').join('/');
  }

  createDateFromString(dateInString: string): Date{

    return moment(dateInString).toDate();
  }

  get installDate(): Date{

    return this._installDate;
  }

  set installDate(value: Date){

    this._installDate = value;
  }

  get todayDate(): Date{

    return this._todayDate;
  }

  set todayDate(value: Date){

    this._todayDate = value;
  }

}
