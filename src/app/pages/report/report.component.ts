import { Component, OnInit } from '@angular/core';
import {Months} from 'src/app/constants/constants'
import { map,concatAll } from 'rxjs/operators';
import { ExpenseInterface } from 'src/app/interfaces/expenseinterface';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { AngularFireDatabase,AngularFireList} from '@angular/fire/database';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {

  months = Months;
  monthKeys = [];

  expenseCategories;
  expenseCategoriesKeys = [];
  categories = {}

  returnCategories;
  returnCategoriesKyes = [];

  expenses: ExpenseInterface[] = [];
  expensesRef: AngularFireList<ExpenseInterface>;

  constructor(
    private datetimeservice: DatetimeService,
    private storage: StorageService,
    private database: AngularFireDatabase) { 

    this.getMonthlyReport('2021','04');

    this.monthKeys = Object.keys(this.months)
  }

  
  getMonthlyReport(year: String, month?: String){

    let userid = "";
    let fetchedMonth = "";

    this.storage.getFromLocalStorage("userid").then((res)=>{

      userid = res.value;
      
      fetchedMonth = month? year.concat("/"+month):'';

      console.log("fetchedMonth "+fetchedMonth);

      this.expensesRef = this.database.list('users/'+userid+'/'+fetchedMonth);
      
      this.expensesRef.snapshotChanges().pipe(

      map(changes=> changes.map(c=> c.payload.val())),
        
      ).subscribe(data => {
      
        this.expenseCategories = new Map();
        this.returnCategories = new Map();

        data.forEach(data=>{

          Object.keys(data).map((key)=>{

            let expenseinterface: ExpenseInterface;

            expenseinterface = data[key];

            if(expenseinterface.category == "Expense"){

              if(this.expenseCategories.has(expenseinterface.type))
              {
                let amount  = this.expenseCategories.get(expenseinterface.type)
                amount+=expenseinterface.amount;
                this.expenseCategories.delete(expenseinterface.type)
                this.expenseCategories.set(expenseinterface.type,amount);

              }else{
                this.expenseCategories.set(expenseinterface.type,expenseinterface.amount) 
              }

            }else if(expenseinterface.category == "Return"){

            }
            
          })
        })

  
        let obj = Array.from(this.expenseCategories).reduce((obj, [key, value]) => (
          Object.assign(obj, { [key]: value }) // Be careful! Maps can have non-String keys; object literals can't.
        ), {});

        this.categories = obj;
        this.expenseCategoriesKeys = Object.keys(obj)
      
           
      });
  
    });
  }
 

  ngOnInit() {

   
  }

  onClickDate(){
    
  }

}


