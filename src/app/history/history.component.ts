import { Component, OnInit } from '@angular/core';
import { Histories } from '../model/history.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from '../sidebar-admin/sidebar-admin.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HistoryService } from '../service/history.service';
import { Doctor } from '../model/doctor.model';
import { AuthService } from '../service/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarAdminComponent, HeaderComponent, FooterComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {

  doctorName: string = '';
  searchQuery: string = '';
  histories: Histories[] = []; 
  selectedHistory: any = {
    id: 0,
    userId: 0,
    userName: '',
    doctorId: 0,
    doctorName: '',
    description: '',
    files: '',
    createdAt: new Date,
    updatedAt: new Date,
    }  // Hồ sơ bệnh án đang chọn để chỉnh sửa
  
  currentPage: number = 1; // Trang hiện tại
  itemsPerPage: number = 5; // Số hàng trên mỗi trang
  paginatedHistories: Histories[] = [];

  constructor(private historyService: HistoryService, private authService: AuthService) { }

  ngOnInit(): void {
    this.historyService.getDoctorByUserId().subscribe({
      next: (doctorData) => {
        this.doctorName = doctorData.name;  // Gán tên bác sĩ vào doctorName
      },
    });
    
    const token = localStorage.getItem('token');
    if (token) {
          const decodedToken: any = jwtDecode(token); // Giải mã token
          const userId = decodedToken.sub; 
          this.getDoctorId(userId);
        }
    this.loadHistories();
  }

  searchHistory(): void {
    const id = this.searchQuery;
    if (id) {
      const historyId = Number(id);
      this.historyService.findHistoryByUserId(historyId).subscribe(
        (history: Histories) => {
          this.selectedHistory = history;
          console.log('Hồ sơ bệnh án tìm được:', history);
        },
      );
    } else {
      console.log('Vui lòng nhập ID hồ sơ bệnh án');
    }
  }

  getDoctorId(userId: number): void {
    if (userId) {
      this.historyService.getDoctorId(userId).subscribe(
        (doctorId: number) => {
          this.selectedHistory.doctorId = doctorId; // Gán doctorId vào selectedHistory
        },
      );
    }
  }

  loadHistories(): void {
    this.historyService.getDoctorByUserId().subscribe(
      (doctor: Doctor) => {
        const doctorId = doctor.id;
        this.historyService.getAllHistorys(doctorId).subscribe(
          (data: Histories[]) => {
            this.histories = data;
            this.updatePaginatedHistories();
          },
          (error) => {
            console.error('Error fetching histories', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching doctor info', error);
      }
    );
  }
  
  onEditHistory(history: Histories): void {
    this.historyService.getHistoryById(history.id).subscribe(
      (data: Histories) => {
        this.selectedHistory = { ...data };  // Cập nhật selectedHistory
      },
      (error) => {
        console.log('Error fetching history for edit', error);
      }
    );
  }
  

  onUpdateHistory(): void {
      if (this.selectedHistory.id) {
        this.historyService.updateHistory(this.selectedHistory.id, this.selectedHistory).subscribe((history: Histories) => {
          this.loadHistories();
          this.selectedHistory = {
            id: 0,
            userId: 0,
            userName: '',
            doctorId: 0,
            doctorName: '',
            description: '',
            files: '',
            createdAt: new Date,
            updatedAt: new Date,
          }
        });
      }
    }

  onDeleteHistory(id: number): void {
    this.historyService.deleteHistory(id).subscribe(
      () => {
        this.histories = this.histories.filter(history => history.id !== id); // Xóa khỏi danh sách hiển thị
      },
      (error) => {
        console.error('Error deleting history', error);
      }
    );
  }

  onSelectHistory(history: Histories) {
    // Gán toàn bộ dữ liệu history, bao gồm cả doctorId, vào selectedHistory
    this.selectedHistory = { ...history };
    console.log('Selected history:', this.selectedHistory); // Kiểm tra để đảm bảo doctorId có giá trị
  }

  addHistory() {
    if (this.selectedHistory.id) {
      // Nếu có id, tức là đang cập nhật
      this.historyService.updateHistory(this.selectedHistory.id, this.selectedHistory)
        .subscribe((history: Histories) => {
          this.histories = this.histories.map(h => h.id === history.id ? history : h);
          this.resetSelectedHistory();
        });
    } else {
      const userId = this.selectedHistory.userId; 
      this.historyService.createHistory(userId, this.selectedHistory)
        .subscribe((history: Histories) => { // Kiểm tra dữ liệu trả về từ backend
          this.histories.unshift(history); // Thêm vào danh sách
          this.resetSelectedHistory();
          this.updatePaginatedHistories();
        });
    }
  }
  
resetSelectedHistory() {
  this.selectedHistory = {
    id: 0,
    userId: 0,  // Chắc chắn rằng userId được reset nếu cần
    userName: '',
    doctorId: 0,
    doctorName: '',
    description: '',
    files: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

updatePaginatedHistories(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedHistories = this.histories.slice(startIndex, endIndex);
}

previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePaginatedHistories();
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages()) {
    this.currentPage++;
    this.updatePaginatedHistories();
    }
  }

  totalPages(): number {
  return Math.ceil(this.histories.length / this.itemsPerPage);
  }
  
}
