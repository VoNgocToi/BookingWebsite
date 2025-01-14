// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Thay thế bằng service xác thực của bạn

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = next.data['role'] as string;
    const userRole = this.authService.getUserRole(); // Lấy quyền từ authService của bạn

    if (requiredRole && userRole !== requiredRole) {
      this.router.navigate(['/unauthorized']); // Chuyển đến trang lỗi nếu quyền không đủ
      return false;
    }

    if (state.url === '/admindb') {
      this.router.navigate(['/admindb/tong-quan']);
      return false;
    }
    if (state.url === '/doctordb') {
      this.router.navigate(['/doctordb/doctor-schedule']);
      return false;
    }

    return true;
  }
}
