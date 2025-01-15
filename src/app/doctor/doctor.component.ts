import { Component, OnInit } from '@angular/core';
import { Doctor } from '../model/doctor.model';
import { AuthService } from '../service/auth.service';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from '../footer/footer.component';
import { DoctorService } from '../service/doctor.service'; // import service để lấy dữ liệu bác sĩ
import { SpecialtyService } from '../service/specialty.service';
import { Specialty } from '../model/specialty.model';
@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarAdminComponent, HeaderComponent, FooterComponent],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.scss'
})
export class DoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  specialties: Specialty[] = [];
  selectedDoctor: Doctor | null = null;
  newDoctor: Doctor = {
    id: 0,
    name: '',
    email: '',
    phoneNumber: '',
    gender: true,  // mặc định Nam
    profilePicture: '',
    specialtyId: 0,  // Dành cho việc chọn chuyên khoa khi thêm bác sĩ mới
    password: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  isEditMode: boolean = false;
  errorMessages: string[] = [];  // Mảng chứa thông báo lỗi

  currentPage: number = 1; // Trang hiện tại
    itemsPerPage: number = 5; // Số hàng trên mỗi trang
    paginatedDoctors: Doctor[] = [];

  constructor(private doctorService: DoctorService, private specialtyService: SpecialtyService) { }

  ngOnInit() {
    this.loadDoctors();
    this.loadSpecialties();
  }

  loadDoctors() {
    this.doctorService.getAllDoctors().subscribe((doctors) => {
      this.doctors = doctors;
      this.updatePaginatedDoctors();
    });
  }

  loadSpecialties() {
    this.specialtyService.getAllSpecialty().subscribe((specialties) => {
      this.specialties = specialties;
    });
  }

  // Khi người dùng chọn bác sĩ, hiển thị chuyên khoa của bác sĩ đó
  selectDoctor(doctor: Doctor) {
    this.selectedDoctor = doctor;
    const specialty = this.specialties.find(s => s.id === doctor.specialtyId);
    if (specialty) {
      doctor.specialtyId = specialty.id;  // Gán ID của chuyên khoa vào specialtyId của bác sĩ
    }
  }

  // Thêm bác sĩ mới
  addDoctor() {
    if (!this.isValidDoctor(this.newDoctor)) return;
    
    if (!this.newDoctor.password || this.newDoctor.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    this.doctorService.createDoctors(this.newDoctor).subscribe((newDoctor) => {
      this.doctors.push(newDoctor);
      this.resetForm();
    });
  }

  // Chỉnh sửa bác sĩ
  editDoctor(doctor: Doctor) {
    this.newDoctor = { ...doctor };
    this.isEditMode = true;  // Đặt chế độ chỉnh sửa thành true

    this.newDoctor.password = doctor.password || '';
  }

  // Cập nhật bác sĩ
  updateDoctor() {
    if (!this.isValidDoctor(this.newDoctor)) return;

    this.doctorService.updateDoctors(this.newDoctor.id, this.newDoctor).subscribe(() => {
      this.loadDoctors();
      this.resetForm();
      this.isEditMode = false;  // Đặt lại chế độ chỉnh sửa thành false
    });
  }

  // Kiểm tra hợp lệ thông tin bác sĩ
  isValidDoctor(doctor: Doctor): boolean {
    if (!doctor.name || doctor.name.length < 3) {
      alert('Họ và tên bác sĩ phải có ít nhất 3 ký tự.');
      return false;
    }

    if (!this.isValidEmail(doctor.email)) {
      alert('Email không hợp lệ. Ví dụ: abc@example.com');
      return false;
    }

    if (!this.isValidPhoneNumber(doctor.phoneNumber)) {
      alert('Số điện thoại phải có ít nhất 10 chữ số và bắt đầu bằng số 0.');
      return false;
    }

    if (!doctor.specialtyId) {
      alert('Chuyên khoa là bắt buộc.');
      return false;
    }

    return true;
  }

  // Kiểm tra email hợp lệ
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Kiểm tra số điện thoại hợp lệ
  isValidPhoneNumber(phoneNumber: string): boolean {
    const phonePattern = /^0\d{9,10}$/;  // Kiểm tra số điện thoại bắt đầu bằng 0 và có 10-11 chữ số
    return phonePattern.test(phoneNumber);
  }

  // Xóa bác sĩ
  deleteDoctor(id: number) {
    this.doctorService.deleteDoctors(id).subscribe(() => {
      this.loadDoctors();
    });
  }

  // Reset form sau khi thêm mới hoặc cập nhật
  resetForm() {
    this.newDoctor = {
      id: 0,
      name: '',
      email: '',
      phoneNumber: '',
      gender: true,
      profilePicture: '',
      specialtyId: 0,
      password: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.isEditMode = false;
    this.errorMessages = [];  // Reset lỗi
  }

  // Lấy tên chuyên khoa
  getSpecialtyName(specialtyId: number): string {
    const specialty = this.specialties.find(s => s.id === specialtyId);
    return specialty ? specialty.name : 'Không xác định';
  }

  updatePaginatedDoctors(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDoctors = this.doctors.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedDoctors();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePaginatedDoctors();
    }
  }

  totalPages(): number {
    return Math.ceil(this.doctors.length / this.itemsPerPage);
  }
}
