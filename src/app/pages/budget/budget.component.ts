import { Component, OnInit } from '@angular/core';
import {Months} from 'src/app/constants/constants';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
export class BudgetComponent implements OnInit {

  months = Months;
  monthKeys = [];
  years = [];

  currentMonth: string;
  currentYear: string;
  
  constructor(
    private datetimeservice: DatetimeService,
  )
  { 
   
    this.monthKeys = Object.keys(this.months)

    this.getListOfYears();
  }

  changeSelectedYear(year:string){
    this.currentYear = year;
  }

  changeSelectedMonth(month:string){
    this.currentMonth = month;
  }

  getListOfYears(){
    let min = 2020
    let max = Number(this.datetimeservice.getCurrentYear());
    
    for (let i = min; i<=max; i++){
      this.years.push(i);
    }
  }

  ngOnInit() {
    this.currentMonth = this.datetimeservice.getCurrentMonth()
    this.currentYear = this.datetimeservice.getCurrentYear()
  }

}
