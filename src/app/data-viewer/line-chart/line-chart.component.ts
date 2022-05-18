import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../data/data.service";
import {Chart} from "chart.js";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnDestroy {

  private expenseDates: string[];
  private expenseAmounts: number[];
  private lineChartRef: any;
  private dataSubscription: Subscription;

  constructor(private dataService: DataService) {
    document.addEventListener('RE-RENDER', this.resetChart);
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.lineChartRef.destroy();
  }

  private getData = () => {
    this.dataSubscription = this.dataService.getExpensesPerDate().subscribe((data) => {
      this.expenseDates = Object.keys(data);
      this.expenseAmounts = Object.values(data)
      this.generateLineChart();
    })
  }


  private generateLineChart = () => {
    Chart.defaults.color = '#FFF';
    this.lineChartRef = new Chart('lineChartCanvas', {
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
        maintainAspectRatio: false,
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

  private resetChart = () => {
    this.ngOnDestroy()
    this.expenseDates = [];
    this.expenseAmounts = [];
    this.getData();
  }
}
