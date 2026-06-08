<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StatsRow from '../components/tables/StatsRow.vue';
import TableMap from '../components/tables/TableMap.vue';
import TableDetailsSidebar from '../components/tables/TableDetailsSidebar.vue';
import type { Table } from '../types';
import { api } from '../utils/api';

const tables = ref<Table[]>([]);
const selectedTable = ref<Table | null>(null);

const fetchTables = async () => {
  try {
    const response = await api.get<any>('/dining-tables');
    if (response.status === 1) {
      tables.value = response.data.map((t: any) => ({
        id: 't-' + t.tableNo,
        number: t.tableNo,
        status: t.currentState.toLowerCase(),
        capacity: t.capacity
      }));
      if (tables.value.length > 0 && !selectedTable.value) {
        selectedTable.value = tables.value[0];
      }
    }
  } catch (err) {
    console.error('Failed to fetch tables:', err);
  }
};

onMounted(() => {
  fetchTables();
});

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
        :tables="tables" 
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
