import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Order, OrderStatus } from './types';
import { mockOrders } from './mockOrders';

export function useKDS() {
  const activeOrders = ref<Order[]>([...mockOrders]);
  const currentTime = ref('');

  // ── Clock ──────────────────────────────────────────────
  let clockInterval: ReturnType<typeof setInterval>;

  const updateClock = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // ── Timer tick ─────────────────────────────────────────
  let timerInterval: ReturnType<typeof setInterval>;

  const resolveStatus = (secs: number): { status: OrderStatus; statusLabel: string } => {
    if (secs >= 600) return { status: 'overdue', statusLabel: 'OVERDUE' };
    if (secs >= 360) return { status: 'warning', statusLabel: 'WARNING' };
    if (secs <= 30)  return { status: 'new',     statusLabel: 'NEW ORDER' };
    return { status: 'normal', statusLabel: 'NORMAL' };
  };

  const tickTimers = () => {
    activeOrders.value = activeOrders.value.map(order => {
      const secs = order.elapsedSeconds + 1;
      const m = String(Math.floor(secs / 60)).padStart(2, '0');
      const s = String(secs % 60).padStart(2, '0');
      return { ...order, elapsedSeconds: secs, elapsed: `${m}:${s}`, ...resolveStatus(secs) };
    });
  };

  // ── Actions ────────────────────────────────────────────
  const bumpOrder  = (id: number) => { activeOrders.value = activeOrders.value.filter(o => o.id !== id); };
  const markReady  = (id: number) => { activeOrders.value = activeOrders.value.filter(o => o.id !== id); };

  // ── Stats ──────────────────────────────────────────────
  const overdueCount = computed(() => activeOrders.value.filter(o => o.status === 'overdue').length);
  const warningCount = computed(() => activeOrders.value.filter(o => o.status === 'warning').length);
  const normalCount  = computed(() => activeOrders.value.filter(o => o.status === 'normal' || o.status === 'new').length);

  // ── Lifecycle ──────────────────────────────────────────
  onMounted(() => {
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    timerInterval = setInterval(tickTimers, 1000);
  });

  onUnmounted(() => {
    clearInterval(clockInterval);
    clearInterval(timerInterval);
  });

  return {
    activeOrders,
    currentTime,
    overdueCount,
    warningCount,
    normalCount,
    bumpOrder,
    markReady,
  };
}