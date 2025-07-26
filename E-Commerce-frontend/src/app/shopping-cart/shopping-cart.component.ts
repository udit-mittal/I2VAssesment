import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';

import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';
import { Discount } from '../models/discount';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { DiscountService } from '../services/discount.service';

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

@Component({
  selector: 'app-shopping-cart',
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
    MatDividerModule
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  products: Product[] = [];
  cartItems: CartItemWithProduct[] = [];
  availableDiscounts: Discount[] = [];
  selectedDiscountCode: string = '';
  appliedDiscount: Discount | null = null;
  cartTotal: number = 0;
  cartTotalAfterDiscount: number = 0;
  displayedColumns: string[] = ['product', 'price', 'quantity', 'subtotal', 'actions'];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private discountService: DiscountService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private http: HttpClient // Add HttpClient for direct API call
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCartItems();
    this.loadDiscounts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
      }
    });
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe({
      next: (cartItems) => {
        this.cartItems = cartItems.map(item => ({
          ...item,
          product: this.products.find(p => p.productID === item.productID)
        }));
        this.calculateCartTotal();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        this.snackBar.open('Error loading cart items', 'Close', { duration: 3000 });
      }
    });
  }

  loadDiscounts(): void {
    this.discountService.getDiscounts().subscribe({
      next: (discounts) => {
        this.availableDiscounts = discounts;
      },
      error: (error) => {
        console.error('Error loading discounts:', error);
      }
    });
  }

  addToCart(product: Product, quantity: number): void {
    if (quantity <= 0) {
      this.snackBar.open('Quantity must be greater than 0', 'Close', { duration: 3000 });
      return;
    }

    const existingItem = this.cartItems.find(item => item.productID === product.productID);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartService.updateCartItem(existingItem).subscribe({
        next: () => {
          this.snackBar.open('Cart updated successfully', 'Close', { duration: 2000 });
          this.calculateCartTotal();
        },
        error: (error) => {
          console.error('Error updating cart:', error);
          this.snackBar.open('Error updating cart', 'Close', { duration: 2000 });
        }
      });
    } else {
      const newCartItem: CartItem = {
        cartItemID: 0,
        productID: product.productID,
        quantity: quantity
      };

      this.cartService.addToCart(newCartItem).subscribe({
        next: () => {
          console.log('Item added to cart');
          //this.snackBar.open('Item added to cart', 'Close', { duration: 2000 });
          console.log('Item returned to cart');
          this.loadCartItems();
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.snackBar.open('Error adding to cart', 'Close', { duration: 3000 });
        }
      });
    }
  }

  updateQuantity(cartItem: CartItemWithProduct, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeFromCart(cartItem.cartItemID);
      return;
    }

    cartItem.quantity = newQuantity;
    this.cartService.updateCartItem(cartItem).subscribe({
      next: () => {
        this.calculateCartTotal();
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.snackBar.open('Error updating quantity', 'Close', { duration: 3000 });
      }
    });
  }

  removeFromCart(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.cartItemID !== cartItemId);
        this.calculateCartTotal();
        this.snackBar.open('Item removed from cart', 'Close', { duration: 2000 });
      },
      error: (error) => {
        console.error('Error removing from cart:', error);
        this.snackBar.open('Error removing from cart', 'Close', { duration: 3000 });
      }
    });
  }

  applyDiscount(): void {
    if (!this.selectedDiscountCode.trim()) {
      this.snackBar.open('Please enter a discount code', 'Close', { duration: 3000 });
      return;
    }

    this.discountService.validateDiscountCode(this.selectedDiscountCode).subscribe({
      next: (discount) => {
        this.appliedDiscount = discount;
        this.calculateCartTotalAfterDiscount();
        this.snackBar.open(`Discount applied: ${discount.discountPercentage * 100}% off`, 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error applying discount:', error);
        this.snackBar.open('Invalid discount code. Please try again.', 'Close', { duration: 3000 });
        this.appliedDiscount = null;
        this.cartTotalAfterDiscount = this.cartTotal;
        this.selectedDiscountCode = ''; // Clear the input field
      }
    });
  }

  calculateCartTotal(): void {
    this.cartTotal = this.cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
    
    if (this.appliedDiscount) {
      this.calculateCartTotalAfterDiscount();
    } else {
      this.cartTotalAfterDiscount = this.cartTotal;
    }
  }

  calculateCartTotalAfterDiscount(): void {
    if (this.appliedDiscount) {
      const discountAmount = this.cartTotal * this.appliedDiscount.discountPercentage;
      this.cartTotalAfterDiscount = this.cartTotal - discountAmount;
    } else {
      this.cartTotalAfterDiscount = this.cartTotal;
    }
  }

  getSubtotal(item: CartItemWithProduct): number {
    return (item.product?.price || 0) * item.quantity;
  }

  clearDiscount(): void {
    this.appliedDiscount = null;
    this.selectedDiscountCode = '';
    this.cartTotalAfterDiscount = this.cartTotal;
  }

  getAvailableDiscountCodes(): string {
    return this.availableDiscounts.map(d => d.discountCode).join(', ');
  }

  makeSale(): void {
    if (this.cartItems.length === 0) {
      this.snackBar.open('Cart is empty', 'Close', { duration: 3000 });
      return;
    }
    const salesItems = this.cartItems.map(item => ({
      productID: item.productID,
      quantity: item.quantity
    }));
    const sale = {
      totalAmount: this.cartTotalAfterDiscount,
      saleDate: new Date().toISOString(),
      salesItems: salesItems
    };
    this.http.post('http://localhost:5182/Sales', sale).subscribe({
      next: () => {
        this.snackBar.open('Sale completed successfully!', 'Close', { duration: 3000 });
        // Clear the cart
        this.cartItems.forEach(item => {
          this.cartService.removeFromCart(item.cartItemID).subscribe();
        });
        this.cartItems = [];
        this.calculateCartTotal();
        this.appliedDiscount = null;
        this.selectedDiscountCode = '';
        this.cartTotalAfterDiscount = 0;
      },
      error: (error) => {
        console.error('Error completing sale:', error);
        this.snackBar.open('Error completing sale', 'Close', { duration: 3000 });
      }
    });
  }
} 