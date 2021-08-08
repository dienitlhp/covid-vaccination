import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ExportExcelService } from './services/export-excel.service';
import * as XLSX from "xlsx";
import { cloneDeep, filter } from 'lodash-es';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('input') inputElement!: HTMLInputElement;
  willDownload = false;
  data: CustomerData[] = [];
  displayData: CustomerData[] = [];
  changedCustomer: CustomerData[] = [];
  showItem: boolean[] = [];
  dataForExcel: any[] = [];
  searchText = '';
  injectedNumber = 0;
  formatDate = '';
  showModal = false;
  passwordVisible = false;
  password?: string;
  defaultPassword = 'vja2021';
  showInputFile = false;
  showLoading = false;

  header = [
    'STT',
    'Họ tên',
    'Ngày sinh',
    'Giới tính',
    'Dân tộc',
    'Nghề nghiệp',
    'Điện thoại',
    'E-mail',
    'Số CMT/CCCD',
    'Mã số BHYT',
    'Tên đơn vị',
    'Khoa/phòng/ban',
    'Địa chỉ',
    'Số nhà, tên phố/đường, thôn, xóm',
    'Xã/phường',
    'Quận/huyện',
    'Tỉnh/thành',
    'Check-in tại 302 Kim Mã',
    'Check-in tại Medlatec',
    'Đã tiêm xong',
    'Không tiêm/ không đủ điều kiện tiêm',
    'Ghi chú',
  ]

  constructor(public excelService: ExportExcelService, private api: AppService) { }

  ngOnInit() {
    this.showItem.fill(false);
    const today = new Date();
    const date = today.toJSON().slice(0, 10);
    this.formatDate = date.slice(8, 10) + '/'
      + date.slice(5, 7) + '/'
      + date.slice(0, 4);
  };

  getDataFromDb() {
    this.data = [];
    this.showLoading = true;
    this.api.getData().subscribe(res => {
      this.showLoading = false;
      res.results.forEach((data: any) => {
        this.data.push(data.data);
      });
      this.displayData = [...this.data];
      this.countInjectedNumber();
      this.willDownload = true;
    })
  }

  openPasswordModal() {
    this.showModal = true;
  }

  handleOk(): void {
    this.showModal = false;
    if (this.password === this.defaultPassword) {
      document.getElementById('triggerInput')?.click();
    }
  }

  handleCancel(): void {
    this.showModal = false;
  }

  onFileChange(ev: any) {
    let workBook: XLSX.WorkBook | null = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      let json;
      workBook = XLSX.read(data, { type: 'binary' });
      json = workBook.SheetNames.reduce((initial: any, name) => {
        const sheet = workBook!.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.mapData(json['Sheet1']);
      this.willDownload = true;
    }
    reader.readAsBinaryString(file);
  }

  mapData(json: any) {
    json.forEach((item: any) => {
      this.data.push({
        sl: item[this.header[0]] || null,
        name: item[this.header[1]] || '',
        birth: item[this.header[2]] || '',
        gender: item[this.header[3]] || '',
        ethnic: item[this.header[4]] || '',
        job: item[this.header[5]] || '',
        phone: item[this.header[6]] || '',
        email: item[this.header[7]] || '',
        indentificationCard: item[this.header[8]] || '',
        healthInsuranceNumber: item[this.header[9]] || '',
        workName: item[this.header[10]],
        workUnit: item[this.header[11]] || '',
        address: item[this.header[12]] || '',
        workAdress: item[this.header[13]],
        ward: item[this.header[14]] || '',
        district: item[this.header[15]] || '',
        city: item[this.header[16]] || '',
        firstCheckin: item[this.header[17]] === 'Yes' ? true : false,
        secondCheckin: item[this.header[18]] === 'Yes' ? true : false,
        injected: item[this.header[19]] === 'Yes' ? true : false,
        notQualified: item[this.header[20]] === 'Yes' ? true : false,
        note: item[this.header[21]] || ''
      })
    });
    this.countInjectedNumber();
    this.displayData = [...this.data];
    this.createDatabase();
  }

  createDatabase() {
    this.api.createDataBase(this.data).subscribe(res => {
      console.log(res);
    })
  }

  filterData() {
    const filterText = this.formatString(this.searchText);
    this.displayData = filter(this.data, (item) => {
      const name = this.formatString(item.name.toString());
      const indentificationCard = this.formatString(item.indentificationCard.toString());
      const phone = this.formatString(item.phone.toString());
      return name.includes(filterText) || indentificationCard.includes(filterText) || phone.includes(filterText);
    }) as CustomerData[];
    this.showItem.fill(false);
  }

  formatBirth(str: string) {
    if (!str) return '';

    return `${str.slice(6, 8)}/${str.slice(4, 6)}/${str.slice(0, 4)}`;
  }

  formatGender(str: any) {
    if (!str || str === 0) return 'Không rõ';

    return str === 1 ? 'Nam' : 'Nữ';
  }

  formatString(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  }

  showCustomer(index: number) {
    if (this.showItem[index]) {
      this.showItem[index] = false;
    } else {
      this.showItem.fill(false);
      this.showItem[index] = true;
    }
  }

  exportToExcel() {
    this.dataForExcel = [];
    this.data.forEach((row: any) => {
      const rowExcel = cloneDeep(row);
      rowExcel.firstCheckin = row.firstCheckin ? 'Yes' : 'No';
      rowExcel.secondCheckin = row.secondCheckin ? 'Yes' : 'No';
      rowExcel.injected = row.injected ? 'Yes' : 'No';
      rowExcel.notQualified = row.notQualified ? 'Yes' : 'No';
      this.dataForExcel.push(Object.values(rowExcel))
    })
    let reportData = {
      title: `DANH SÁCH ĐỐI TƯỢNG ĐĂNG KÝ TIÊM VẮC XIN COVID-19 - ngày ${this.formatDate}`,
      header: this.header,
      data: this.dataForExcel
    }

    this.excelService.exportExcel(reportData);
  }

  changeCustomerData(changedData: CustomerData, i: number) {
    this.changedCustomer.push(changedData);
    this.data[i] = changedData;
    this.countInjectedNumber();
  }

  countInjectedNumber() {
    this.injectedNumber = this.data.filter(item => item.injected).length;

    return;
  }

  saveToDB() {
    this.api.updateDataBase(this.changedCustomer).subscribe(res => {
      console.log(res);
    })
    this.changedCustomer = [];
  }
}

export interface CustomerData {
  sl: number | string;
  name: string;
  birth: string;
  gender: string;
  ethnic: string;
  job: string;
  phone: string;
  email: string;
  indentificationCard: string;
  healthInsuranceNumber?: string;
  workUnit: string;
  workName: string;
  workAdress: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  firstCheckin?: boolean;
  secondCheckin?: boolean;
  injected?: boolean;
  notQualified?: boolean;
  note?: string;
}
