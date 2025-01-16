import { Component, OnInit } from '@angular/core';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [SidebarAdminComponent, HeaderComponent, FooterComponent],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent  {
  statistics = {
    totalBookings: 500,
    completedBookings: 400,
    canceledBookings: 100,
    weeklyBookings: 120,
    monthlyBookings: 350,
    yearlyBookings: 5000,
    bookingsPerDoctor: [
      { doctorName: 'Dr. A', bookings: 150 },
      { doctorName: 'Dr. B', bookings: 200 },
      { doctorName: 'Dr. C', bookings: 150 }
    ]
  };
  
}
