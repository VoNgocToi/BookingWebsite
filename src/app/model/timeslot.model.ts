

export interface TimeSlot {
  id: number;              // ID của TimeSlot
  doctorId: number;
  doctorName: string,          // Thông tin bác sĩ liên quan
  scheduleId: number ;      // Lịch trình liên quan
  scheduleDate: Date,
  startTime: string;       // Giờ bắt đầu (định dạng 'HH:mm:ss')
  endTime: string;         // Giờ kết thúc (định dạng 'HH:mm:ss')
  isAvailable: boolean;    // Tình trạng khả dụng
  createdAt: Date;         // Thời gian tạo
  updatedAt: Date;         // Thời gian cập nhật
}
