import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { AccountModule } from '../pages/account/account.module';
import { DashboardModule } from '../pages/dashboard/dashboard.module';
import { BudgetModule } from '../pages/budget/budget.module';
import { ActivityModule } from '../pages/activity/activity.module';
import { ReportModule } from '../pages/report/report.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    AccountModule,
    DashboardModule,
    BudgetModule,
    ReportModule,
    ActivityModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
