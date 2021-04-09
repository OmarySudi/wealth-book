import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import { Setting } from 'src/app/interfaces/setting';
import { LodashService } from 'src/app/services/lodash/lodash.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import {map} from 'rxjs/operators'
import { ModalController } from '@ionic/angular';
import { SubscriptionLike } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-monthly-expenses',
  templateUrl: './monthly-expenses.component.html',
  styleUrls: ['./monthly-expenses.component.scss'],
})
export class MonthlyExpensesComponent implements OnInit {

  @Input() expenses: ExpenseInterface[];
  @Input() type: string;
  @Input() total: number;

  
  currency: string;
  filterPrice: boolean;
  filterPriceUp: boolean;

  expensesSubscription: SubscriptionLike;
 
  constructor(
    private storage: StorageService,
    private modalController: ModalController,
    private dataservice: DataService,
    ) { 
    this.setCurrency();
  }

  ngOnInit() {

    // this.expensesSubscription = this.dataservice.getExpensesSubscription()
    // .subscribe({
    //   next:((data)=>{
    //     this.expenses = data;
    //   })
    // })
  }

  setCurrency(){
    this.storage.getFromLocalStorage("WB_currency").then((res)=>{
      this.currency = res.value;
    });
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  // priceFilter(): void{

  //   this.expenses = this.expenses.sort((a,b)=>{
  
  //     if(a.amount > b.amount) return this.filterPriceUp ? 1: -1;
  
  //     if(b.amount > a.amount) return this.filterPriceUp? -1: 1;
  //   })
  
  //   this.filterPrice = true;
  //   this.filterPriceUp = !this.filterPriceUp;
    
  //  }

}
