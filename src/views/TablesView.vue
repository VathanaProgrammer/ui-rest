<script setup lang="ts">
import { ref } from 'vue';
import StatsRow from '../components/tables/StatsRow.vue';
import TableMap from '../components/tables/TableMap.vue';
import TableDetailsSidebar from '../components/tables/TableDetailsSidebar.vue';
import type { Table } from '../types';

const mockTables: Table[] = [
  { id: 't-01', number: '1', status: 'available', capacity: 2 },
  { id: 't-02', number: '2', status: 'available', capacity: 2 },
  { id: 't-03', number: '3', status: 'occupied', capacity: 2, guests: 2, currentOrder: [
      { id: '1', name: 'Pan-Seared Salmon', price: 28.00 },
      { id: '2', name: 'Wagyu Burger', price: 24.00, notes: 'No Onions' },
    ], staffAssigned: { name: 'Marco Rossi', role: 'Senior Lead' }
  },
  { id: 't-04', number: '4', status: 'available', capacity: 2 },
  { id: 't-05', number: '5', status: 'available', capacity: 4 },
  { id: 't-06', number: '6', status: 'wait', capacity: 4, waitTime: 15 },
  { id: 't-07', number: '7', status: 'available', capacity: 4 },
  { id: 't-08', number: '8', status: 'occupied', capacity: 4, guests: 4 },
  { id: 't-09', number: '9', status: 'available', capacity: 6 },
  { id: 't-10', number: '10', status: 'available', capacity: 6 },
  { id: 't-11', number: '11', status: 'available', capacity: 6 },
  { id: 't-12', number: '12', status: 'wait', capacity: 6, waitTime: 20 },
];

const selectedTable = ref<Table | null>(mockTables[1]); // Pre-select T-01 to match mockup

const handleTableSelect = (table: Table) => {
  selectedTable.value = table;
};
</script>

<template>
  <div class="flex h-full">
    <!-- Main Content Area -->
    <div class="flex-1 p-8 overflow-y-auto">
      <StatsRow />
      <TableMap 
        :tables="mockTables" 
        :selectedTableId="selectedTable?.id || null"
        @select="handleTableSelect"
      />
    </div>

    <!-- Right Sidebar -->
    <TableDetailsSidebar 
      v-if="selectedTable"
      :table="selectedTable" 
      @close="selectedTable = null" 
    />
  </div>
</template>
