<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StatsRow from '../components/tables/StatsRow.vue';
import TableMap from '../components/tables/TableMap.vue';
import TableDetailsSidebar from '../components/tables/TableDetailsSidebar.vue';
import type { Table } from '../types';
import { api } from '../utils/api';

const tables = ref<Table[]>([]);
const floors = ref<string[]>([]);
const activeFloor = ref<string>('');
const selectedTable = ref<Table | null>(null);
const loading = ref(true);

const fetchTables = async () => {
  loading.value = true;
  try {
    const response = await api.get<any>('/dining-tables/grouped');
    if (response.status === 1 && response.data) {
      const groupedData = response.data;
      floors.value = groupedData.map((g: any) => g.floor);
      
      if (floors.value.length > 0 && !activeFloor.value) {
        activeFloor.value = floors.value[0];
      }

      // Find tables for active floor
      const activeGroup = groupedData.find((g: any) => g.floor === activeFloor.value);
      if (activeGroup) {
        tables.value = activeGroup.tables.map((t: any) => ({
          id: 't-' + t.tableNo,
          number: t.tableNo,
          status: t.currentState.toLowerCase(),
          capacity: t.capacity
        }));
      }

      if (tables.value.length > 0 && !selectedTable.value) {
        selectedTable.value = tables.value[0];
      }
    }
  } catch (err) {
    console.error('Failed to fetch tables:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTables();
});

const handleTableSelect = (table: Table) => {
  selectedTable.value = table;
};

const handleFloorChange = (floor: string) => {
  activeFloor.value = floor;
  selectedTable.value = null; // reset selected table when switching floors
  fetchTables();
};
</script>

<template>
  <div class="flex h-full">
    <!-- Main Content Area -->
    <div class="flex-1 p-8 overflow-y-auto">
      <StatsRow />
      <TableMap 
        :tables="tables" 
        :floors="floors"
        :activeFloor="activeFloor"
        :selectedTableId="selectedTable?.id || null"
        :loading="loading"
        @select="handleTableSelect"
        @change-floor="handleFloorChange"
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
