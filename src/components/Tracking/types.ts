// ─── Tracking Types ───────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'overdue'
export type StaffRole = 'server' | 'chef' | 'runner'

export interface TrackingOrder {
  id: string
  tableNumber: number
  server: string
  status: OrderStatus
  items: OrderItem[]
  startedAt: Date
  estimatedMinutes: number
  isRush?: boolean
}

export interface OrderItem {
  name: string
  quantity: number
  modifier?: string
}

export interface StaffMember {
  id: string
  name: string
  role: StaffRole
  activeOrders: number
  tablesServed: number
  avgServiceTime: string
  status: 'active' | 'on-break' | 'offline'
}

export interface TrackingStats {
  totalOrders: number
  avgPrepTime: string
  onTimeRate: number
  activeStaff: number
}

export type FilterTab = 'all' | 'active' | 'overdue' | 'delivered'
export type SortOption = 'newest' | 'oldest' | 'table' | 'status'