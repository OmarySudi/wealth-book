import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MonthlyExpensesComponent } from './monthly-expenses.component';

describe('MonthlyExpensesComponent', () => {
  let component: MonthlyExpensesComponent;
  let fixture: ComponentFixture<MonthlyExpensesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyExpensesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
