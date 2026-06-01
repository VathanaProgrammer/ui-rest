export type TableStatus = 'available' | 'occupied' | 'wait' | 'cleaning';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  notes?: string;
}

export interface Table {
  id: string;
  number: string;
  status: TableStatus;
  guests?: number;
  waitTime?: number; // in minutes
  currentOrder?: OrderItem[];
  staffAssigned?: {
    name: string;
    role: string;
  };
  // Position properties for the absolute map layout
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  shape?: 'square' | 'circle' | 'rectangle';
}
