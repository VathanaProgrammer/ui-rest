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
    Shield
} from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { ref, inject, onMounted } from 'vue';
import { useLogin } from '../../composables/useLogin';
import ProfileModal from './ProfileModal.vue';
import { api } from '../../utils/api';

const isCollapsed = ref(true);
const isMobileMenuOpen = inject<import('vue').Ref<boolean>>('isMobileMenuOpen');
const showProfileModal = ref(false);
const currentUser = ref<any>(null);

onMounted(async () => {
  try {
    const res = await api.get('/profile/me');
    if (res.status === 1) {
      currentUser.value = res.data;
    }
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
  }
});

const handleProfileUpdate = (updatedUser: any) => {
  currentUser.value = updatedUser;
};

const getAvatarUrl = (url: string) => {
  if (!url) return 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=64';
  if (url.startsWith('http')) return url;
  return import.meta.env.VITE_API_BASE_URL.replace('/api', '') + url;
};

const route = useRoute();
const router = useRouter();
const { logout } = useLogin();

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER'] },
  { name: 'POS', path: '/pos', icon: MonitorSmartphone, roles: ['ADMIN', 'MANAGER', 'WAITSTAFF', 'CASHIER'] },
  { name: 'KDS', path: '/kds', icon: ChefHat, roles: ['ADMIN', 'MANAGER', 'HEAD_CHEF', 'KITCHEN', 'LINE_COOK'] },
  { name: 'Menu Management', path: '/menu-management', icon: ListChecks, roles: ['ADMIN', 'MANAGER', 'HEAD_CHEF'] },
  { name: 'Tables', path: '/tables', icon: Armchair, roles: ['ADMIN', 'MANAGER', 'WAITSTAFF', 'SERVER', 'CASHIER'] },
  { name: 'Staff', path: '/staff', icon: Users, roles: ['ADMIN', 'MANAGER'] },
  { name: 'Roles', path: '/roles', icon: Shield, roles: ['ADMIN', 'MANAGER'] },
  { name: 'Shift', path: '/shift', icon: Clock, roles: ['ADMIN', 'MANAGER', 'CASHIER', 'SERVER'] },
];

const currentUserRole = localStorage.getItem('userRole') || 'WAITSTAFF';

const filteredNavItems = navItems.filter(item => {
  return item.roles.includes(currentUserRole.toUpperCase());
});

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<template>
  <aside 
    :class="[
      'bg-[#0f172a] border-r border-[#1e293b] flex flex-col h-full text-slate-300 transition-all duration-300 z-[60]',
      'absolute inset-y-0 left-0 md:relative md:translate-x-0',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    
    <!-- Collapse Toggle -->
    <button 
      @click="isCollapsed = !isCollapsed" 
      class="absolute -right-3 top-6 bg-blue-600 rounded-full p-1 text-white hover:bg-blue-500 transition shadow-lg z-50 hidden md:block">
      <ChevronRight v-if="isCollapsed" class="w-4 h-4" />
      <ChevronLeft v-else class="w-4 h-4" />
    </button>

    <!-- User Profile -->
    <div 
      class="p-6 border-b border-[#1e293b] mb-4 flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors group relative" 
      :class="{'justify-center p-4': isCollapsed}"
      @click="currentUser && (showProfileModal = true)"
    >
      <img :src="currentUser ? getAvatarUrl(currentUser.avatarUrl) : 'https://ui-avatars.com/api/?name=Load&background=0D8ABC&color=fff&size=64'" alt="Staff Profile" class="w-10 h-10 rounded-full border border-slate-700 object-cover min-w-[40px] group-hover:border-blue-500 transition-colors" />
      <div v-if="!isCollapsed" class="whitespace-nowrap overflow-hidden text-ellipsis flex-1">
        <h2 class="text-white font-semibold text-base leading-tight group-hover:text-blue-400 transition-colors">{{ currentUser?.displayName || currentUser?.fullName || 'Loading...' }}</h2>
        <p class="text-slate-500 text-xs">{{ currentUser?.role?.roleName || 'Staff' }}</p>
      </div>
      <!-- Tooltip for collapsed state -->
      <div v-if="isCollapsed" class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        Edit Profile
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in filteredNavItems"
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

    <!-- Profile Edit Modal -->
    <Teleport to="body">
      <ProfileModal 
        v-if="showProfileModal && currentUser" 
        :user="currentUser" 
        @close="showProfileModal = false"
        @updated="handleProfileUpdate"
      />
    </Teleport>
  </aside>
</template>