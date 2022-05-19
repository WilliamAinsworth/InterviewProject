import { TestBed} from '@angular/core/testing';

import {DataService, Expense} from './data.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {of} from "rxjs";

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController

  const mockCsvHeader: string = 'DepartmentFamily'
  const mockCsvFile: string = mockCsvHeader + `,Entity,Date,ExpenseType,ExpenseArea,Supplier,TransactionNumber,Amount,InvoiceCurrencyUnit
BIS,EPSRC,01/04/2015,Telecoms - Calls Fax & internet Costs,PSU IS,Telecoms World Plc,82980109,16.78,GBP
BIS,EPSRC,01/04/2015,Financial Services,PSU Finance,Royal Bank of Scotland plc/Natwest,82980130,200,GBP`

  const mockCsvFileShort: string = `DepartmentFamily,Entity,Date,ExpenseType
BIS,EPSRC,01/04/2015,Telecoms - Calls Fax & internet Costs
BIS,EPSRC,01/04/2015,Financial Services`

  const mockExpenseAmount = 200
  const mockExpenseDepartmentFamily = "APPLE"
  const mockExpenseDate = "01/04/2015"
  const mockExpenseDateDouble = "02/04/2015"
  const mockExpense: Expense = {
    DepartmentFamily: "BIS",
    Entity: "EPSRC",
    Date: mockExpenseDate,
    ExpenseType: "Financial Services",
    ExpenseArea: "PSU Finance",
    Supplier: "Royal Bank of Scotland plc/Natwest",
    TransactionNumber: "82980130",
    Amount: (mockExpenseAmount / 2).toString(),
    InvoiceCurrencyUnit: "GBP"
  }

  const mockExpenseApple: Expense = {
    DepartmentFamily: mockExpenseDepartmentFamily,
    Entity: "EPSRC",
    Date: mockExpenseDateDouble,
    ExpenseType: "Financial Services",
    ExpenseArea: "PSU Finance",
    Supplier: "Royal Bank of Scotland plc/Natwest",
    TransactionNumber: "82980130",
    Amount: mockExpenseAmount.toString(),
    InvoiceCurrencyUnit: "GBP"
  }

  const mockCsvHeaderArray: string[] = ["DepartmentFamily", "Entity", "Date", "ExpenseType", "ExpenseArea", "Supplier", "TransactionNumber", "Amount", "InvoiceCurrencyUnit"]
  const mockOccurrenceExpenses: Expense[] = [mockExpense, mockExpenseApple, mockExpense, mockExpenseApple, mockExpenseApple]
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [DataService]
    });
    service = TestBed.inject(DataService)
    httpMock = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
  })


  it('should be created', () => {
    expect(service).toBeTruthy()
  });

  it('should increment currentDataIndex when nextData() is called', () => {
    let prevIndex = service.currentDataIndex
    service.nextData()
    expect(service.currentDataIndex).toEqual(prevIndex + 1)
  })

  it('should not decrement currentDataIndex when prevData() is called at the FIRST dataset', () => {
    let prevIndex = service.currentDataIndex;
    service.prevData()
    expect(service.currentDataIndex).toEqual(prevIndex)
  })

  it('should not increment currentDataIndex when prevData() is called at the LAST dataset', () => {
    service.currentDataIndex = service.datasetCount - 1
    let datasetCount = service.currentDataIndex
    service.nextData()
    expect(service.currentDataIndex).toEqual(datasetCount)
  })

  it('getRawData() should extract the data correctly', () => {
    const response: Expense[] = [mockExpense]
    service.currentDataIndex = 0
    service['dataURLs'] = [mockCsvFile]
    spyOn(service, 'getRawData').and.returnValue(of(response))

    service.getRawData().subscribe((data) => {
      expect(data[0].DepartmentFamily).toEqual(mockExpense.DepartmentFamily)
    })
  })

  it('csvToJson() should set csvHeaders correctly', () => {
    service['csvToJson'](mockCsvFile)
    expect(service.csvHeaders).toEqual(mockCsvHeaderArray)
  })

  it('csvToJson() should set csvHeaders correctly with reduced headers', () => {
    service['csvToJson'](mockCsvFileShort)
    expect(service.csvHeaders).toEqual(mockCsvHeaderArray.slice(0, 4))
  })

  it('getOccurrence should correctly count multiple occurrences of data', () => {
    spyOn(service, 'getRawData').and.returnValue(of(mockOccurrenceExpenses))
    service.getOccurrence('DepartmentFamily').subscribe((data) => {
      expect(data[mockExpenseDepartmentFamily]).toEqual(3)
    })
  })

  it('getExpensesPerDate should return correct total expense amount for different dates', () => {
    spyOn(service, 'getRawData').and.returnValue(of(mockOccurrenceExpenses))
    const result = mockExpenseAmount
    const resultTriple = mockExpenseAmount * 3
    service.getExpensesPerDate().subscribe((data) => {
      expect(data[mockExpenseDate]).toEqual(result)
      expect(data[mockExpenseDateDouble]).toEqual(resultTriple)
    })
  })
});
