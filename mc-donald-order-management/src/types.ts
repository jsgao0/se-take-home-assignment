
export enum OrderType {
  Normal = 'normal',
  Vip = 'vip',
}

export enum OrderStatus {
  Pending = 'pending',
  Complete = 'complete',
}

export interface Order {
  id: number;
  type: OrderType;
  status: OrderStatus;
}

export interface Bot {
  id: string; // uuid
  processingOrder: Order | null;
  processId?: NodeJS.Timeout;
}
