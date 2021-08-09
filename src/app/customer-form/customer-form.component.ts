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

  @Output() saveCustomerData = new EventEmitter<CustomerData>();

  constructor() { }

  ngOnInit(): void {
  }

  changeFirstCheckin() {
  }

  changeSecondCheckin() {
  }

  changeInjected() {
    if (this.customerData.injected) {
      this.customerData.notQualified = false;
    }
  }

  changeNotQualified() {
    if (this.customerData.notQualified) {
      this.customerData.injected = false;
    }
  }

  saveData() {
    this.saveCustomerData.emit(this.customerData);
  }

}
