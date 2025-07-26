import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:5182';

  constructor(private http: HttpClient) { }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales`);
  }

  createSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/Sales`, sale);
  }

  getSalesReport(date?: string): Observable<any> {
    let url = `${this.apiUrl}/Sales/report`;
    if (date) {
      url += `?date=${date}`;
    }
    return this.http.get<any>(url);
  }
} 