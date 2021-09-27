import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GoogleChartInterface } from 'ng2-google-charts';
import {LoaderService} from 'src/app/services/loader/loader.service'

@Component({
  selector: 'app-income-chart',
  templateUrl: './income-chart.component.html',
  styleUrls: ['./income-chart.component.scss'],
})
export class IncomeChartComponent implements OnInit {

  constructor(
    private modalController:ModalController,
    private loaderService: LoaderService,
    ) 
    { 

    }

  @Input('returnCategories') returnCategories: {};
  @Input('returnCategoriesKeys') returnCategoriesKeys: any[];
  @Input('title') title: string;
  @Input('currentMonth') currentMonth: string;
  @Input('currentYear') currentYear: string;

  chartTitle: string;
  loader: boolean;

  dataTable: any[] = [["Income","Monthly/Annually income"]];

  public pieChart: GoogleChartInterface;

  ngOnInit() {
    this.loader = true;
    this.loadChart()
  }

  ionViewDidEnter(){
    this.loader = false;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  loadChart(){

    if(this.title == "Monthly"){
      this.chartTitle = this.currentMonth+" "+this.currentYear+" income";
    }else {
      this.chartTitle = this.currentYear+" income";
    }

    this.returnCategoriesKeys.forEach((key)=>{
      this.dataTable.push([key,this.returnCategories[key]])
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
