<script setup lang="ts">
import {
    Armchair,
    ChefHat,
    HelpCircle,
    ListChecks,
    LogOut,
    MapPin,
    MonitorSmartphone,
    Settings,
    Users,
    Clock,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
} from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useLogin } from '../../composables/useLogin';

const isCollapsed = ref(true);

const route = useRoute();
const router = useRouter();
const { logout } = useLogin();

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'POS', path: '/pos', icon: MonitorSmartphone },
  { name: 'KDS', path: '/kds', icon: ChefHat },
  { name: 'Menu Management', path: '/menu-management', icon: ListChecks },
  { name: 'Tracking', path: '/tracking', icon: MapPin },
  { name: 'Tables', path: '/tables', icon: Armchair },
  { name: 'Staff', path: '/staff', icon: Users },
  { name: 'Category', path: '/category', icon: ChefHat },
  { name: 'Shift', path: '/shift', icon: Clock },
];

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<template>
  <aside :class="['bg-[#0f172a] border-r border-[#1e293b] flex flex-col h-full text-slate-300 transition-all duration-300 relative', isCollapsed ? 'w-20' : 'w-64']">
    
    <!-- Collapse Toggle -->
    <button 
      @click="isCollapsed = !isCollapsed" 
      class="absolute -right-3 top-6 bg-blue-600 rounded-full p-1 text-white hover:bg-blue-500 transition shadow-lg z-50">
      <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
      <ChevronLeft v-else class="w-4 h-4" />
    </button>

    <!-- User Profile -->
    <div class="p-6 border-b border-[#1e293b] mb-4 flex items-center gap-3" :class="{'justify-center p-4': isCollapsed}">
      <img src="https://ui-avatars.com/api/?name=Line+Cook&background=0D8ABC&color=fff&size=64" alt="Staff Profile" class="w-10 h-10 rounded-full border border-slate-700 object-cover min-w-[40px]" />
      <div v-if="!isCollapsed" class="whitespace-nowrap overflow-hidden text-ellipsis">
        <h2 class="text-white font-semibold text-base leading-tight">Line Cook Pro</h2>
        <p class="text-slate-500 text-xs">Station 01</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden" :class="{'px-2': isCollapsed}">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 py-3 rounded-lg font-medium transition-colors"
        :class="[
          route.path === item.path ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white',
          isCollapsed ? 'justify-center px-0' : 'px-4'
        ]"
        :title="isCollapsed ? item.name : ''"
      >
        <component :is="item.icon" class="w-5 h-5 min-w-[20px]" />
        <span v-if="!isCollapsed" class="whitespace-nowrap">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 space-y-4" :class="{'px-2': isCollapsed}">
      <div class="space-y-1">
        <router-link to="/settings" class="flex items-center gap-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          :class="isCollapsed ? 'justify-center px-0' : 'px-4'" :title="isCollapsed ? 'Settings' : ''">
          <Settings class="w-4 h-4 min-w-[16px]" />
          <span v-if="!isCollapsed">Settings</span>
        </router-link>
        <router-link to="/support" class="flex items-center gap-3 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          :class="isCollapsed ? 'justify-center px-0' : 'px-4'" :title="isCollapsed ? 'Support' : ''">
          <HelpCircle class="w-4 h-4 min-w-[16px]" />
          <span v-if="!isCollapsed">Support</span>
        </router-link>

        <!-- Logout button -->
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-10 transition-colors rounded-lg"
          :class="isCollapsed ? 'justify-center px-0' : 'px-4'" :title="isCollapsed ? 'Logout' : ''"
        >
          <LogOut class="w-4 h-4 min-w-[16px]" />
          <span v-if="!isCollapsed">Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>