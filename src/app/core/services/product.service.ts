import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { ProductList } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class productService {
  private readonly apiUrl = 'https://dummyjson.com/products';
  private readonly limit = 8;

  private searchIdSource = new BehaviorSubject<string>('');
  searchId$ = this.searchIdSource.asObservable();

  updateSearchId(id: string) {
    this.searchIdSource.next(id);
  }

  constructor(private http: HttpClient) { }

  getProducts(page: number, searchId?: string): Observable<ProductList> {
    const skip = (page - 1) * this.limit;
    const url = searchId
      ? `${this.apiUrl}/search?q=${searchId}&limit=${this.limit}&skip=${skip}`
      : `${this.apiUrl}?limit=${this.limit}&skip=${skip}`;

    return this.http.get<any>(url).pipe(
      map((res) => ({
        page: page,
        per_page: this.limit,
        total: res.total,
        total_pages: Math.ceil(res.total / this.limit),
        products: res.products,
      }))
    );
  }

  getproductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((product) => ({
        data: product,
      }))
    );
  }

  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, product);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
