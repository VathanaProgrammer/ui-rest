<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../utils/api'
import EditInvoiceModal from '../components/modals/EditInvoiceModal.vue'

const invoices = ref<any[]>([])
const loading = ref(true)
const selectedInvoice = ref<any>(null)
const isEditModalOpen = ref(false)

onMounted(() => {
  fetchInvoices()
})

async function fetchInvoices() {
  loading.value = true
  try {
    const res = await api.get('/invoices')
    if (res.status === 1) {
      invoices.value = res.data
    }
  } catch (err) {
    console.error("Failed to fetch invoices", err)
  } finally {
    loading.value = false
  }
}

function openEditModal(invoice: any) {
  selectedInvoice.value = invoice
  isEditModalOpen.value = true
}

async function handleDelete(id: number) {
  if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return
  try {
    await api.delete(`/invoices/${id}`)
    invoices.value = invoices.value.filter(inv => inv.id !== id)
  } catch (err) {
    console.error("Failed to delete invoice", err)
    alert("Failed to delete invoice.")
  }
}

function handleSave(updated: any) {
  const idx = invoices.value.findIndex(inv => inv.id === updated.id)
  if (idx !== -1) {
    invoices.value[idx] = updated
  }
  isEditModalOpen.value = false
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Invoice Management</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">View, edit, and track customer payments.</p>
      </div>
      <button @click="fetchInvoices" class="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </header>

    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex-1 overflow-hidden flex flex-col">
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="invoices.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-gray-400">
        <svg class="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <p>No invoices found in the system.</p>
      </div>

      <div v-else class="overflow-auto flex-1 customs-scroll">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead class="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
            <tr>
              <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">ID</th>
              <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Date</th>
              <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Customer</th>
              <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Amount</th>
              <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Status</th>
              <th class="py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td class="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">#{{ invoice.id }}</td>
              <td class="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                {{ new Date(invoice.invoiceDate).toLocaleString() }}
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium">
                  {{ invoice.customer?.name || 'Guest' }}
                </div>
                <div class="text-xs text-gray-500">{{ invoice.customer?.phone || 'N/A' }}</div>
              </td>
              <td class="py-4 px-6 text-sm font-black text-gray-900 dark:text-white">${{ invoice.totalAmount?.toFixed(2) }}</td>
              <td class="py-4 px-6">
                <span 
                  class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border"
                  :class="{
                    'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20': invoice.status === 'PAID',
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20': invoice.status === 'PENDING',
                    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20': invoice.status === 'CANCELLED'
                  }"
                >
                  {{ invoice.status }}
                </span>
              </td>
              <td class="py-4 px-6 flex justify-end gap-2">
                <button @click="openEditModal(invoice)" class="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button @click="handleDelete(invoice.id)" class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditInvoiceModal
      v-if="isEditModalOpen"
      :invoice="selectedInvoice"
      @close="isEditModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.customs-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.customs-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.customs-scroll::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 99px;
}
</style>
