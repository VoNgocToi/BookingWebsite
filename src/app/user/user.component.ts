import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../model/user.model';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserService } from '../service/user.service'; // Đảm bảo đường dẫn chính xác

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, CommonModule, SidebarAdminComponent, HeaderComponent, FooterComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']  // Sửa lại 'styleUrls' thay vì 'styleUrl'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  newUser: User = {
    id: 0,
    password: '',
    email: '',
    userName: '',
    address: '',
    gender: true,
    phoneNumber: '',
    image: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    role: { id: 0, roleName: '' }
  };
  isEditMode: boolean = false;
  searchQuery: string = '';
  currentPage: number = 1; // Trang hiện tại
  itemsPerPage: number = 5; // Số hàng trên mỗi trang
  paginatedUsers: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
      this.updatePaginatedUsers();
    });
  }

  addUser() {
    if (!this.validateUserData(this.newUser)) return;
    this.userService.createUser(this.newUser).subscribe((user: User) => {
      this.users.push(user);
      this.newUser = { id: 0, password: '', email: '', userName: '', address: '', gender: true, phoneNumber: '', image: '', createdAt: new Date(), updatedAt: new Date(), role: { id: 0, roleName: '' } };
    });
  }

  updateUser() {
    if (!this.validateUserData(this.newUser)) return;
    if (this.newUser.id) {
      this.userService.updateUser(this.newUser.id, this.newUser).subscribe((user: User) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = user;
        }
        this.isEditMode = false;
        this.newUser = { id: 0, password: '', email: '', userName: '', address: '', gender: true, phoneNumber: '', image: '', createdAt: new Date(), updatedAt: new Date(), role: { id: 0, roleName: '' } };
      });
    }
  }

  editUser(user: User) {
    this.isEditMode = true;
    this.newUser = { ...user };  // Sao chép thông tin người dùng vào form
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user.id !== id);
    });
  }

  searchUsers() {
    if (this.searchQuery) {
      this.users = this.users.filter(user =>
        user.userName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.loadUsers();  // Reload tất cả người dùng nếu không tìm kiếm
    }
  }

  searchUserById() {
    const userId = Number(this.searchQuery);  // Chuyển đổi searchQuery thành kiểu số
    if (isNaN(userId)) {  // Kiểm tra nếu giá trị không phải là một số hợp lệ
      alert('Vui lòng nhập một ID hợp lệ!');
      return;
    }
    this.userService.getUserById(userId).subscribe(user => {
      if (user) {
        this.newUser = user;  // Gán thông tin người dùng tìm được vào biến newUser
        this.isEditMode = true; // Chuyển sang chế độ chỉnh sửa
      } else {
        alert('Không tìm thấy người dùng!');
      }
    }, error => {
      console.error('Có lỗi khi tìm kiếm người dùng:', error);
    });
  }

  // return true nếu hợp lệ, false nếu không hợp lệ
  validateUserData(user: User): boolean {
    if (!user.userName || user.userName.length < 3) {
      alert('Họ và tên phải có ít nhất 3 ký tự.');
      return false;
    }
    if (!this.validateEmail(user.email)) {
      alert('Email không hợp lệ. VD: nguoiDung1@gmail.com.vn');
      return false;
    }
    if (!this.validatePhoneNumber(user.phoneNumber)) {
      alert('Số điện thoại phải là số từ 10-11 chữ số và bắt đầu bằng 0.');
      return false;
    }
    if (!user.password || user.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự.');
      return false;
    }
    if (!user.address) {
      alert('Địa chỉ không được để trống.');
      return false;
    }
    return true;
  }

  // kiểm email
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  // kiểm sđth
  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^0\d{9,10}$/;
    return phoneRegex.test(phoneNumber);
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  totalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
  }
}