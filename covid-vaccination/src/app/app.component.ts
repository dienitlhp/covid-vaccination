import { Component, OnInit } from '@angular/core';
import { ExportExcelService } from './services/export-excel.service';
import * as XLSX from "xlsx";
import { filter } from 'lodash-es';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  willDownload = false;
  data: CustomerData[] = [];
  displayData: CustomerData[] = [];
  showItem: boolean[] = [];
  dataForExcel: any[] = [];
  searchText = '';
  injectedNumber = 0;

  constructor(public excelService: ExportExcelService) { }

  ngOnInit() {
    this.showItem.fill(false);
  };

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
      json = Object.values(json)[0] as [];
      json.splice(0, 1);
      this.mapData(json);
      this.willDownload = true;
    }
    reader.readAsBinaryString(file);
  }

  mapData(json: any) {
    json.forEach((item: any) => {
      this.data.push({
        sl: Object.values(item)[0] as number,
        name: item['__EMPTY'] || '',
        gender: item['__EMPTY_1'] || '',
        birth: item['__EMPTY_2'] || '',
        email: item['__EMPTY_3'] || '',
        priotyId: item['__EMPTY_4'] || '',
        job: item['__EMPTY_5'] || '',
        workUnit: item['__EMPTY_6'] || '',
        phone: item['__EMPTY_7'] || '',
        indentificationCard: item['__EMPTY_8'] || '',
        healthInsuranceNumber: item['__EMPTY_9'] || '',
        ethnic: item['__EMPTY_10'] || '',
        nation: item['__EMPTY_11'] || '',
        city: item['__EMPTY_12'] || '',
        cityId: item['__EMPTY_13'] || '',
        district: item['__EMPTY_14'] || '',
        districtId: item['__EMPTY_15'] || '',
        ward: item['__EMPTY_16'] || '',
        wardId: item['__EMPTY_17'] || '',
        address: item['__EMPTY_18'] || '',
        healthfacilityId: item['__EMPTY_19'] || '',
        note: item['__EMPTY_20'] || '',
        firstChecked: item['__EMPTY_20'] || false,
        secondChecked: item['__EMPTY_21'] || false,
        done: item['__EMPTY_22'] || false
      })
    });
    this.countInjectedNumber();
    this.displayData = [...this.data];
  }

  filterData() {
    const filterText = this.formatString(this.searchText);
    this.displayData = filter(this.data, (item) => {
      const name = this.formatString(item.name);
      const indentificationCard = this.formatString(item.indentificationCard);
      const phone = this.formatString(item.phone);
      return name.includes(filterText) || indentificationCard.includes(filterText) || phone.includes(filterText);
    }) as CustomerData[];
  }

  formatString(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  }


  exportToExcel() {
    this.data.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })
    const header = [
      'Stt',
      'Họ và tên',
      'Giới tính',
      'Ngày sinh',
      'E-mail',
      'Mã nhóm đối tượng ưu tiên',
      'Nghề nghiệp',
      'Đơn vị công tác',
      'Số điện thoại',
      'Số CMT/CCCD/Hộ chiếu',
      'Số thẻ bảo hiểm y tế',
      'Dân tộc',
      'Quốc tịch',
      'Tỉnh/Thành phố',
      'Mã Tỉnh/Thành phố',
      'Quận/Huyện',
      'Mã Quận/Huyện',
      'Xã Phường',
      'Mã Xã Phường',
      'Địa chỉ chi tiết',
      'Mã cơ sở y tế tiêm',
      'Ghi chú',
      'Check-in Kim Mã',
      'Check-in Bệnh viện',
      'Đã tiêm thành công'

    ]
    let reportData = {
      title: 'DANH SÁCH ĐỐI TƯỢNG ĐĂNG KÝ TIÊM VẮC XIN COVID-19',
      header: header,
      data: this.dataForExcel
    }

    this.excelService.exportExcel(reportData);
  }

  changeCustomerData(changedData: CustomerData, i: number) {
    this.data[i] = changedData;
    this.countInjectedNumber();
  }

  countInjectedNumber() {
    this.injectedNumber = this.data.filter(item => item.done).length;

    return;
  }
}

export interface CustomerData {
  sl: number | string;
  name: string;
  gender: string;
  birth: string;
  email?: string;
  priotyId: number | string;
  job: string;
  workUnit: string;
  phone: string;
  indentificationCard: string;
  healthInsuranceNumber?: string;
  ethnic: string;
  nation: string;
  city: string;
  cityId: string;
  district: string;
  districtId: string;
  ward: string;
  wardId: string;
  address: string;
  healthfacilityId: string;
  note: string;
  firstChecked: boolean;
  secondChecked: boolean;
  done: boolean;
}