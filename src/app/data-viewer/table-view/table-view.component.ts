import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService, Expense} from "../../data/data.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements OnInit {
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<Expense>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  private dataSubscription: Subscription;

  constructor(private dataService: DataService) {
    document.addEventListener('RE-RENDER', this.resetChart);
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getData();

  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  private getData() {
    this.dataSubscription = this.dataService.getRawData().subscribe((data: Expense[]) => {
      this.displayedColumns = Object.keys(data[0])
      this.dataSource = new MatTableDataSource<Expense>(data)
      this.ngAfterViewInit()
    })
  }

  private resetChart = () => {
    this.ngOnDestroy()
    this.displayedColumns = [];
    this.dataSource = new MatTableDataSource<Expense>()
    this.getData();
  }
}
