import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  seedProducts(): Observable<any> {
    return this.http.post(`${this.apiUrl}/seed`, {});
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat`, { message });
  }

  getRecommendations(criteria: { productId?: string, text?: string }): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/recommendations`, criteria);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }
}
