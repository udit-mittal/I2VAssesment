import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Discount } from '../models/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = 'http://localhost:5182';

  constructor(private http: HttpClient) { }

  getDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(`${this.apiUrl}/Discount`);
  }

  getDiscountById(id: number): Observable<Discount> {
    return this.http.get<Discount>(`${this.apiUrl}/Discount/${id}`);
  }

  validateDiscountCode(code: string): Observable<Discount> {
    return this.http.get<Discount>(`${this.apiUrl}/Discount/validate/${code}`);
  }

  addDiscount(discount: Discount): Observable<Discount> {
    return this.http.post<Discount>(`${this.apiUrl}/Discount`, discount);
  }

  updateDiscount(discount: Discount): Observable<Discount> {
    return this.http.put<Discount>(`${this.apiUrl}/Discount`, discount);
  }

  deleteDiscount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Discount/${id}`);
  }
} 