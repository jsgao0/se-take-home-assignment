import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Bot, Order, OrderType, OrderStatus } from './types';
import './App.css';

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

  getOrders(statuses: OrderStatus[]) {
    return this.orders.filter(order => statuses.indexOf(order.status) > -1);
  }
}

class BotManager {
  bots: Bot[];

  constructor() {
    this.bots = [];
  }

  addBot() {
    const newBot = {
      id: uuidv4(),
      processingOrder: null,
    };
    this.bots.push(newBot);
  }

  removeBot() {
    return this.bots.pop();
  }
}

const useOrderProcessor = () => {
  const {
    orderManager,
    botManager,
  } = React.useMemo(() => ({
    orderManager: new OrderManager(),
    botManager: new BotManager()
  }), []);
  const [, setCounter] = React.useState(0);

  // force re-render
  const update = () => setCounter(n => n + 1);

  const createOrder = async (order: Omit<Order, 'id'>) => {
    orderManager.addOrder(order);
    update();
    processOrder();
  }

  const processOrder = (processTime: number = 10000) => {
    const pendingOrders = orderManager.getOrders([OrderStatus.Pending]);
    if (pendingOrders.length === 0) {
      return;
    }

    const availableBots = botManager.bots.filter(bot => bot.processingOrder === null);
    if (availableBots.length === 0) {
      return;
    }

    return new Promise<void>((resolve) => {
      const order = pendingOrders[0];
      const bot = availableBots[0];
      bot.processingOrder = order;
      order.status = OrderStatus.Processing;
      update();

      bot.processId = setTimeout(() => {
        completeOrder(order.id);
        resolve();
      }, processTime);
    });
  };

  const completeOrder = async (orderId: number) => {
    const bot = botManager.bots.find(bot => bot.processingOrder?.id === orderId);
    const order = orderManager.orders.find(order => order.id === orderId);
    if (order && bot) {
      bot.processingOrder = null;
      clearTimeout(bot.processId);
      order.status = OrderStatus.Complete;
      update();
      await processOrder();
    }
  };

  const getOrders = (statuses: OrderStatus[]) => {
    return orderManager.getOrders(statuses);
  }

  const createBot = () => {
    botManager.addBot();

    // available bot, process order
    processOrder();
  
    update();
  };

  const removeBot = () => {
    const bot = botManager.removeBot();
    bot?.processingOrder && (bot.processingOrder.status = OrderStatus.Pending);
    bot?.processId && clearTimeout(bot.processId);
    processOrder();
    update();
  };

  const getProcessingBotByOrderId = (orderId: number) => {
    return botManager.bots.find(bot => bot.processingOrder?.id === orderId);
  }

  return {
    createOrder,
    getOrders,
    createBot,
    removeBot,
    getProcessingBotByOrderId,
  };
}

function App() {
  const orderProcessor = useOrderProcessor();

  return (
    <div className="">
      <h1 className="title">McDonald's Order Management</h1>
      <div className="actions-wrapper">
        <div className="orders-action">
          <button onClick={async () => {
            const newOrder = {
              type: OrderType.Normal,
              status: OrderStatus.Pending,
            };
            orderProcessor.createOrder(newOrder);
          }}>New Normal Order</button>
          <button onClick={async () => {
            const newOrder = {
              type: OrderType.Vip,
              status: OrderStatus.Pending,
            };
            orderProcessor.createOrder(newOrder);
          }}>New VIP Order</button>
        </div>
        <div className="bots-action">
          <button onClick={orderProcessor.createBot}>+ Bot</button>
          <button onClick={orderProcessor.removeBot}>- Bot</button>
        </div>
      </div>
      <div className="orders-information">
        <div className="orders-wrapper pending">
          <h2>Pending Orders</h2>
          <ol className="order-list">
            {orderProcessor.getOrders([OrderStatus.Pending, OrderStatus.Processing])
              .map((order) => {
                const bot = orderProcessor.getProcessingBotByOrderId(order.id);
                return (
                  <li key={order.id}>{`Order: ${order.id}(${order.type})${bot ? ` is being processed by ${bot.id}` : ''}`}</li>
                );
              }
            )}
          </ol>
        </div>
        <div className="orders-wrapper complete">
          <h2>Complete Orders</h2>
          <ol className="order-list">
            {orderProcessor.getOrders([OrderStatus.Complete])
              .map((order) => (
                <li key={order.id}>
                  {`Order ${order.id}(${order.type})`}
                </li>
              )
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
