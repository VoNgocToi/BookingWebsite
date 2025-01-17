import { Routes } from '@angular/router';
import { DoctorComponent } from './doctor/doctor.component';
import { UserManagementComponent } from './user/user.component';
import { BookingComponent } from './booking/booking.component';
import { HistoryComponent } from './history/history.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { TimeSlotComponent } from './time-slot/time-slot.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPassComponent } from './forgot-pass/forgotpass.component';
import { ChangePassComponent } from './change-pass/changepass.component';
import { ResetPassComponent } from './reset-pass/resetpass.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserBookingComponent } from './user-booking/user-booking.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { GioiThieuComponent } from './gioi-thieu/gioi-thieu.component';
import { LienHeComponent } from './lien-he/lien-he.component';
import { UserBookingDetailsComponent } from './user-bookingdetails/user-bookingdetails.component';
import { DoctorScheduleComponent } from './doctor-schedule/doctor-schedule.component';
import { AuthGuard } from './authgual/authgual.component';
import { UnauthorizedComponent } from './authgual/unauthorized.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { SidebarDoctorComponent } from './sidebar-doctor/sidebar-doctor.component';
import { TongQuanComponent } from './tong-quan/tong-quan.component';
import { StatisticsComponent } from './statistics/statistics.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
          { path: '', component: HomeComponent }, // Trang chủ
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent },
          { path: 'forgot-password', component: ForgotPassComponent },
          { path: 'change-password', component: ChangePassComponent },
          { path: 'reset-password', component: ResetPassComponent },
          { path: 'user-profile', component: UserProfileComponent },
          { path: 'user-booking', component: UserBookingComponent },
          { path: 'user-history', component: UserHistoryComponent },
          { path: 'user-bookingdetails', component: UserBookingDetailsComponent },
          { path: 'about', component: GioiThieuComponent },
          { path: 'services', component: LienHeComponent },
        ],
      },
      {
        path: 'admindb',
        canActivate: [AuthGuard],
        data: { role: 'MANAGE' },
        component: SidebarAdminComponent, // Cần quyền admin để vào
        children: [
          { path: 'user', component: UserManagementComponent },
          { path: 'booking', component: BookingComponent },
          { path: 'specialty', component: SpecialtyComponent },
          { path: 'time-slot', component: TimeSlotComponent },
          { path: 'doctor', component: DoctorComponent },
          { path: 'tong-quan', component: TongQuanComponent },
          { path: 'doctor-schedule', component: DoctorScheduleComponent },
          { path: 'history', component: HistoryComponent },
        ],
      },
      {
        path: 'doctordb',
        canActivate: [AuthGuard],
        data: { role: 'STAFF' },
        component: SidebarDoctorComponent,
        children: [
          { path: 'doctor-schedule', component: DoctorScheduleComponent },
          { path: 'history', component: HistoryComponent },
        ],
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent,
      },
      { path: '**', redirectTo: '', pathMatch: 'full' },
];
