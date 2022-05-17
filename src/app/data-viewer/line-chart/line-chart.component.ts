import {Component, OnInit} from '@angular/core';
import {DataService} from "../../data/data.service";
import {Chart} from "chart.js";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  private expenseDates: string[];
  private expenseAmounts: number[];
  private chartRef: any;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.getData();
  }


  private getData = () => {
    this.dataService.getExpensesPerDate().subscribe((data) => {
      console.log(data)
      this.expenseDates = Object.keys(data);
      this.expenseAmounts = Object.values(data);

      this.expenseAmounts = this.expenseAmounts.map(this.cumulativeSum)
      this.generateLineChart();
    })

  }

  private cumulativeSum = (sum => (value: number) => sum += value)(0);

  private generateLineChart = () => {
    Chart.defaults.color = '#FFF';
    this.chartRef = new Chart('lineChartCanvas', {
      type: 'line',
      data: {
        labels: this.expenseDates,
        datasets: [{
          label: "Cumulative Expenses",
          data: this.expenseAmounts,
          fill: false,
          borderColor: '#7aff05',
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true
          },
          y: {
            display: true,
            type: 'logarithmic',
          }
        }
      }
    })
  }
}
