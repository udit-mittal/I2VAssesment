import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Product } from '../models/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
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
    MatTableModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isAddingProduct: boolean = false;
  isEditingProduct: boolean = false;
  selectedProduct: Product | null = null;
  newProduct: Product = { productID: 0, productName: '', price: 0 };
  displayedColumns: string[] = ['productName', 'price', 'actions'];

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Products loaded successfully:', products);
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open(`Error loading products: ${error.message || 'Unknown error'}`, 'Close', { duration: 3000 });
      }
    });
  }

  addProduct(): void {
    console.log('addProduct called');
    console.log('newProduct:', this.newProduct);
    
    if (!this.newProduct.productName.trim() || this.newProduct.price <= 0) {
      console.log('Validation failed - productName:', this.newProduct.productName, 'price:', this.newProduct.price);
      this.snackBar.open('Please fill in all fields correctly', 'Close', { duration: 3000 });
      return;
    }

    console.log('Calling API to add product:', this.newProduct);
    this.productService.addProduct(this.newProduct).subscribe({
      next: (product) => {
        console.log('Product added successfully:', product);
        this.snackBar.open('Product added successfully', 'Close', { duration: 2000 });
        this.loadProducts();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.snackBar.open(`Error adding product: ${error.message || 'Unknown error'}`, 'Close', { duration: 3000 });
      }
    });
  }

  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.isEditingProduct = true;
    this.isAddingProduct = false;
  }

  updateProduct(): void {
    if (!this.selectedProduct || !this.selectedProduct.productName.trim() || this.selectedProduct.price <= 0) {
      this.snackBar.open('Please fill in all fields correctly', 'Close', { duration: 3000 });
      return;
    }

    this.productService.updateProduct(this.selectedProduct.productID, this.selectedProduct).subscribe({
      next: () => {
        this.snackBar.open('Product updated successfully', 'Close', { duration: 2000 });
        this.loadProducts();
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Error updating product:', error);
        this.snackBar.open('Error updating product', 'Close', { duration: 3000 });
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully', 'Close', { duration: 2000 });
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
        }
      });
    }
  }

  showAddForm(): void {
    console.log('showAddForm called');
    this.isAddingProduct = true;
    this.isEditingProduct = false;
    console.log('isAddingProduct:', this.isAddingProduct);
    console.log('newProduct:', this.newProduct);
  }

  resetForm(): void {
    this.newProduct = { productID: 0, productName: '', price: 0 };
    this.selectedProduct = null;
    this.isAddingProduct = false;
    this.isEditingProduct = false;
  }

  cancelForm(): void {
    this.resetForm();
  }
}
