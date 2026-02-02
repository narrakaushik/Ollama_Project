import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit {
  products: any[] = [];
  productForm = {
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: 'https://via.placeholder.com/150'
  };
  editingId: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    // We can use the same getProducts, it returns full list now
    this.apiService.getProducts().subscribe(data => this.products = data);
  }

  onSubmit() {
    if (this.editingId) {
      this.apiService.updateProduct(this.editingId, this.productForm).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    } else {
      this.apiService.createProduct(this.productForm).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  editProduct(product: any) {
    this.editingId = product._id;
    this.productForm = { ...product };
  }

  deleteProduct(id: string) {
    if(!confirm('Are you sure?')) return;
    this.apiService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  resetForm() {
    this.editingId = null;
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: 'https://via.placeholder.com/150'
    };
  }
}
