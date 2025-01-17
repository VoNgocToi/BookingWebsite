import { Component, OnInit } from '@angular/core';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { StatisticsService } from '../service/statistics.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [SidebarAdminComponent, HeaderComponent, FooterComponent],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent  {
  statistics: any = {}; // Chứa dữ liệu từ API
  isLoading: boolean = true; // Trạng thái tải dữ liệu
  errorMessage: string = ''; // Lưu lỗi (nếu có)

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics(): void {
    this.statisticsService.getStatisticsOverview().subscribe({
      next: (data) => {
        this.statistics = data; // Lưu dữ liệu từ API
        this.isLoading = false; // Tắt trạng thái loading
      },
      error: (error) => {
        this.errorMessage = 'Không thể tải dữ liệu. Vui lòng thử lại sau!';
        console.error(error);
        this.isLoading = false;
      }
    });
  }
  
}
