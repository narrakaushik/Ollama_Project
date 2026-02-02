import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AI Shop';
  view: 'chat' | 'recs' | 'manage' = 'chat';

  constructor(private apiService: ApiService) {}

  seed() {
    this.apiService.seedProducts().subscribe(
      res => alert('Seeded products successfully! Now run "npm run index" in backend.'),
      err => alert('Error seeding: ' + err.message)
    );
  }
}
