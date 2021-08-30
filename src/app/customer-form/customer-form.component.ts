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

  listJob = ['CARGO', 'CCD', 'FCD', 'MCC', 'VJGS', 'OMC', '1 TH VJC-OMC-FM (Mr Phương APPR)', '1 TH VJC-MD.TH (Mr Phương APPR)', 'SSQA', 'SVC (sovico)', 'VJC-G1 (Galaxy One)', 'VJC-FM-VP.TH (cháu VP Thịnh)', 'VJC-FM-VPMB', 'VPMB-IT', 'VPMB-DA', 'Other'];

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
