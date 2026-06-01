<script setup lang="ts">
import { useRoute } from 'vue-router';
import { 
  MonitorSmartphone, 
  ChefHat, 
  MapPin, 
  Armchair, 
  Plus,
  Settings,
  HelpCircle
} from 'lucide-vue-next';

const route = useRoute();

const navItems = [
  { name: 'POS', path: '/pos', icon: MonitorSmartphone },
  { name: 'KDS', path: '/kds', icon: ChefHat },
  { name: 'Tracking', path: '/tracking', icon: MapPin },
  { name: 'Tables', path: '/tables', icon: Armchair },
];
</script>

<template>
  <aside class="w-64 bg-[#0f172a] border-r border-[#1e293b] flex flex-col h-full text-slate-300">
    <!-- User Profile -->
    <div class="p-6 border-b border-[#1e293b] mb-4 flex items-center gap-3">
      <img src="https://ui-avatars.com/api/?name=Line+Cook&background=0D8ABC&color=fff&size=64" alt="Staff Profile" class="w-10 h-10 rounded-full border border-slate-700 object-cover" />
      <div>
        <h2 class="text-white font-semibold text-base leading-tight">Line Cook Pro</h2>
        <p class="text-slate-500 text-xs">Station 01</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 space-y-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors"
        :class="route.path === item.path ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.name }}
      </router-link>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 space-y-4">
      <button class="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
        <Plus class="w-5 h-5" />
        New Ticket
      </button>

      <div class="space-y-1">
        <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
          <Settings class="w-4 h-4" />
          Settings
        </a>
        <a href="#" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
          <HelpCircle class="w-4 h-4" />
          Support
        </a>
      </div>
    </div>
  </aside>
</template>
