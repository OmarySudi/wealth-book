import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-delete-expense',
  templateUrl: './delete-expense.component.html',
  styleUrls: ['./delete-expense.component.scss'],
})
export class DeleteExpenseComponent implements OnInit {

  constructor(

    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
