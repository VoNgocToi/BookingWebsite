import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule], // Nhập FormsModule để dùng ngModel
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class TelegramChatComponent {
  // userMessage: string = '';
  // botResponse: string = '';
  // messages: any[] = [];  // Lưu trữ các tin nhắn từ người dùng và bot

  // private botToken = '7086998947:AAFGPQStmjknarT6zGia8kFEW9O2C1SgIus'; // Thay token thật vào đây
  // private chatId = '-4651452894'; // Thay chatId thật vào đây
  // private telegramApiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  // private getUpdatesUrl = `https://api.telegram.org/bot${this.botToken}/getUpdates`;
  // private setWebhookUrl = `https://api.telegram.org/bot${this.botToken}/setWebhook?url=https://booking-website-five.vercel.app/webhook`; // Thay đổi URL webhook của bạn

  // isChatOpen: boolean = false;

  // toggleChat() {
  //   this.isChatOpen = !this.isChatOpen;
  // }

  // constructor(private http: HttpClient) {
  //   this.setWebhook(); // Cài đặt Webhook cho bot
  //   setInterval(() => {
  //     this.fetchMessages(); // Lấy tin nhắn mới mỗi 5 giây
  //   }, 5000);
  // }

  // // Gửi tin nhắn đến Telegram Bot
  // sendMessage() {
  //   if (this.userMessage.trim()) {
  //     this.http.post(this.telegramApiUrl, {
  //       chat_id: this.chatId,
  //       text: this.userMessage,
  //     }).subscribe({
  //       next: (res) => {
  //         console.log('Message sent:', res);
  //         this.messages.push({ text: this.userMessage, sender: 'user' });
  //         this.botResponse = `Phòng khám xin chào bạn!`;
  //         this.messages.push({ text: this.botResponse, sender: 'bot' });
  //         this.userMessage = ''; // Xóa tin nhắn người dùng sau khi gửi
  //       },
  //       error: (err) => {
  //         console.error('Error sending message:', err);
  //         this.botResponse = 'Gửi tin nhắn thất bại!';
  //       }
  //     });
  //   }
  // }

  // // Lấy các tin nhắn mới từ Telegram và cập nhật tin nhắn từ bot
  // fetchMessages() {
  //   this.http.get(this.getUpdatesUrl).subscribe({
  //     next: (response: any) => {
  //       console.log('Received updates:', response);
  //       if (response.ok) {
  //         response.result.forEach((update: any) => {
  //           const message = update.message;
  //           if (message && message.chat.id.toString() === this.chatId) {
  //             this.messages.push({ text: message.text, sender: 'user' });
  //             // Gửi phản hồi tự động từ bot
  //             this.sendBotReply(message.chat.id, "Phòng khám xin chào bạn!");
  //           }
  //         });
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching updates:', err);
  //     }
  //   });
  // }

  // // Cài đặt Webhook
  // setWebhook() {
  //   this.http.post(this.setWebhookUrl, {}).subscribe({
  //     next: (res) => {
  //       console.log('Webhook set:', res);
  //     },
  //     error: (err) => {
  //       console.error('Error setting webhook:', err);
  //     }
  //   });
  // }

  // // Gửi phản hồi của bot đến người dùng trong group
  // sendBotReply(chatId: number, replyText: string) {
  //   this.http.post(this.telegramApiUrl, {
  //     chat_id: chatId,
  //     text: replyText
  //   }).subscribe({
  //     next: (res) => {
  //       console.log('Bot reply sent:', res);
  //     },
  //     error: (err) => {
  //       console.error('Error sending bot reply:', err);
  //     }
  //   });
  // }
}
