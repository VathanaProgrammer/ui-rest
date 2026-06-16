import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Order, OrderStatus } from './types';
import { api } from '../../utils/api';
import { useApiStream } from '../../composables/useApiStream';
import { useOrderAlert } from '../../composables/useOrderAlert';

export function useKDS() {
  const allOrders = ref<Order[]>([]);
  const currentFilter = ref<'ACTIVE' | 'READY' | 'ALL'>('ACTIVE');
  
  const activeOrders = computed(() => {
      if (currentFilter.value === 'ACTIVE') {
          return allOrders.value.filter(o => o.backendStatus !== 'READY');
      } else if (currentFilter.value === 'READY') {
          return allOrders.value.filter(o => o.backendStatus === 'READY');
      }
      return allOrders.value;
  });

  const currentTime = ref('');
  const loading = ref(true);

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

  const formatTime = (totalSeconds: number): string => {
      const absSecs = Math.abs(totalSeconds);
      const h = Math.floor(absSecs / 3600);
      const m = String(Math.floor((absSecs % 3600) / 60)).padStart(2, '0');
      const s = String(absSecs % 60).padStart(2, '0');
      
      let timeString = '';
      if (h > 0) {
          timeString = `${h}:${m}:${s}`;
      } else {
          timeString = `${m}:${s}`;
      }
      
      return totalSeconds < 0 ? `-${timeString}` : timeString;
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
    allOrders.value = allOrders.value.map(order => {
      if (order.backendStatus === 'READY') {
          return order;
      }

      const secs = order.elapsedSeconds + 1;
      
      const timeString = formatTime(secs);

      let statusInfo = resolveStatus(secs);
      if (secs < 0) {
          statusInfo = { status: 'new', statusLabel: 'UPCOMING' };
      }

      return { ...order, elapsedSeconds: secs, elapsed: timeString, ...statusInfo };
    });
  };

  // ── Actions ────────────────────────────────────────────
  const bumpOrder  = async (id: number) => { 
      try {
          await api.put(`/orders/${id}/status`, { status: 'READY' });
          const index = allOrders.value.findIndex(o => o.id === id);
          if (index !== -1) {
              allOrders.value[index].backendStatus = 'READY';
          }
      } catch(e) { console.error(e); }
  };
  const markReady  = async (id: number) => { 
      try {
          await api.put(`/orders/${id}/status`, { status: 'DELIVERED' });
          allOrders.value = allOrders.value.filter(o => o.id !== id); 
      } catch(e) { console.error(e); }
  };

  // ── Stats ──────────────────────────────────────────────
  const overdueCount = computed(() => activeOrders.value.filter(o => o.status === 'overdue').length);
  const warningCount = computed(() => activeOrders.value.filter(o => o.status === 'warning').length);
  const normalCount  = computed(() => activeOrders.value.filter(o => o.status === 'normal' || o.status === 'new').length);

  // ── Fetching & SSE ─────────────────────────────────────
  const { showAlert } = useOrderAlert();

  const fetchOrders = async () => {
      loading.value = true;
      try {
          const res = await api.get<any>('/orders');
          if (res.status === 1) {
              const orders = res.data.filter((o: any) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
              allOrders.value = orders.map((o: any) => mapBackendOrder(o));
          }
      } catch (e) {
          console.error(e);
      } finally {
          loading.value = false;
      }
  };

  const mapBackendOrder = (backendOrder: any): Order => {
      const created = new Date(backendOrder.createdAt);
      let startTime = created;
      const now = new Date();

      if (backendOrder.reservationTime) {
          const [hours, minutes] = backendOrder.reservationTime.split(':');
          const resDate = new Date();
          resDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          startTime = resDate;
      }

      let secs = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      
      const timeString = formatTime(secs);

      let statusInfo = resolveStatus(secs);
      if (secs < 0) {
          statusInfo = { status: 'new', statusLabel: 'UPCOMING' };
      }

      return {
          id: backendOrder.id,
          ticket: backendOrder.tableNo || ('#' + backendOrder.id),
          type: (backendOrder.orderType || '').toLowerCase().includes('take') ? 'takeout' : 'dine-in',
          elapsedSeconds: secs,
          elapsed: timeString,
          ...statusInfo,
          reservationTime: backendOrder.reservationTime,
          reservationEndTime: backendOrder.reservationEndTime,
          backendStatus: backendOrder.status,
          ticketNote: backendOrder.ticketNote,
          items: (backendOrder.items || []).map((i: any) => ({
              qty: i.quantity,
              name: i.menuItem?.name || 'Unknown',
              modifier: i.modifiers
          }))
      };
  };

  // SSE Realtime integration
  const { connectStream } = useApiStream('', 'orders');
  connectStream({
    'NEW_ORDER': (event) => {
        const orderData = JSON.parse(event.data);
        if (!allOrders.value.find(o => o.id === orderData.id)) {
            allOrders.value.unshift(mapBackendOrder(orderData));
        }
    },
    'ORDER_STATUS_UPDATED': (event) => {
        const orderData = JSON.parse(event.data);
        if (orderData.status === 'DELIVERED' || orderData.status === 'CANCELLED') {
            allOrders.value = allOrders.value.filter(o => o.id !== orderData.id);
            return;
        }
        
        const index = allOrders.value.findIndex(o => o.id === orderData.id);
        if (index !== -1) {
            allOrders.value[index] = mapBackendOrder(orderData);
        } else {
            allOrders.value.unshift(mapBackendOrder(orderData));
        }
    }
  });

  // ── Lifecycle ──────────────────────────────────────────
  onMounted(() => {
    fetchOrders();
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
    timerInterval = setInterval(tickTimers, 1000);
  });

  onUnmounted(() => {
    clearInterval(clockInterval);
    clearInterval(timerInterval);
  });

  return {
    allOrders,
    activeOrders,
    currentFilter,
    currentTime,
    overdueCount,
    warningCount,
    normalCount,
    bumpOrder,
    markReady,
    loading
  };
}