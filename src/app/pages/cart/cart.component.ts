import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Cart, CartItem } from './../../models/cart.model';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: []
})
export class CartComponent implements OnInit {

  cart: Cart = { items: [] };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = ['product', 'name', 'price', 'quantity', 'total', 'action'];

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(cartItem: CartItem): void {
    this.cartService.removeFromCart(cartItem);
  }

  onRemoveQuantity(cartItem: CartItem): void {
    this.cartService.removeQuantity(cartItem);
  }

  onAddQuantity(cartItem: CartItem): void {
    this.cartService.addToCart(cartItem);
  }

  onCheckOut(): void {
    this.http.post('http://localhost4242/checkout', { items: this.cart.items }).subscribe(async (res: any) => {
      let stripe = await loadStripe('');
      stripe?.redirectToCheckout({ sessionId: res.id });
    });
  }

}
