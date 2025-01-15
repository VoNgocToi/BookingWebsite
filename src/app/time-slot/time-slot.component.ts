import { Component, OnInit } from '@angular/core';
import { TimeSlot } from '../model/timeslot.model';
import { Schedule } from '../model/schedule.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { TimeSlotService } from '../service/timeslot.service';
import { DoctorService } from '../service/doctor.service';
import { Doctor } from '../model/doctor.model';
import { ScheduleService } from '../service/schedule.service';

@Component({
  selector: 'app-time-slot',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarAdminComponent, HeaderComponent, FooterComponent],
  templateUrl: './time-slot.component.html',
  styleUrls: ['./time-slot.component.scss']
})
export class TimeSlotComponent implements OnInit {
  // Mảng lưu danh sách các bác sĩ (Dữ liệu sẽ lấy từ service)
  doctors: Doctor[] = [];  // Danh sách bác sĩ
  selectedDoctorId: number | null = null;  // ID bác sĩ đã chọn
  schedules: Schedule[] = [];  // Danh sách lịch trình của bác sĩ đã chọn
  timeSlots: TimeSlot[] = [];  // Danh sách thời gian của lịch trình đã chọn
  newTimeSlot: TimeSlot = {   // Khởi tạo với doctorId là null
    id: 0,
    startTime: '',
    endTime: '',
    doctorId: 0,
    doctorName: '',
    scheduleId: 0,
    scheduleDate: new Date(),
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };  // Thông tin timeSlot mới

  doctorId: number | null = null;
  editableTimeSlot: TimeSlot = {   // Khởi tạo với doctorId là null
    id: 0,
    startTime: '',
    endTime: '',
    doctorId: 0,
    doctorName: '',
    scheduleId: 0,
    scheduleDate: new Date(),
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  currentPage: number = 1; // Trang hiện tại
  itemsPerPage: number = 5; // Số hàng trên mỗi trang
  paginatedTimeSlots: TimeSlot[] = []; // Danh sách timeSlots đã phân trang

  constructor(
    private timeSlotService: TimeSlotService,
    private doctorService: DoctorService,
    private scheduleService: ScheduleService,
  ) {};


  ngOnInit(): void {
    this.doctorService.getAllDoctors().subscribe(doctors => {
      this.doctors = doctors;
      console.log('Doctors loaded:', this.doctors);
    }
  );
  this.scheduleService.getAllSchedule().subscribe(schedules => {
    this.schedules = schedules;
    }
  );
  this.loadUsers();
  }

  loadUsers() {
      this.timeSlotService.getAllTimeSlots().subscribe((data: TimeSlot[]) => {
        this.timeSlots = data;
        this.updatePaginatedTimeSlots();
      });
    }
  // Khi chọn bác sĩ, lấy lịch trình của bác sĩ đó
  onDoctorSelect(): void {
    const doctorId = this.editableTimeSlot.doctorId;
    console.log('Selected doctorId:', doctorId);
    if (doctorId) {
      // Cập nhật doctorId trong newTimeSlot khi chọn bác sĩ
      this.scheduleService.getSchedulesByDoctorId(doctorId).subscribe(schedules => {
        this.schedules = schedules;  // Cập nhật danh sách lịch trình
        this.timeSlots = [];         // Xóa danh sách ca làm việc trước đó
      });
    } else {
      console.error('DoctorId is null or undefined');
    }
  }

  updatePaginatedTimeSlots(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTimeSlots = this.timeSlots.slice(startIndex, endIndex);
  }

  // Khi chọn lịch trình, lấy timeSlots của lịch trình đó
  onScheduleSelect(scheduleId: number): void {
    this.scheduleService.getTimeSlotsByScheduleId(scheduleId).subscribe(timeSlots => {
      this.timeSlots = timeSlots;
    });
  }

  // Tạo mới timeSlot
  createTimeSlot() {
    if (this.isValidTimeSlot()) {
      const selectedDoctor = this.getSelectedDoctor();
      if (selectedDoctor) {
        this.newTimeSlot.doctorId = selectedDoctor.id;
        if (this.isValidSchedule()) {
          this.newTimeSlot.scheduleId = Number(this.newTimeSlot.scheduleId);
          this.createTimeSlotApiCall();
        } else {
          console.error('Chưa chọn lịch trình.');
        }
      } else {
        console.error('Không tìm thấy bác sĩ với ID đã chọn.');
      }
    }
  }
  
  private isValidTimeSlot(): boolean {
    const startTimeString = this.newTimeSlot.startTime;
    const endTimeString = this.newTimeSlot.endTime;
    
    // Kiểm tra định dạng thời gian
    if (startTimeString && /^[0-9]{2}:[0-9]{2}$/.test(startTimeString) && /^[0-9]{2}:[0-9]{2}$/.test(endTimeString)) {
      const [startHour, startMinute] = startTimeString.split(':').map(num => parseInt(num));
      const [endHour, endMinute] = endTimeString.split(':').map(num => parseInt(num));
      const startTime = new Date();
      startTime.setHours(startHour, startMinute, 0, 0);
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, 0, 0);
      this.newTimeSlot.startTime = startTime.toISOString().slice(11, 19);
      this.newTimeSlot.endTime = endTime.toISOString().slice(11, 19);
      return true;
    }
    return false;
  }
  
  private getSelectedDoctor() {
    if (this.selectedDoctorId !== null) {
      return this.doctors.find((doctor) => doctor.id === this.selectedDoctorId);
    }
    return null;
  }
  
  private isValidSchedule(): boolean {
    return this.newTimeSlot.scheduleId !== null;
  }
  
  private createTimeSlotApiCall() {
    this.timeSlotService.createTimeSlots(this.newTimeSlot).subscribe(
      (createdTimeSlot: TimeSlot) => {
        this.timeSlots.unshift(createdTimeSlot); 
        this.currentPage = 1;
        this.updatePaginatedTimeSlots();
        this.resetTimeSlot();
      },
      (error) => {
        console.error('Lỗi khi tạo timeSlot:', error);
      }
    );
  }
  
  private resetTimeSlot() {
    this.newTimeSlot = {
      id: 0,
      startTime: '',
      endTime: '',
      doctorId: 0,
      doctorName: '',
      scheduleId: 0,
      scheduleDate: new Date(),
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  

  getDoctorName(doctorId: number): string {
    const doctor = this.doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Chưa có bác sĩ';  // Trả về tên bác sĩ hoặc thông báo nếu không tìm thấy
  }
 
  
editTimeSlot(id: number): void {
  const timeSlot = this.timeSlots.find(ts => ts.id === id);
  if (timeSlot) {
    this.editableTimeSlot = { ...timeSlot }; // Tạo một bản sao để chỉnh sửa
  } else {
    console.error('Không tìm thấy timeSlot với ID:', id);
  }
}


saveUpdatedTimeSlot(): void {
  if (this.editableTimeSlot) {
    const id = this.editableTimeSlot.id!;
    this.timeSlotService.updateTimeSlots(id, this.editableTimeSlot).subscribe(
      (updated) => {
        const index = this.timeSlots.findIndex(ts => ts.id === id);
        if (index !== -1) {
          this.timeSlots[index] = updated; // Cập nhật danh sách timeSlots
        }
        this.editableTimeSlot = {   // Khởi tạo với doctorId là null
          id: 0,
          startTime: '',
          endTime: '',
          doctorId: 0,
          doctorName: '',
          scheduleId: 0,
          scheduleDate: new Date(),
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.loadUsers() // Đóng form
      },
      (error) => {
        console.error('Lỗi khi cập nhật timeSlot:', error);
      }
    );
  }
}

  // Xóa timeSlot
  deleteTimeSlot(id: number): void {
    this.timeSlotService.deleteTimeSlots(id).subscribe(
      () => {
        this.timeSlots = this.timeSlots.filter(ts => ts.id !== id);
      },
      (error) => {
        console.error('Lỗi khi xóa timeSlot:', error);
      }
    );
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedTimeSlots();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePaginatedTimeSlots();
    }
  }
  
  totalPages(): number {
    return Math.ceil(this.timeSlots.length / this.itemsPerPage);
  }
}
