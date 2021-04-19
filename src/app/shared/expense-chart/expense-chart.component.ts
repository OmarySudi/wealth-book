import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GoogleChartInterface } from 'ng2-google-charts';


@Component({
  selector: 'app-expense-chart',
  templateUrl: './expense-chart.component.html',
  styleUrls: ['./expense-chart.component.scss'],
})
export class ExpenseChartComponent implements OnInit {

  @Input('expenseCategories') expenseCategories: {};
  @Input('expenseCategoriesKeys') expenseCategoriesKeys: any[];
  @Input('title') title: string;
  @Input('currentMonth') currentMonth: string;
  @Input('currentYear') currentYear: string;

  chartTitle: string;

  constructor(private modalController:ModalController,) {

   // this.loadChart();
   }

  dataTable: any[] = [["Expenses","Monthly/Annually expenses"]];

  public pieChart: GoogleChartInterface;

  ngOnInit() {

    this.loadChart();
    
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  // ionViewDidEnter() {
  //   this.loadChart();
  // }

  loadChart(){

    if(this.title == "Monthly"){
      this.chartTitle = this.currentMonth+" "+this.currentYear+" expenses";
    }else {
      this.chartTitle = this.currentYear+" expenses";
    }

    this.expenseCategoriesKeys.forEach((key)=>{
      this.dataTable.push([key,this.expenseCategories[key]])
    })

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: this.dataTable,
      options: {
        'title': this.chartTitle,
        height: 500,
        width: '100%'
      },
    }

  }

}
