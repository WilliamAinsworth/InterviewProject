import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {DataService} from "../../data/data.service";
import {MatSliderChange} from "@angular/material/slider";
import {Subscription} from "rxjs";

Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, OnDestroy {

  @Input() pieSlices: number = 4;
  // TODO can't seem to use these as inputs to the Material Slider, possible bug
  public static MAX_PIE_SLICES = 10;
  public static MIN_PIE_SLICES = 2;

  private expenseTypes: string[] = [];
  private occurrences: number[] = [];
  private colours: string[];
  private chartRef: any;
  private otherData: any[];
  private dataSubscription: Subscription;

  constructor(private dataService: DataService) {
    document.addEventListener('RE-RENDER', this.ngOnInit);
  }

  ngOnInit() {
    this.getData();

  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.chartRef.destroy();
  }

  public onPieSliceChange = (newValue: MatSliderChange) => {
    if (newValue!.value! > this.pieSlices) {
      this.incrementPieSlices()
    } else {
      if (newValue!.value! < this.pieSlices) {
        this.decrementPieSlices()
      }
    }
  }

  private getData = () => {
    this.expenseTypes = [];
    this.occurrences = [];
    this.dataSubscription = this.dataService.getOccurrence('Supplier').subscribe((data) => {
      this.otherData = this.sortData(data);
      for (let i = 0; i < this.pieSlices; i++) {
        this.addData();
      }

      // let trimmedData: number = 0;
      // for (const property in data) {
      //   let count = data[property];
      //
      //   if (count < 50) {
      //     trimmedData = trimmedData + count;
      //     delete data[property];
      //   }
      // }
      // data['other'] = trimmedData;
      //
      // this.expenseTypes = Object.keys(data);
      // this.occurrences = Object.values(data);

      this.colours = this.generateChartColours(PieChartComponent.MAX_PIE_SLICES);
      this.generatePieChart();
    })
  }

  private addData = () => {
    let newData = this.otherData.pop();
    this.expenseTypes.push(newData[0]);
    this.occurrences.push(newData[1]);
  }

  private removeData = () => {
    this.otherData.push([this.expenseTypes.pop(), this.occurrences.pop()])
  }

  private sortData = (data: { [x: string]: any; }): any[] => {
    let sorted = [];
    for (let prop in data) {
      sorted.push([prop, data[prop]]);
    }

    sorted.sort(function (a, b) {
      return a[1] - b[1];
    });
    return sorted;
  }

  private generatePieChart = () => {
    Chart.defaults.color = '#FFF';
    this.chartRef = new Chart('pieChartCanvas', {
      type: 'pie',
      data: {
        labels: this.expenseTypes,
        datasets: [{
          label: 'Expense Types',
          data: this.occurrences,
          backgroundColor: this.colours,
          hoverOffset: 4
        }]
      }
    });
  }

  private generateChartColours = (length: number): string[] => {
    let colours: string[] = [];
    for (let i = 0; i < length; i++) {
      colours.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    return colours;
  }

  private incrementPieSlices = () => {
    this.pieSlices++;
    this.addData();
    this.chartRef.update();
  }

  private decrementPieSlices = () => {
    this.pieSlices--;
    this.removeData();
    this.chartRef.update();
  }

  private resetPieChart = () => {
    this.chartRef.destroy();
    this.getData();
  }
}
