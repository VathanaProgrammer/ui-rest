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

// Singleton state — shared across all components that call useTicket()
const ticketItems = ref<TicketItem[]>([
  {
    id: 1,
    name: 'Classic Double',
    price: 14.50,
    qty: 1,
    modifiers: [
      { label: 'Extra Bacon', price: 2.00, type: 'add' },
      { label: 'No Onions', type: 'remove' },
    ],
  },
  { id: 4, name: 'Truffle Fries', price: 8.00, qty: 2 },
  { id: 5, name: 'Neon Old Fashioned', price: 13.00, qty: 1 },
]);

const isPriority = ref(true);
const orderType = ref<'dine-in' | 'takeout'>('dine-in');

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
  }

  function sendToKitchen() {
    alert('Order sent to kitchen!');
  }

  return {
    ticketItems,
    isPriority,
    orderType,
    subtotal,
    tax,
    total,
    addItem,
    changeQty,
    clearTicket,
    sendToKitchen,
  };
}