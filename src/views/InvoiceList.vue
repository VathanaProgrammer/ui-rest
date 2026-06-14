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
  <div class="invoice-wrapper">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Invoice Management</h1>
        <p class="page-subtitle">View, edit, and track customer payments.</p>
      </div>
      <button @click="fetchInvoices" class="btn-refresh">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>

    <!-- Main Content -->
    <div class="table-card flex-1 flex flex-col overflow-hidden">
      
      <!-- Loading State -->
      <div v-if="loading" class="empty-state flex-1">
        <svg class="spin spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Empty State -->
      <div v-else-if="invoices.length === 0" class="empty-state flex-1">
        <div class="empty-icon-wrap">
          <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="empty-title">No Invoices Found</h3>
        <p class="empty-desc">There are currently no invoices recorded in the system.</p>
      </div>

      <!-- Table Data -->
      <div v-else class="table-container customs-scroll flex-1">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE & TIME</th>
              <th>CUSTOMER</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th class="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="invoice in invoices" :key="invoice.id">
              <td class="font-bold text-[#e2e8f0]">#{{ invoice.id }}</td>
              <td>
                <div class="text-[#cbd5e1] font-semibold">{{ new Date(invoice.invoiceDate).toLocaleDateString() }}</div>
                <div class="text-[12px] text-[#475569] font-mono mt-0.5">{{ new Date(invoice.invoiceDate).toLocaleTimeString() }}</div>
              </td>
              <td>
                <div class="customer-name">{{ invoice.customer?.name || 'Guest Checkout' }}</div>
                <div class="customer-phone">{{ invoice.customer?.phone || 'No phone provided' }}</div>
              </td>
              <td class="amount-cell">${{ invoice.totalAmount?.toFixed(2) }}</td>
              <td>
                <span class="status-pill" :class="invoice.status.toLowerCase()">
                  <span class="status-dot" :class="invoice.status.toLowerCase()"></span>
                  {{ invoice.status }}
                </span>
              </td>
              <td>
                <div class="action-btns justify-end">
                  <button class="btn-action btn-edit" @click="openEditModal(invoice)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                   </svg>
                    Edit
                  </button>
                  <button class="btn-action btn-delete" @click="handleDelete(invoice.id)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
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

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.invoice-wrapper {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: #0b1120;
  padding: 28px 28px 48px;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 4px;
  letter-spacing: -0.3px;
}

.page-subtitle {
  font-size: 14px;
  color: #475569;
  margin: 0;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1e293b;
  color: #e2e8f0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid #334155;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.5px;
}
.btn-refresh:hover { background: #27354f; border-color: #475569; color: #fff; }

/* ── Layout ─────────────────────────────────────────── */
.table-card {
  background: #131c2e;
  border: 1px solid #1e2d45;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.table-container {
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

thead th {
  position: sticky;
  top: 0;
  background: #0f1624;
  padding: 16px 24px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
  border-bottom: 1px solid #1e2d45;
  z-index: 10;
}

tbody tr {
  border-bottom: 1px solid #1a2540;
  transition: background 0.15s;
}
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: #162035; }
tbody td {
  padding: 18px 24px;
  vertical-align: middle;
  font-size: 14px;
}

.customer-name { font-weight: 600; color: #e2e8f0; }
.customer-phone { font-size: 12px; color: #64748b; margin-top: 2px; }

.amount-cell {
  font-size: 15px;
  font-weight: 800;
  color: #f8fafc;
  font-family: 'JetBrains Mono', monospace;
}

/* ── Status pill ─────────────────────────────────────── */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
  text-transform: uppercase;
}

.status-pill.paid { background: #052e16; border-color: #166534; color: #4ade80; }
.status-pill.pending { background: #422006; border-color: #92400e; color: #fbbf24; }
.status-pill.cancelled { background: #3b1219; border-color: #881337; color: #f87171; }

.status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.status-dot.paid { background: #4ade80; box-shadow: 0 0 6px #4ade80aa; }
.status-dot.pending { background: #fbbf24; }
.status-dot.cancelled { background: #f87171; }

/* ── Action buttons ──────────────────────────────────── */
.action-btns { display: flex; align-items: center; gap: 8px; }

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-edit { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.btn-edit:hover { background: rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.4); color: #93c5fd; }

.btn-delete { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #f87171; }
.btn-delete:hover { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); color: #fca5a5; }

/* ── Empty State ─────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}
.empty-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(30, 41, 59, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 1px dashed rgba(71, 85, 105, 0.4);
}
.empty-icon { width: 36px; height: 36px; color: #475569; }
.empty-title { font-size: 18px; font-weight: 700; color: #e2e8f0; margin: 0 0 8px; }
.empty-desc { font-size: 14px; color: #64748b; max-width: 300px; text-align: center; line-height: 1.5; }

.spin { animation: spin 0.8s linear infinite; }
.spinner-icon { width: 32px; height: 32px; color: #3b82f6; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Scrollbar ───────────────────────────────────────── */
.customs-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
.customs-scroll::-webkit-scrollbar-track { background: transparent; }
.customs-scroll::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.4); border-radius: 99px; }
.customs-scroll::-webkit-scrollbar-thumb:hover { background: rgba(71, 85, 105, 0.6); }
</style>
