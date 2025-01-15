import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router'
import { tap, catchError } from 'rxjs/operators';  
import { BookingApiResponse } from '../model/bookingResponse.model';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { Booking } from '../model/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://localhost:8080/api/bookings';  // Địa chỉ API của bạn

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();  // Lấy token từ AuthService
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSpecialties(): Observable<any[]> {
    const token = this.authService.getToken();  // Lấy token từ AuthService
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>('http://localhost:8080/api/specialties', { headers });
  }

  // Lấy danh sách bác sĩ theo chuyên khoa
  getDoctorsBySpecialty(specialtyId: number): Observable<any> {
    const token = this.authService.getToken();  // Lấy token từ AuthService
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/doctors?specialtyId=${specialtyId}`, { headers });
  }

  // Lấy khung giờ có sẵn của bác sĩ
  getAvailableTimeSlots(specialtyId: number, doctorId: number, date: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/available-times?specialtyId=${specialtyId}&doctorId=${doctorId}&date=${date}`, { headers });
  }
  
  getBookingStats(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  // Tạo cuộc hẹn
  createBooking(bookingData: any): Observable<BookingApiResponse> {
    const formattedData = {
      doctorId: Number(bookingData.doctorId),
      timeSlotId: bookingData.timeSlot,
      date: new Date(bookingData.appointmentDate).toISOString().split('T')[0],
    };
  
    console.log('Booking data:', formattedData);
  
    return this.http.post<BookingApiResponse>(`${this.apiUrl}/create-booking`, formattedData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    }).pipe(
      tap(response => {
        if (response?.message) {
          Swal.fire({
            title: 'Cuộc hẹn được tạo thành công',
            text: 'Bạn có thể hủy cuộc hẹn trước khi phòng khám xác nhận!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/home']); // Chuyển về trang home khi nhấn OK
            }
          });
        } else if (response?.error) {
          Swal.fire({
            title: 'Lỗi!',
            text: response.error,
            icon: 'error',
            confirmButtonText: 'OK',
          }); // Hiển thị thông báo lỗi nếu có lỗi từ API
        } 
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        Swal.fire({
          title: 'Cảnh báo',
          text: 'Bạn còn cuộc hẹn chưa hoàn thành',
          icon: 'warning',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/home']); // Chuyển về trang home khi nhấn OK
          }
        });
        // Thay vì trả về null, trả về một đối tượng có kiểu BookingApiResponse
        return of({ message: 'Lỗi khi tạo cuộc hẹn, vui lòng thử lại!', error: 'Unknown error' });
      })
    );
  }
  

  deleteBooking(bookingId: number): Observable<void> {
  const headers = this.getAuthHeaders();  
  return this.http.delete<void>(`${this.apiUrl}/cust/${bookingId}`, { headers });
}

}
