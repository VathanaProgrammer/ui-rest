// ─── Tracking Mock Data ───────────────────────────────────────────────────────
// Replace these with real API calls in useTracking.ts

import type { TrackingOrder, StaffMember, TrackingStats } from './types'

export const MOCK_ORDERS: TrackingOrder[] = [
  {
    id: 'ORD-001',
    tableNumber: 14,
    server: 'Marcus J.',
    status: 'overdue',
    isRush: true,
    estimatedMinutes: 15,
    startedAt: new Date(Date.now() - 24 * 60 * 1000),
    items: [
      { name: 'Wagyu Beef Burger', quantity: 2, modifier: 'MD' },
      { name: 'Truffle Fries (Large)', quantity: 1, modifier: 'RUSH' },
      { name: 'Garden Salad', quantity: 1 },
    ],
  },
  {
    id: 'ORD-002',
    tableNumber: 8,
    server: 'Sarah K.',
    status: 'preparing',
    estimatedMinutes: 20,
    startedAt: new Date(Date.now() - 8 * 60 * 1000),
    items: [
      { name: 'Pan-Seared Salmon', quantity: 3 },
      { name: 'Asparagus Risotto', quantity: 2 },
    ],
  },
  {
    id: 'ORD-003',
    tableNumber: 22,
    server: 'Alex L.',
    status: 'ready',
    estimatedMinutes: 18,
    startedAt: new Date(Date.now() - 18 * 60 * 1000),
    items: [{ name: 'Ribeye Steak 12oz', quantity: 1, modifier: 'WELL' }],
  },
  {
    id: 'ORD-004',
    tableNumber: 5,
    server: 'Jamie T.',
    status: 'delivered',
    estimatedMinutes: 12,
    startedAt: new Date(Date.now() - 35 * 60 * 1000),
    items: [
      { name: 'Caesar Salad', quantity: 2 },
      { name: 'Pasta Carbonara', quantity: 1 },
    ],
  },
  {
    id: 'ORD-005',
    tableNumber: 11,
    server: 'Marcus J.',
    status: 'preparing',
    estimatedMinutes: 25,
    startedAt: new Date(Date.now() - 5 * 60 * 1000),
    items: [
      { name: 'Lobster Bisque', quantity: 2 },
      { name: 'Duck Confit', quantity: 1 },
      { name: 'Crème Brûlée', quantity: 3 },
    ],
  },
]

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'STF-001',
    name: 'Marcus J.',
    role: 'server',
    activeOrders: 2,
    tablesServed: 8,
    avgServiceTime: '14m 30s',
    status: 'active',
  },
  {
    id: 'STF-002',
    name: 'Sarah K.',
    role: 'server',
    activeOrders: 1,
    tablesServed: 6,
    avgServiceTime: '11m 12s',
    status: 'active',
  },
  {
    id: 'STF-003',
    name: 'Alex L.',
    role: 'runner',
    activeOrders: 1,
    tablesServed: 11,
    avgServiceTime: '9m 45s',
    status: 'active',
  },
  {
    id: 'STF-004',
    name: 'Jamie T.',
    role: 'server',
    activeOrders: 0,
    tablesServed: 4,
    avgServiceTime: '16m 00s',
    status: 'on-break',
  },
]

export const MOCK_STATS: TrackingStats = {
  totalOrders: 28,
  avgPrepTime: '12m 4s',
  onTimeRate: 94,
  activeStaff: 3,
}