import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { DoctorScheduleService } from '../service/doctor-schedule.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [FormsModule, SidebarAdminComponent, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './doctor-schedule.component.html',
  styleUrl: './doctor-schedule.component.scss'
})

export class DoctorScheduleComponent implements OnInit {
  doctorId: number | null = null;  
  timeslots: any[] = [];  
  bookings: any[] = []

  workShifts: any[] = [];  
  appointments: any[] = [];  
  selectedDate: string | null = null;  
  selectedTimeSlot: any = null;

  constructor(private doctorScheduleService: DoctorScheduleService) {}

  ngOnInit(): void {

    this.doctorScheduleService.getDoctorByUserId().subscribe({
      next: (doctorData) => {
        this.doctorId = doctorData.id;  // Lưu ID bác sĩ vào biến
        this.getTimeslots(this.doctorId);  // Gọi API lấy timeslot sau khi có ID bác sĩ
        this.getBooking(this.doctorId)
      },
      
    });
  }

  // API gọi lấy timeslot theo doctorId
  getTimeslots(doctorId: number): void {
    this.doctorScheduleService.getTimeslotsByDoctorId(doctorId).subscribe({
      next: (timeslotData) => {
        this.timeslots = timeslotData;  // Lưu timeslot vào biến timeslots
        this.workShifts = timeslotData; // Hiển thị ngay ca làm việc sau khi có dữ liệu timeslot
      },
  
    });
  }

  getBooking(doctorId: number): void {
    this.doctorScheduleService.getBookingsByDoctorId(doctorId).subscribe({
      next: (bookingData) => {
        this.bookings = bookingData;  // Lưu timeslot vào biến timeslots
        this.appointments = bookingData; // Hiển thị ngay ca làm việc sau khi có dữ liệu timeslot
      },
      
    });
  }

  updateBooking(id: number): void {
    this.doctorScheduleService.putStatusBooking(id).subscribe({
        next: () => {
            window.location.reload();
        },
        error: (err) => {
            console.error( err);
            alert('Lỗi');
        },
    });
  }
}
