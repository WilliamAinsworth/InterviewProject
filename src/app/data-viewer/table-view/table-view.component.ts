import { Component, OnInit } from '@angular/core';
import {DataViewer} from "../data-viewer";
import {DataService} from "../../data/data.service";

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent extends DataViewer {

  constructor(dataService: DataService) {
    super(dataService);
  }



}
