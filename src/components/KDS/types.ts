export interface OrderItem {
  qty: number;
  name: string;
  alert?: string;
  modifier?: string;
}

export type OrderStatus = 'overdue' | 'warning' | 'normal' | 'new';
export type OrderType = 'takeout' | 'dine-in';

export interface Order {
  id: number;
  ticket: string;
  type: OrderType;
  status: OrderStatus;
  statusLabel: string;
  elapsed: string;
  elapsedSeconds: number;
  reservationTime?: string;
  reservationEndTime?: string;
  items: OrderItem[];
}