import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private apiUrl = 'http://localhost:8080/api/statistics'; // URL API backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();  // Lấy token từ AuthService
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getStatisticsOverview(): Observable<any> {
    const headers = this.getAuthHeaders(); 
    return this.http.get(`${this.apiUrl}/overview`, { headers });
  }
}
