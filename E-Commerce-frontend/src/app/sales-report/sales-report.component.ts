import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { SalesService } from '../services/sales.service';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule
  ],
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent {
  selectedDate: Date = new Date();
  totalRevenue: number = 0;
  mostSoldProductName: string = '';
  isLoading: boolean = false;

  constructor(
    private salesService: SalesService,
    private snackBar: MatSnackBar
  ) { }

  generateReport(): void {
    this.isLoading = true;
    const dateString = this.selectedDate.toISOString().split('T')[0];
    this.salesService.getSalesReport(dateString).subscribe({
      next: (report) => {
        console.log('Report received:', report);
        this.totalRevenue = report.totalRevenue;
        this.mostSoldProductName = report.prodName || 'N/A';
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error generating sales report', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onDateChange(): void {
    this.generateReport();
  }
} 