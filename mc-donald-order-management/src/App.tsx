import { OrderType, OrderStatus } from './types';
import useOrderProcessor from './hooks/useOrderProcessor';
import './App.css';

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
