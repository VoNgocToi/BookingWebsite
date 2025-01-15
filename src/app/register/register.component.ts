import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HeaderComponent, RouterModule, FooterComponent, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  retypePassword: string = '';

  userName: string ='';
  genDer: boolean = true;
  phoneNumber: string = '';
  address: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onRegister() {
    
    if (this.password !== this.retypePassword) {
      Swal.fire({
        title: 'Đăng ký thất bại',
        text: 'Mật khẩu không trùng khớp!',
        icon: 'error',
        confirmButtonText: 'OK',
        })
      return;
    }

    this.authService.registerUser(this.email, this.password, this.retypePassword, this.userName, this.genDer, this.phoneNumber, this.address).subscribe(
      (response) => {
        Swal.fire({
          title: 'Đăng ký thành công',
          icon: 'success',
          confirmButtonText: 'OK',
          })
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error("Đăng ký thất bại", error);
        Swal.fire({
          title: 'Lỗi',
          icon: 'error',
          confirmButtonText: 'OK',
          })
      }
    );
  }
}
