import { Order, OrderType, OrderStatus } from '../types';

class OrderManager {
  orders: Order[];

  constructor() {
    this.orders = [];
  }

  addOrder(order: Omit<Order, 'id'>) {
    const newOrder = {
      ...order,
      id: this.orders.length + 1,
    };
    if (order.type === OrderType.Normal) {
      this.orders.push(newOrder);
    } else {
      const found = this.orders.find(order => order.type === OrderType.Normal);
      if (found) {
        const foundIndex = this.orders.indexOf(found);
        this.orders.splice(foundIndex, 0, newOrder);
      } else {
        this.orders.unshift(newOrder);
      }
    }
  }

  getOrders(status: OrderStatus) {
    return this.orders.filter(order => order.status === status);
  }
}

export default OrderManager;
