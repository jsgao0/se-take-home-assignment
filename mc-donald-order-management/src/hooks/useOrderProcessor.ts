import React from "react";
import BotManager from "../classes/BotManager";
import OrderManager from "../classes/OrderManager";
import { Order, OrderStatus } from "../types";

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

  const createOrder = (order: Omit<Order, 'id'>) => {
    orderManager.addOrder(order);
    update();
    processOrder();
  }

  const processOrder = (processTime: number = 10000) => {
    const pendingOrders = orderManager.getOrders(OrderStatus.Pending);
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

  const getOrders = (status: OrderStatus) => {
    return orderManager.getOrders(status);
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
};

export default useOrderProcessor;
