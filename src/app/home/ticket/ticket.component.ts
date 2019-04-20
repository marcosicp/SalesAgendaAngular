import { Component, OnInit } from '@angular/core';
import { Productos } from '../../models/producto.model';
import { PosService } from '../../pos.service';
import { DataService } from '../../core/services/data.service';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  ticket: Productos[] = [];

  cartTotal = 0;
  cartNumItems = 0;

  constructor(private ticketSync: PosService, private dataService: DataService) { }

  // Sync with ticketSync service on init
  ngOnInit() {
    this.ticketSync.currentTicket.subscribe(data => this.ticket = data);
    this.ticketSync.currentTotal.subscribe(total => this.cartTotal = total);
    this.ticketSync.currentCartNum.subscribe(num => this.cartNumItems = num);
  }

  // Add item to ticket.
  addItem(item: Productos) {
    // If the item already exists, add 1 to quantity
    if (this.ticket.includes(item)) {
      this.ticket[this.ticket.indexOf(item)].cantidad += 1;
    } else {
      this.ticket.push(item);
    }
    this.syncTicket();
    this.calculateTotal();
  }

  // Remove item from ticket
  removeItem(item: Productos) {
    // Check if item is in array
    if (this.ticket.includes(item)) {
      // Splice the element out of the array
      const index = this.ticket.indexOf(item);
      if (index > -1) {
        // Set item quantity back to 1 (thus when readded, quantity isn't 0)
        this.ticket[this.ticket.indexOf(item)].cantidad = 1;
        this.ticket.splice(index, 1);
      }
    }
    this.syncTicket();
    this.calculateTotal();
  }

  // Reduce quantity by one
  subtractOne(item: Productos) {
    // Check if last item, if so, use remove method
    if (this.ticket[this.ticket.indexOf(item)].cantidad === 1) {
      this.removeItem(item);
    } else {
      this.ticket[this.ticket.indexOf(item)].cantidad = this.ticket[this.ticket.indexOf(item)].cantidad - 1;
    }
    this.syncTicket();
    this.calculateTotal();
  }

  // Calculate cart total
  calculateTotal() {
    let total = 0;
    let cartitems = 0;
    // Multiply item price by item quantity, add to total
    this.ticket.forEach(function(item: Productos) {
      total += (item.precioVenta * item.cantidad);
      cartitems += item.cantidad;
    });
    this.cartTotal = total;
    this.cartNumItems = cartitems;

    // Sync total with ticketSync service.
    this.ticketSync.updateNumItems(this.cartNumItems);
    this.ticketSync.updateTotal(this.cartTotal);
  }

  // Remove all items from cart
  clearCart() {
    // Reduce back to initial quantity (1 vs 0 for re-add)
    this.ticket.forEach(function(item: Productos) {
      item.cantidad = 1;
    });
    // Empty local ticket variable then sync
    this.ticket = [];
    this.syncTicket();
    this.calculateTotal();
  }

  syncTicket() {
    this.ticketSync.changeTicket(this.ticket);
  }

  checkout() {
    if (this.ticket.length > 0) {
      this.dataService.createAsync('pedidos/nuevoPedido', this.ticket, this.dataService.pedidos);
      this.clearCart();
    }
  }

}
