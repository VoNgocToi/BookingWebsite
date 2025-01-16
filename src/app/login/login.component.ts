import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

  isLoggedIn = false;
  userInfo: any = null;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient,private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Kiểm tra lại token sau khi người dùng redirect trở lại trang login
    this.route.queryParams.subscribe(params => {
      const token = params['token']; // token từ URL query parameter

      if (token) {
        this.getGoogleUserInfo(token); // Nếu có token, gọi API Google
      } else {
        // Token không có trong URL, kiểm tra localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          this.getGoogleUserInfo(storedToken); // Nếu token có trong localStorage, lấy thông tin
        }
      }
    });
  }

  // Hàm gọi API Google để lấy thông tin người dùng từ token
  getGoogleUserInfo(token: string): void {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;
    this.http.get(url).subscribe(
      (response: any) => {
        console.log('User info:', response);
        localStorage.setItem('email', response.email);
        this.router.navigate(['/']); // Redirect sau khi lấy thông tin người dùng
      },
      error => {
        console.error('Error fetching user info:', error);
      }
    );
  }

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
