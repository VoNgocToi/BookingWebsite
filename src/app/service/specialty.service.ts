import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Specialty } from '../model/specialty.model';
import { AuthService } from './auth.service'; // Giả sử bạn có AuthService để quản lý token

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {

  private apiUrl = 'http://localhost:8080/api/specialties';

  constructor(private http: HttpClient, private authService: AuthService) { }
  
  getSpecialties(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token available');
      return throwError('Token không có, vui lòng đăng nhập lại.');
    }
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(this.apiUrl, { headers });
  }
  
  private getAuthHeaders(): HttpHeaders {
      const token = this.authService.getToken();  // Lấy token từ AuthService
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
   
    // Lấy tất cả người dùng
    getAllSpecialty(): Observable<Specialty[]> {
      const headers = this.getAuthHeaders();
      return this.http.get<Specialty[]>(`${this.apiUrl}`, { headers });
    }
  
    // Lấy thông tin người dùng theo ID
    getSpecialtyById(id: number): Observable<Specialty> {
      const headers = this.getAuthHeaders();
      return this.http.get<Specialty>(`${this.apiUrl}/${id}`, { headers });
    }
    
    // Tạo người dùng mới
    createSpecialty(specialty: Specialty): Observable<Specialty> {
      const headers = this.getAuthHeaders();
      return this.http.post<Specialty>(`${this.apiUrl}/create-specialty`, specialty, { headers });
    }
  
    // Cập nhật người dùng
    updateSpecialty(id: number, specialty: Specialty): Observable<Specialty> {
      const headers = this.getAuthHeaders();
      return this.http.put<Specialty>(`${this.apiUrl}/${id}`, specialty, { headers });
    }
  
    // Xóa người dùng
    deleteSpecialty(id: number): Observable<void> {
      const headers = this.getAuthHeaders();
      return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
    }
  
}
