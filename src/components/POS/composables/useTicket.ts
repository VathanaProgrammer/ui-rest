import { ref, computed } from 'vue';

export interface TicketItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  modifiers?: { label: string; price?: number; type: 'add' | 'remove' }[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const ticketItems = ref<TicketItem[]>([]);

const isPriority = ref(true);
const orderType = ref<'dine-in' | 'takeout'>('dine-in');
const ticketNote = ref('');

export function useTicket() {
  const subtotal = computed(() =>
    ticketItems.value.reduce((sum, item) => {
      const modTotal = item.modifiers?.reduce((m, mod) => m + (mod.price ?? 0), 0) ?? 0;
      return sum + (item.price + modTotal) * item.qty;
    }, 0)
  );

  const tax = computed(() => subtotal.value * 0.085);
  const total = computed(() => subtotal.value + tax.value);

  function addItem(item: MenuItem) {
    const existing = ticketItems.value.find((t) => t.id === item.id);
    if (existing) {
      existing.qty++;
    } else {
      ticketItems.value.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    }
  }

  function changeQty(item: TicketItem, delta: number) {
    item.qty += delta;
    if (item.qty <= 0) {
      ticketItems.value = ticketItems.value.filter((t) => t.id !== item.id);
    }
  }

  function clearTicket() {
    ticketItems.value = [];
    ticketNote.value = '';
  }

  async function sendToKitchen() {
    if (ticketItems.value.length === 0) {
      alert('Ticket is empty');
      return;
    }
    
    const payload = {
      tableNo: '14', // Using a default table for now
      orderType: orderType.value === 'dine-in' ? 'DINE_IN' : 'TAKEOUT',
      customerName: 'Walk-in Customer',
      customerPhone: '',
      items: ticketItems.value.map(t => ({
        menuItemId: Number(t.id),
        quantity: t.qty,
        modifiers: t.modifiers ? t.modifiers.map(m => m.label).join(', ') : ''
      }))
    };
    
    try {
      const { api } = await import('../../../utils/api');
      const res = await api.post<any>('/orders', payload);
      if (res) {
        alert('Order sent to kitchen!');
        clearTicket();
      }
    } catch (err) {
      console.error('Failed to send order to kitchen', err);
      alert('Error sending order');
    }
  }

  return {
    ticketItems,
    isPriority,
    orderType,
    ticketNote,
    subtotal,
    tax,
    total,
    addItem,
    changeQty,
    clearTicket,
    sendToKitchen,
  };
}