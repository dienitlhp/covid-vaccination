import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerData } from '../app.component';

@Component({
  selector: 'customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  private _customerData!: CustomerData;
  @Input() set customerData(data: CustomerData) {
    this._customerData = data;
  }
  get customerData() {
    return this._customerData;
  }

  @Output() customerDataChange = new EventEmitter<CustomerData>();

  constructor() { }

  ngOnInit(): void {
  }

  changeFirstCheckin() {
    this.saveData();
  }

  changeSecondCheckin() {
    this.saveData();
  }

  changeInjected() {
    if (this.customerData.injected) {
      this.customerData.notQualified = false;
    }
    this.saveData();
  }

  changeNotQualified() {
    if (this.customerData.notQualified) {
      this.customerData.injected = false;
    }
    this.saveData();
  }

  saveData() {
    this.customerDataChange.emit(this.customerData);
  }

}
