import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private readonly http: HttpClient) { }

  url = 'https://covid-vaccination-server.herokuapp.com:8000/'


  getData(): Observable<any> {
    return this.http.get(this.url);
  }

  updateData(data: any) {
    return this.http.post(this.url, {
      data
    }, { responseType: 'text' })
  }
}
