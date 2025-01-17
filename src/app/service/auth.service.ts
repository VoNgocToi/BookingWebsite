import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { error } from 'console';
import { jwtDecode } from 'jwt-decode';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrlRegister = 'http://localhost:8080/api/auth/register';
  private apiUrlLogin = 'http://localhost:8080/api/auth/login';
  private apiUrl = 'http://localhost:8080/api';


  constructor(private http: HttpClient) { }

  registerUser(email: string, password: string, retypePassword: string, userName: string, genDer: boolean, address: string, phoneNumber: string): Observable<any> {
    const body = { email, password, retypePassword, userName, genDer, address, phoneNumber};
    return this.http.post(this.apiUrlRegister, body, { responseType: 'text' }) ;
  }

  loginUser(email: string, password: string): Observable<any> {
    if (!password.trim()) { 
      return throwError(() => new Error('Mật khẩu trống')); 
    }
  
    const body = { email, password };
    return this.http.post<string>('http://localhost:8080/api/auth/login', body, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text' as 'json'
    }).pipe(
      tap(response => {
        try {
          const parsedResponse = JSON.parse(response); // Parse JSON response
          const token = parsedResponse.token; // Lấy token từ đối tượng JSON
  
          if (token) {
            localStorage.setItem('token', token); // Lưu token trực tiếp dưới dạng chuỗi
            localStorage.setItem('email', email);
          }
        } catch (error) {
          console.error("Error parsing response", error);
        }
      })
    );
  }
  
  
  

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  
    // Lưu token vào localStorage sau khi đăng nhập thành công
  setToken(token: string): void {
      localStorage.setItem('token', token);
    }
  
    // Lấy token từ localStorage
  getToken(): string | null {
      return localStorage.getItem('token');
    }
  
    // Thoát đăng nhập
    logout() {
      localStorage.removeItem('token');
  localStorage.removeItem('email'); // Xóa email trong localStorage khi đăng xuất
  localStorage.removeItem('user');
    }

  // Lưu thông tin người dùng vào localStorage
  saveUserToLocalStorage(user: any, token: string) {
    localStorage.setItem('token', token); // Lưu token
    localStorage.setItem('user', JSON.stringify(user)); // Lưu thông tin người dùng
  }

  // Lấy thông tin người dùng từ localStorage
  getUserFromLocalStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Xóa thông tin người dùng khỏi localStorage khi đăng xuất
  removeUserFromLocalStorage(): void {
    localStorage.removeItem('user');
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');  // Lấy token từ localStorage
    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);  // Giải mã token
      const roles = decodedToken.roles || [];  // Lấy mảng roles từ token

      // Nếu có quyền trong mảng roles, trả về quyền đầu tiên (hoặc tùy chỉnh theo yêu cầu)
      return roles.length > 0 ? roles[0] : null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  getUserFromToken(): any {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      return jwtDecode(token);  // Giải mã token và trả về thông tin người dùng
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
}
