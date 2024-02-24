import { act, renderHook } from "@testing-library/react";
import { OrderType, OrderStatus } from "../types";
import useOrderProcessor from "./useOrderProcessor";

jest.useFakeTimers();

describe('useOrderProcessor', () => {
  afterAll(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('createOrder without available bots', () => {
    const { result } = renderHook(() => useOrderProcessor());

    act(() => {
      result.current.createOrder({
        type: OrderType.Normal,
        status: OrderStatus.Pending,
      });
    });
    
    expect(result.current.getOrders(OrderStatus.Pending).length).toBe(1);
    expect(result.current.getOrders(OrderStatus.Complete).length).toBe(0);
  });

  it('createBot without pending orders', () => {
    const { result } = renderHook(() => useOrderProcessor());

    act(() => {
      result.current.createBot();
    });
    
    expect(result.current.getOrders(OrderStatus.Pending).length).toBe(0);
    expect(result.current.getOrders(OrderStatus.Complete).length).toBe(0);
  });
  
  it('createOrder with idle bots', () => {
    const { result } = renderHook(() => useOrderProcessor());

    act(() => {
      result.current.createBot();
      result.current.createOrder({
        type: OrderType.Normal,
        status: OrderStatus.Pending,
      });
    });

    expect(result.current.getOrders(OrderStatus.Pending).length).toBe(1);
    expect(result.current.getOrders(OrderStatus.Complete).length).toBe(0);
  });

  it('createBot with pending orders', () => {
    const { result } = renderHook(() => useOrderProcessor());

    act(() => {
      result.current.createOrder({
        type: OrderType.Normal,
        status: OrderStatus.Pending,
      });
      result.current.createBot();
    });
    
    expect(result.current.getOrders(OrderStatus.Pending).length).toBe(1);
    expect(result.current.getOrders(OrderStatus.Complete).length).toBe(0);

  });

  it('removeBot', () => {
    const { result } = renderHook(() => useOrderProcessor());

    // create bot with created order then start processing
    act(() => {
      result.current.createOrder({
        type: OrderType.Normal,
        status: OrderStatus.Pending,
      });
      result.current.createBot();
    });
    expect(result.current.getOrders(OrderStatus.Pending).length).toBe(1);
    expect(result.current.getOrders(OrderStatus.Complete).length).toBe(0);

    // remove the bot with processing order, then the order should be pending again
    act(() => {
      jest.advanceTimersByTime(9000);
      result.current.removeBot();
    });
    expect(result.current.getOrders(OrderStatus.Pending).length).toBe(1);
    expect(result.current.getOrders(OrderStatus.Complete).length).toBe(0);
  });

});
