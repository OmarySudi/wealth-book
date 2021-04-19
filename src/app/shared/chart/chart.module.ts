import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { IncomeChartComponent} from '../income-chart/income-chart.component'
import { ExpenseChartComponent} from '../expense-chart/expense-chart.component'




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ChartModule { }
