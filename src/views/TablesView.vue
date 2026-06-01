<script setup lang="ts">
import { ref } from 'vue';
import StatsRow from '../components/tables/StatsRow.vue';
import TableMap from '../components/tables/TableMap.vue';
import TableDetailsSidebar from '../components/tables/TableDetailsSidebar.vue';
import type { Table } from '../types';

const mockTables: Table[] = [
  {
    id: 't-10',
    number: 'T-10',
    status: 'occupied',
    guests: 4,
    x: 400,
    y: 220,
    width: 160,
    height: 160,
    currentOrder: [
      { id: '1', name: 'Ribeye Steak 12oz', price: 45.00, notes: 'Medium Rare' },
      { id: '2', name: 'Truffle Fries', price: 12.00 },
      { id: '3', name: 'House Pinot Noir', price: 18.00 },
    ],
    staffAssigned: { name: 'Sarah J.', role: 'Server' }
  },
  {
    id: 't-01',
    number: '01',
    status: 'occupied',
    guests: 4,
    waitTime: 42,
    x: 580,
    y: 260,
    width: 80,
    height: 90,
    currentOrder: [
      { id: '1', name: 'Pan-Seared Salmon', price: 28.00 },
      { id: '2', name: 'Wagyu Burger', price: 24.00, notes: 'No Onions' },
    ],
    staffAssigned: { name: 'Marco Rossi', role: 'Senior Lead' }
  },
  {
    id: 't-03',
    number: '03',
    status: 'wait',
    x: 440,
    y: 110,
    width: 80,
    height: 80,
  },
  {
    id: 't-11',
    number: '11',
    status: 'available',
    x: 300,
    y: 260,
    width: 80,
    height: 90,
  },
  {
    id: 't-02',
    number: '02',
    status: 'available',
    x: 440,
    y: 400,
    width: 80,
    height: 80,
  },
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
