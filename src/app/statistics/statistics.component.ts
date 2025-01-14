import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { StatisticsService } from '../service/statistics.service';


interface Statistic {
  status: string;
  count: number;
  date: string;  // ngày
  month: string; // tháng
  year: string;

}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        data: [],
        label: 'Số lượng cuộc hẹn',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
      }
    ]
  };

  constructor(private statistics: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatisticsByStatus(); // Hoặc loadStatisticsByDay(), loadStatisticsByMonth(), loadStatisticsByYear()
  }

  // Phương thức lấy thống kê theo trạng thái
  loadStatisticsByStatus(): void {
    this.statistics.getStatisticsByStatus().subscribe((data: Statistic[]) => {
      // Gán dữ liệu vào biểu đồ
      this.barChartData.datasets[0].data = data.map(d => d.count); // Lấy số lượng
      this.barChartLabels = data.map(d => d.status); // Lấy trạng thái
    });
  }

  // Các phương thức thống kê theo ngày, tháng, năm
  loadStatisticsByDay(): void {
    this.statistics.getStatisticsByDay().subscribe((data: Statistic[]) => {
      this.barChartData.datasets[0].data = data.map(d => d.count);
      this.barChartLabels = data.map(d => d.date); // Lấy ngày
    });
  }

  loadStatisticsByMonth(): void {
    this.statistics.getStatisticsByMonth().subscribe((data: Statistic[]) => {
      this.barChartData.datasets[0].data = data.map(d => d.count);
      this.barChartLabels = data.map(d => d.month); // Lấy tháng
    });
  }

  loadStatisticsByYear(): void {
    this.statistics.getStatisticsByYear().subscribe((data: Statistic[]) => {
      this.barChartData.datasets[0].data = data.map(d => d.count);
      this.barChartLabels = data.map(d => d.year); // Lấy năm
    });
  }
}
