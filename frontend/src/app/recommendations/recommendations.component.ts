import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {
  products: any[] = [];
  recommendations: any[] = [];
  selectedProductId: string = '';
  userPrefText: string = '';
  mode: 'product' | 'text' = 'product';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  getRecs() {
    let criteria = {};
    if (this.mode === 'product') {
      if (!this.selectedProductId) return;
      criteria = { productId: this.selectedProductId };
    } else {
      if (!this.userPrefText) return;
      criteria = { text: this.userPrefText };
    }

    this.apiService.getRecommendations(criteria).subscribe(data => {
      this.recommendations = data;
    });
  }
}
