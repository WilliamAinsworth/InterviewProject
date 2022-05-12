import {Directive, OnInit} from "@angular/core";
import {DataService} from "../data/data.service";

@Directive()
export abstract class DataViewer implements OnInit {

  protected constructor(private dataService: DataService) {

  }

  public ngOnInit() {
  }

  private extractRawData = () => {
    this.dataService.csvToJson();
  }
}
