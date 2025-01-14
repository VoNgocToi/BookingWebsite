import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from '../header/header.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

declare var gapi: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}


 // Import jwt-decode

onLogin() {
  this.authService.loginUser(this.email, this.password).subscribe(
    (response) => {
      // Lưu token vào localStorage
      const token = localStorage.getItem('token'); 

      if (token) {
        localStorage.setItem('token', token);

        // Giải mã token để lấy thông tin vai trò
        const decodedToken: any = jwtDecode(token); 
        const roles = decodedToken['roles']; // Lấy mảng roles từ decoded token

        console.log('Decoded Token:', decodedToken);
        console.log('Roles:', roles);

        // Kiểm tra vai trò người dùng
        if (roles && roles.includes('MANAGE')) {
          this.router.navigate(['/admindb']); // Chuyển hướng đến trang admin
        }
        if (roles && roles.includes('STAFF')) {
          this.router.navigate(['/doctordb']); // Chuyển hướng đến trang admin
        }
        if (roles && roles.includes('CUST')) {
          this.router.navigate(['/home']); // Chuyển hướng đến trang admin
        }
        
      } else {
        console.error('Token không có trong localStorage');
        Swal.fire({
          title: 'Đăng nhập thất bại',
          text: 'Không tìm thấy token. Vui lòng thử lại.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    },
    (error) => {
      console.error('Login error:', error);
      Swal.fire({
        title: 'Đăng nhập thất bại',
        text: 'Email hoặc mật khẩu sai',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  );
}

}
