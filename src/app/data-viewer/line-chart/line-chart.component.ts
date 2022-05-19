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
  private cumulativeExpenses: number[];
  private lineChartRef: any;
  private dataSubscription: Subscription;
  private fontSize: number = 18;

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

      const cumulativeSum = (sum => (value: number) => sum += value)(0);
      this.cumulativeExpenses = [...Object.values(data)].map(cumulativeSum)

      console.log(Object.values(data))
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
          label: "Expenses",
          data: this.expenseAmounts,
          fill: true,
          borderColor: 'rgba(252, 255, 0, 1)',
          backgroundColor: 'rgba(252, 255, 0, 0.1)',
          tension: 0.2
        },{
          label: "Cumulative Expenses",
          data: this.cumulativeExpenses,
          fill: true,
          borderColor: 'rgba(84, 195, 255, 1)',
          backgroundColor: 'rgba(84, 195, 255, 0.1)',
          tension: 0.3
        }

        ]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              // This more specific font property overrides the global property
              font: {
                size: this.fontSize
              }
            }
          }
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            ticks: {
              font: {
                size: this.fontSize
              }
            }
          },
          y: {
            display: true,
            type: 'logarithmic',
            ticks: {
              font: {
                size: this.fontSize
              }
            }
          }
        }
      }
    })
  }

  private resetChart = () => {
    this.ngOnDestroy()
    this.expenseDates = [];
    this.expenseAmounts = [];
    this.cumulativeExpenses = [];
    this.getData();
  }
}
