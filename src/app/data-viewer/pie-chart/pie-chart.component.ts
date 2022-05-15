import {Component, Input, OnInit} from '@angular/core';
import {Chart, registerables} from 'chart.js';
import {DataService} from "../../data/data.service";

Chart.register(...registerables);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() pieSlices: number = 4;
  private expenseTypes: string[] = [];
  private occurrences: number[] = [];
  private colours: string[];
  private chartRef: any;

  constructor(private dataService: DataService) {
    document.addEventListener('RE-RENDER', this.ngOnInit);
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData = () => {
    this.expenseTypes = [];
    this.occurrences = [];
    this.dataService.getOccurrences('Supplier').subscribe((data) => {
      // console.log(data)
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

      let sortedData = this.sortData(data);
      for (let i = 0; i < this.pieSlices; i++) {
        this.expenseTypes.push(sortedData.pop()[0]);
        this.occurrences.push(sortedData.pop()[1]);
      }


      this.colours = this.generateChartColours(this.expenseTypes.length);

      this.generatePieChart();
    })
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

  private generateChartColours = (length: number): string[] => {
    let colours: string[] = [];
    for (let i = 0; i < length; i++) {
      colours.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    return colours;
  }

  private generatePieChart = () => {
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

  public incrementPieSlices = () => {
    this.pieSlices++;
    this.resetPieChart();
  }
  public decrementPieSlices = () => {
    this.pieSlices--;
    this.resetPieChart();

  }

  private resetPieChart = () => {
    this.chartRef.destroy();
    this.getData();
  }
}
