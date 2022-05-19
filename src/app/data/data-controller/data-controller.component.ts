import {Component } from '@angular/core';
import {DataService} from "../data.service";

@Component({
  selector: 'app-data-controller',
  templateUrl: './data-controller.component.html',
  styleUrls: ['./data-controller.component.css']
})
export class DataControllerComponent {

  constructor(private dataService: DataService) { }

  public nextDisabled: boolean = false;
  public prevDisabled: boolean = true;

  public nextClick = () => {
    this.dataService.nextData()
    this.setButtonState()
  }

  public prevClick = () => {
    this.dataService.prevData()
    this.setButtonState()
  }

  private setButtonState = () => {
    this.nextDisabled = this.dataService.currentDataIndex === this.dataService.datasetCount - 1
    this.prevDisabled = this.dataService.currentDataIndex === 0
  }
}
