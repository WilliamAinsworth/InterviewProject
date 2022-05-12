import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }


  public csvToJson = () => {
    this.http.get('assets/transactionCSVs/EPSRCSpendDataApril2015.csv', { responseType: 'text' })
      .subscribe(data => console.log(data));
  }

}
