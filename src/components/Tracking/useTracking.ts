// ─── useTracking Composable ───────────────────────────────────────────────────
// All business logic lives here. Swap mock data with real API calls easily.

import { ref, computed } from 'vue'
import type { TrackingOrder, StaffMember, FilterTab, SortOption } from './types'
import { MOCK_ORDERS, MOCK_STAFF, MOCK_STATS } from './mockData'

export function useTracking() {
  // ── State ──────────────────────────────────────────────────────────────────
  const orders = ref<TrackingOrder[]>(MOCK_ORDERS)
  const staff = ref<StaffMember[]>(MOCK_STAFF)
  const stats = ref(MOCK_STATS)

  const activeFilter = ref<FilterTab>('all')
  const activeSort = ref<SortOption>('oldest')
  const searchQuery = ref('')

  // ── Computed ───────────────────────────────────────────────────────────────
  const filteredOrders = computed(() => {
    let result = [...orders.value]

    // Filter by tab
    if (activeFilter.value !== 'all') {
      if (activeFilter.value === 'active') {
        result = result.filter(o => o.status === 'preparing' || o.status === 'pending')
      } else if (activeFilter.value === 'overdue') {
        result = result.filter(o => o.status === 'overdue')
      } else if (activeFilter.value === 'delivered') {
        result = result.filter(o => o.status === 'delivered')
      }
    }

    // Filter by search
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        o =>
          o.server.toLowerCase().includes(q) ||
          String(o.tableNumber).includes(q) ||
          o.items.some(i => i.name.toLowerCase().includes(q)),
      )
    }

    // Sort
    result.sort((a, b) => {
      if (activeSort.value === 'oldest') return a.startedAt.getTime() - b.startedAt.getTime()
      if (activeSort.value === 'newest') return b.startedAt.getTime() - a.startedAt.getTime()
      if (activeSort.value === 'table') return a.tableNumber - b.tableNumber
      if (activeSort.value === 'status') return a.status.localeCompare(b.status)
      return 0
    })

    return result
  })

  const tabCounts = computed(() => ({
    all: orders.value.length,
    active: orders.value.filter(o => o.status === 'preparing' || o.status === 'pending').length,
    overdue: orders.value.filter(o => o.status === 'overdue').length,
    delivered: orders.value.filter(o => o.status === 'delivered').length,
  }))

  // ── Helpers ────────────────────────────────────────────────────────────────
  function getElapsedTime(order: TrackingOrder): string {
    const ms = Date.now() - order.startedAt.getTime()
    const totalSeconds = Math.floor(ms / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  function isOverdue(order: TrackingOrder): boolean {
    const elapsed = (Date.now() - order.startedAt.getTime()) / 60000
    return elapsed > order.estimatedMinutes
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  // TODO: Replace with real API calls (e.g. await api.markDelivered(orderId))
  function markDelivered(orderId: string) {
    const order = orders.value.find(o => o.id === orderId)
    if (order) order.status = 'delivered'
  }

  function notifyServer(orderId: string) {
    // TODO: trigger push notification or call real API
    console.log(`[Tracking] Notify server for order ${orderId}`)
  }

  return {
    // State
    orders,
    staff,
    stats,
    activeFilter,
    activeSort,
    searchQuery,
    // Computed
    filteredOrders,
    tabCounts,
    // Helpers
    getElapsedTime,
    isOverdue,
    // Actions
    markDelivered,
    notifyServer,
  }
}