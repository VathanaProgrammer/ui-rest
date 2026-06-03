<script setup lang="ts">
// ─── TrackingView ─────────────────────────────────────────────────────────────
// Entry point for /tracking route.
// All logic → useTracking.ts | Sub-components → TrackingOrderCard, TrackingStaffCard
// To add real API: edit useTracking.ts only.

import { onMounted, onUnmounted, ref } from 'vue'
import { useTracking } from './useTracking'
import TrackingOrderCard from './TrackingOrderCard.vue'
import TrackingStaffCard from './TrackingStaffCard.vue'
import TrackingStatsBar from './TrackingStatsBar.vue'
import type { FilterTab, SortOption } from './types'

const {
  staff,
  stats,
  activeFilter,
  activeSort,
  searchQuery,
  filteredOrders,
  tabCounts,
  getElapsedTime,
  markDelivered,
  notifyServer,
} = useTracking()

const activeTab = ref<'orders' | 'staff'>('orders')

// ── Tick timer every second to keep elapsed times live ────────────────────────
const tick = ref(0)
let interval: ReturnType<typeof setInterval>
onMounted(() => { interval = setInterval(() => tick.value++, 1000) })
onUnmounted(() => clearInterval(interval))

// ── Filter tabs config ────────────────────────────────────────────────────────
const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',       label: 'All Orders' },
  { key: 'active',    label: 'Preparing'  },
  { key: 'overdue',   label: 'Overdue'    },
  { key: 'delivered', label: 'Delivered'  },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'oldest',  label: 'Oldest First'  },
  { value: 'newest',  label: 'Newest First'  },
  { value: 'table',   label: 'By Table'      },
  { value: 'status',  label: 'By Status'     },
]
</script>

<template>
  <div class="tracking-view">
    <!-- ── Top Stats Bar ──────────────────────────────────────────────── -->
    <TrackingStatsBar :stats="stats" />

    <!-- ── Main / Staff toggle ───────────────────────────────────────── -->
    <div class="view-toggle">
      <button
        class="toggle-btn"
        :class="{ 'toggle-btn--active': activeTab === 'orders' }"
        @click="activeTab = 'orders'"
      >Orders</button>
      <button
        class="toggle-btn"
        :class="{ 'toggle-btn--active': activeTab === 'staff' }"
        @click="activeTab = 'staff'"
      >Staff</button>
    </div>

    <!-- ══ ORDERS TAB ═════════════════════════════════════════════════ -->
    <template v-if="activeTab === 'orders'">
      <!-- Filter + Sort toolbar -->
      <div class="toolbar">
        <div class="filter-tabs">
          <button
            v-for="tab in FILTER_TABS"
            :key="tab.key"
            class="filter-tab"
            :class="{ 'filter-tab--active': activeFilter === tab.key }"
            @click="activeFilter = tab.key"
          >
            {{ tab.label }}
            <span class="tab-count">{{ tabCounts[tab.key] }}</span>
          </button>
        </div>

        <div class="toolbar-right">
          <input
            v-model="searchQuery"
            class="search-input"
            placeholder="Search table / server / item…"
          />
          <div class="sort-wrapper">
            <span class="sort-label">Sorted by:</span>
            <select v-model="activeSort" class="sort-select">
              <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Order cards grid -->
      <div class="orders-grid">
        <TrackingOrderCard
          v-for="order in filteredOrders"
          :key="order.id + tick"
          :order="order"
          :elapsed-time="getElapsedTime(order)"
          @deliver="markDelivered"
          @notify="notifyServer"
        />
        <div v-if="filteredOrders.length === 0" class="empty-state">
          No orders match your filter.
        </div>
      </div>
    </template>

    <!-- ══ STAFF TAB ══════════════════════════════════════════════════ -->
    <template v-else>
      <div class="staff-grid">
        <TrackingStaffCard
          v-for="member in staff"
          :key="member.id"
          :member="member"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.tracking-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #0d0d1a;
  min-height: 100%;
  color: #fff;
}

/* ── View toggle ──────────────────────────────────────────────────────── */
.view-toggle {
  display: flex;
  gap: 4px;
  background: #131320;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  padding: 4px;
  width: fit-content;
}
.toggle-btn {
  padding: 6px 20px;
  border-radius: 5px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  color: #666;
  transition: all 0.15s;
}
.toggle-btn--active {
  background: #1e88e5;
  color: #fff;
}

/* ── Toolbar ──────────────────────────────────────────────────────────── */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.filter-tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #2a2a3e;
  background: #131320;
  color: #888;
  transition: all 0.15s;
}
.filter-tab:hover { color: #fff; border-color: #444; }
.filter-tab--active {
  background: #1e3a5f;
  color: #4fc3f7;
  border-color: #1e88e5;
}
.tab-count {
  background: #2a2a3e;
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 0.72rem;
  color: #aaa;
}
.filter-tab--active .tab-count { background: #1e3a5f; color: #4fc3f7; }

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.search-input {
  background: #131320;
  border: 1px solid #2a2a3e;
  border-radius: 6px;
  padding: 7px 12px;
  color: #ccc;
  font-size: 0.8rem;
  width: 220px;
  outline: none;
}
.search-input::placeholder { color: #444; }
.search-input:focus { border-color: #1e88e5; }

.sort-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sort-label { font-size: 0.78rem; color: #555; }
.sort-select {
  background: #131320;
  border: 1px solid #2a2a3e;
  border-radius: 6px;
  padding: 6px 10px;
  color: #1e88e5;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}

/* ── Grids ────────────────────────────────────────────────────────────── */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}
.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  color: #444;
  padding: 48px 0;
  font-size: 0.9rem;
}
</style>