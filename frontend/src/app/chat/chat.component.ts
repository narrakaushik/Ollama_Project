import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: { sender: 'user' | 'ai', text: string }[] = [];
  userInput = '';
  loading = false;

  constructor(private apiService: ApiService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const msg = this.userInput;
    this.messages.push({ sender: 'user', text: msg });
    this.userInput = '';
    this.loading = true;

    this.apiService.sendMessage(msg).subscribe({
      next: (res) => {
        this.messages.push({ sender: 'ai', text: res.response });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.messages.push({ sender: 'ai', text: 'Error: Could not extract answer.' });
        this.loading = false;
      }
    });
  }
}
