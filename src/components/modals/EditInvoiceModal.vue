<script setup lang="ts">
import { ref } from 'vue'
import api from '../../utils/api'

const props = defineProps<{
  invoice: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', updatedInvoice: any): void
}>()

const status = ref(props.invoice.status || 'PENDING')
const paymentMethod = ref(props.invoice.paymentMethod || 'CASH')
const loading = ref(false)

async function updateInvoice() {
  loading.value = true
  try {
    const payload = {
      status: status.value,
      paymentMethod: paymentMethod.value
    }
    const res = await api.put(`/invoices/${props.invoice.id}`, payload)
    if (res.status === 1) {
      alert("Invoice updated successfully")
      emit('save', res.data)
    } else {
      alert(res.message || "Failed to update invoice")
    }
  } catch (err: any) {
    alert(err.response?.data?.message || "Failed to update invoice")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm transition-all">
    <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col transform transition-all overflow-hidden border border-gray-200 dark:border-gray-700">
      
      <!-- Header -->
      <div class="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
          Edit Invoice #{{ invoice.id }}
        </h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Payment Method</label>
          <select 
            v-model="paymentMethod" 
            class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="CASH">Cash</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
          <select 
            v-model="status" 
            class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex gap-3 justify-end">
        <button 
          @click="emit('close')"
          class="px-5 py-2.5 rounded-xl font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="updateInvoice"
          :disabled="loading"
          class="px-6 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Save Changes
        </button>
      </div>

    </div>
  </div>
</template>
