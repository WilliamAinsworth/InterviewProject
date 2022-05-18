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
    this.nextDisabled = this.dataService.nextData();
    this.prevDisabled = false;
  }

  public prevClick = () => {
    this.prevDisabled = this.dataService.prevData();
    this.nextDisabled = false;
  }
}
