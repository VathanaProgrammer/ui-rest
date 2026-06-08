<script setup lang="ts">
import { onMounted } from 'vue';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-vue-next';
import { useRoles } from '../components/roles/useRoles';
import Skeleton from '../components/ui/Skeleton.vue';

const { roles, loading, fetchRoles } = useRoles();

onMounted(() => {
  fetchRoles();
});

// A hardcoded permission matrix mapped to roleNames
const PERMISSIONS_MATRIX: Record<string, string[]> = {
  'ADMIN': ['Full Access', 'System Settings', 'Staff Management', 'Role Management', 'Analytics', 'POS', 'Tables', 'Kitchen'],
  'MANAGER': ['Staff Management', 'Analytics', 'POS', 'Tables', 'Kitchen', 'Reservations'],
  'HEAD_CHEF': ['Kitchen', 'Menu Management', 'Inventory'],
  'WAITSTAFF': ['POS', 'Tables', 'Reservations'],
  'CASHIER': ['POS', 'Shift Management', 'Payments'],
  'KITCHEN': ['Kitchen View'],
  'SERVER': ['Tables', 'Orders']
};

const getPermissions = (roleName: string) => {
  return PERMISSIONS_MATRIX[roleName] || ['Limited Access'];
};
</script>

<template>
  <div class="h-full flex flex-col p-8 overflow-y-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
        <Shield class="w-8 h-8 text-emerald-500" />
        Role Management & Access Control
      </h1>
      <p class="text-slate-400 mt-2">View and manage base access control and profile permissions across the system.</p>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton v-for="i in 6" :key="i" class="h-64 w-full rounded-xl bg-[#1e293b]" />
    </div>

    <!-- Roles Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div 
        v-for="role in roles" 
        :key="role.id"
        class="bg-[#1e293b] border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/50 transition-colors group flex flex-col"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck v-if="role.roleName === 'ADMIN'" class="w-6 h-6" />
              <Shield v-else class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{{ role.roleName }}</h3>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">Role ID: {{ role.id }}</p>
            </div>
          </div>
        </div>

        <div class="flex-1 mt-4">
          <h4 class="text-sm font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Base Permissions</h4>
          <ul class="space-y-2">
            <li 
              v-for="(perm, index) in getPermissions(role.roleName)" 
              :key="index"
              class="flex items-center gap-2 text-sm text-slate-400"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>
              {{ perm }}
            </li>
          </ul>
        </div>
        
        <div class="mt-6 pt-4 border-t border-slate-700/50 flex justify-end">
           <span class="text-xs text-slate-500 italic flex items-center gap-1">
             <ShieldAlert class="w-3 h-3" /> Managed by Core System
           </span>
        </div>
      </div>
    </div>
  </div>
</template>
