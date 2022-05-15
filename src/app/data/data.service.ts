import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, of} from "rxjs";

export interface Expense {
  DepartmentFamily: string,
  Entity: string,
  Date: string,
  ExpenseType: string,
  ExpenseArea: string,
  Supplier: string,
  TransactionNumber: string,
  Amount: string,
  InvoiceCurrencyUnit: string
}
const EXPECTED_LAST_HEADER = 'Invoice Currency Unit';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //  Can be swapped with web addresses
  // TODO if time permits, use dates within data sets to order these
  private dataURLs: string[] = [
    'assets/transactionCSVs/EPSRCspendDataOct2013.csv',
    'assets/transactionCSVs/EPSRCspendDataDec2013.csv',
    'assets/transactionCSVs/EPSRCSpendDataOct2014.csv',
    'assets/transactionCSVs/EPSRCSpendDataDec2014.csv',
    'assets/transactionCSVs/EPSRCSpendDataApril2015.csv',
    'assets/transactionCSVs/EPSRCSpendDataMay2015.csv',
    'assets/transactionCSVs/EPSRCSpendDataJune2015.csv',
    'assets/transactionCSVs/EPSRCSpendDataJuly2015.csv',
    'assets/transactionCSVs/EPSRCSpendDataAug2015.csv',
    'assets/transactionCSVs/EPSRCSpendDataSep2015.csv',
    'assets/transactionCSVs/EPSRCSpendDataJul2016.csv',
    'assets/transactionCSVs/EPSRCSpendDataAug2016.csv',
    'assets/transactionCSVs/EPSRCSpendDataSep2016.csv',
  ];

  public csvHeaders: string[];
  public currentDataIndex: number = 0;
  private reRenderEvent = new Event('RE-RENDER');
  private rawDataCache: (Expense[])[];

  constructor(private http: HttpClient) { }

  public getCurrentData = () => {
    // if (this.rawDataCache[this.currentDataIndex]) {
    //   return of(this.rawDataCache[this.currentDataIndex]);
    // } else {
      return this.getRawData();
    // }
  }

  public getOccurrences = (heading: keyof Expense): Observable<{ [x: string]: number; }> => {
    let occurrences: { [x: string]: number; } = {};

    return this.getCurrentData().pipe(map((expenses: Expense[]) => {
      expenses.forEach((expense: Expense) => {
        let value = expense[heading];
        occurrences[value] = occurrences[value] + 1 || 1;
      })
      return occurrences;
    }))
  }

  private csvToJson = (csv: string) => {
    const lines = csv.split('\n');
    lines.pop();
    this.csvHeaders = lines[0].split(',');

    // data clean up
    // if (this.csvHeaders[8] != EXPECTED_LAST_HEADER) {
    //   lines.shift();
    //   this.csvHeaders = lines[0].split(',');
    // }

    return lines.slice(1).map(line => {
      return line.split(',').reduce((acc, cur, i) => {
        const toAdd = {};
        // @ts-ignore
        toAdd[this.csvHeaders[i]] = cur;
        return { ...acc, ...toAdd };
        }, {});
      });
  }

  private getRawData = (): Observable<Expense[]> => {
    return this.http.get(this.dataURLs[this.currentDataIndex], { responseType: 'text' })
      .pipe(map(data => (this.csvToJson(data) as Expense[])));
  }

  public nextData(): boolean  {
    this.currentDataIndex++;
    return this.currentDataIndex === this.dataURLs.length - 1;
  }

  public prevData(): boolean {
    this.currentDataIndex--;
    return this.currentDataIndex === 0;
  }
}
