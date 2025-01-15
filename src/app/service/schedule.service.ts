// schedule.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from '../model/schedule.model';
import { TimeSlot } from '../model/timeslot.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = 'http://localhost:8080/api/schedules'; // Đường dẫn API để lấy danh sách lịch trình

  constructor(private http: HttpClient, private authService: AuthService) { }

   private getAuthHeaders(): HttpHeaders {
          const token = this.authService.getToken();  // Lấy token từ AuthService
          return new HttpHeaders().set('Authorization', `Bearer ${token}`);
        }
  getAllSchedule(): Observable<Schedule[]> {
          const headers = this.getAuthHeaders();
          return this.http.get<Schedule[]>(`${this.apiUrl}/all-schedule`, { headers });
       }
       
  getSchedulesByDoctorId(doctorId: number): Observable<Schedule[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Schedule[]>(`${this.apiUrl}/schedule/${doctorId}`,{ headers });
  }

  getTimeSlotsByScheduleId(scheduleId: number): Observable<TimeSlot[]>{
    const headers = this.getAuthHeaders();
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/timeSlots/${scheduleId}`,{ headers });
  }
}
