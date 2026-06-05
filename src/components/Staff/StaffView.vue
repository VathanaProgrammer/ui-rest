<template>
  <div class="staff-wrapper">

    <div class="page-header">
      <div>
        <h1 class="page-title">Team Members</h1>
        <p class="page-subtitle">Manage your kitchen staff, shifts, and real-time statuses.</p>
      </div>
      <button class="btn-add-staff" @click="showAddModal = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/>
          <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
        Add New Staff
      </button>
    </div>

    <StaffStats :stats="stats" />

    <StaffTable
      :staff="pagedStaff"
      :total-staff="totalStaff"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page="goToPage"
      @manage="handleManage"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <StaffBottomPanels
      :upcoming-shifts="upcomingShifts"
      :compliance-alerts="complianceAlerts"
    />

    <AddStaffModal
      v-model="showAddModal"
      @staff-added="addStaff"
    />

    <EditStaffModal
      v-model="showEditModal"
      :member="editTarget"
      @staff-updated="handleStaffUpdated"
    />

    <StaffDetailModal
      v-model="showDetailModal"
      :member="detailTarget"
      @edit="handleEdit"
    />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StaffStats        from './StaffStats.vue';
import StaffTable        from './StaffTable.vue';
import StaffBottomPanels from './StaffBottomPanels.vue';
import AddStaffModal     from './AddStaffModal.vue';
import EditStaffModal    from './EditStaff.vue';
import StaffDetailModal  from './StaffDetail.vue';
import { useStaff }      from './useStaff';
import type { StaffMember } from './types';

const {
  stats,
  pagedStaff,
  totalStaff,
  currentPage,
  totalPages,
  upcomingShifts,
  complianceAlerts,
  goToPage,
  addStaff,
  removeStaff,
  updateStaff,
} = useStaff();

const showAddModal    = ref(false);
const showEditModal   = ref(false);
const editTarget      = ref<StaffMember | null>(null);
const showDetailModal = ref(false);
const detailTarget    = ref<StaffMember | null>(null);

const handleManage = (id: string) => {
  detailTarget.value  = pagedStaff.value.find(m => m.id === id) ?? null;
  showDetailModal.value = true;
};

const handleEdit = (id: string) => {
  editTarget.value  = pagedStaff.value.find(m => m.id === id) ?? null;
  showEditModal.value = true;
};

const handleDelete = (id: string) => {
  removeStaff(id);
};

const handleStaffUpdated = (updated: StaffMember) => {
  updateStaff(updated);
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.staff-wrapper {
  width: 100%;
  min-height: 100vh;
  background: #0b1120;
  padding: 28px 28px 48px;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
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

.btn-add-staff {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2563eb;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-add-staff:hover { background: #1d4ed8; }
</style>