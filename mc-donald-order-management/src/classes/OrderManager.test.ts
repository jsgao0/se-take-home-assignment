import { OrderStatus, OrderType } from "../types";
import OrderManager from "./OrderManager";

describe('OrderManager', () => {
  it('init OrderManager', () => {
    const orderManager = new OrderManager();
    expect(orderManager.orders).toEqual([]);
  });

  it('addOrder', () => {
    const orderManager = new OrderManager();

    // add the first order
    orderManager.addOrder({
      type: OrderType.Normal,
      status: OrderStatus.Pending,
    });
    expect(orderManager.orders).toEqual([
      {
        id: 1, // the first order
        type: OrderType.Normal,
        status: OrderStatus.Pending,
      }
    ]);

    // test if the id is incremented
    orderManager.addOrder({
      type: OrderType.Normal,
      status: OrderStatus.Pending,
    });
    expect(orderManager.orders).toEqual([
      {
        id: 1, // the first order
        type: OrderType.Normal,
        status: OrderStatus.Pending,
      },
      {
        id: 2, // the second order
        type: OrderType.Normal,
        status: OrderStatus.Pending,
      }
    ]);
  });

  it('getOrders', () => {
    const orderManager = new OrderManager();
    orderManager.addOrder({
      type: OrderType.Normal,
      status: OrderStatus.Pending,
    });
    orderManager.addOrder({
      type: OrderType.Vip,
      status: OrderStatus.Processing,
    });
    orderManager.addOrder({
      type: OrderType.Normal,
      status: OrderStatus.Complete,
    });
    expect(orderManager.getOrders([OrderStatus.Pending])).toEqual([
      {
        id: 1,
        type: OrderType.Normal,
        status: OrderStatus.Pending,
      }
    ]);
    expect(orderManager.getOrders([OrderStatus.Processing])).toEqual([
      {
        id: 2,
        type: OrderType.Vip,
        status: OrderStatus.Processing,
      }
    ]);
    expect(orderManager.getOrders([OrderStatus.Complete])).toEqual([
      {
        id: 3,
        type: OrderType.Normal,
        status: OrderStatus.Complete,
      }
    ]);

    // test if it can get orders by multiple statuses
    expect(orderManager.getOrders([OrderStatus.Pending, OrderStatus.Complete])).toEqual([
      {
        id: 1,
        type: OrderType.Normal,
        status: OrderStatus.Pending,
      },
      {
        id: 3,
        type: OrderType.Normal,
        status: OrderStatus.Complete,
      }
    ]);
  });
});
