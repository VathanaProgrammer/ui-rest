import type { Order } from './types';

export const mockOrders: Order[] = [
  {
    id: 1,
    ticket: 'T-14',
    type: 'takeout',
    status: 'overdue',
    statusLabel: 'OVERDUE',
    elapsed: '12:45',
    elapsedSeconds: 765,
    items: [
      { qty: 2, name: 'Double Smash Burger', alert: 'NO ONIONS', modifier: '+ Extra Cheese' },
      { qty: 1, name: 'Truffle Fries', modifier: 'Large size' },
    ],
  },
  {
    id: 2,
    ticket: 'T-22',
    type: 'dine-in',
    status: 'warning',
    statusLabel: 'WARNING',
    elapsed: '07:12',
    elapsedSeconds: 432,
    items: [
      { qty: 4, name: 'Classic Wings (12pc)', modifier: '2x Buffalo, 2x Garlic Parm' },
      { qty: 2, name: 'Caesar Salad', modifier: 'No Croutons' },
    ],
  },
  {
    id: 3,
    ticket: 'T-05',
    type: 'dine-in',
    status: 'normal',
    statusLabel: 'NORMAL',
    elapsed: '03:20',
    elapsedSeconds: 200,
    items: [
      { qty: 1, name: 'Vegetarian Bowl', modifier: '+ Avocado' },
    ],
  },
  {
    id: 4,
    ticket: 'T-29',
    type: 'takeout',
    status: 'new',
    statusLabel: 'NEW ORDER',
    elapsed: '00:15',
    elapsedSeconds: 15,
    items: [
      { qty: 1, name: 'Pepperoni Pizza', modifier: 'Extra Crisp' },
      { qty: 2, name: 'Coca Cola' },
    ],
  },
  {
    id: 5,
    ticket: 'T-30',
    type: 'takeout',
    status: 'new',
    statusLabel: 'NEW ORDER',
    elapsed: '00:15',
    elapsedSeconds: 15,
    items: [
      { qty: 4, name: 'Pepperoni Pizza', modifier: 'Extra Crisp' },
      { qty: 2, name: 'Coca Cola' },
    ],
  },
];