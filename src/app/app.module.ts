import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule} from '@angular/fire';
import { environment } from 'src/environments/environment';
import { ExpenseChartComponent} from 'src/app/shared/expense-chart/expense-chart.component'
import { IncomeChartComponent} from 'src/app/shared/income-chart/income-chart.component'
import { HttpClientModule } from '@angular/common/http';
//import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
//import { CatagoryPipe } from './pipes/catagory.pipe';


@NgModule({
  declarations: [AppComponent,ExpenseChartComponent,IncomeChartComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    Ng2GoogleChartsModule,
    HttpClientModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
