import { ref, computed } from 'vue';
import type { StaffMember, StaffStatus } from './types';
import { mockStaff, upcomingShifts, complianceAlerts } from './mockData';

const PAGE_SIZE = 4;

const SHIFT_HOURS: Record<string, string> = {
  Morning:   '06:00 - 14:00',
  Afternoon: '10:00 - 18:00',
  Evening:   '14:00 - 22:00',
  Night:     '22:00 - 06:00',
};

// TODO: fetch from GET /api/roles — keep in sync with AddStaffModal.vue
const ROLE_MAP: Record<number, string> = {
  1: 'Manager',
  2: 'Head Chef',
  3: 'Sous Chef',
  4: 'Line Cook',
  5: 'Prep Cook',
  6: 'Server',
  7: 'Bartender',
  8: 'Host',
};

const getAvatarUrl = (url: string, name: string) => {
  if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=64`;
  if (url.startsWith('http')) return url;
  return import.meta.env.VITE_API_BASE_URL.replace('/api', '') + url;
};

import { api } from '../../utils/api';

export function useStaff() {
  const allStaff    = ref<StaffMember[]>([]);
  const currentPage = ref(1);
  const loading     = ref(true);

  const fetchStaff = async () => {
    loading.value = true;
    try {
      const res = await api.get<any>('/staff');
      if (res.status === 1) {
        allStaff.value = res.data.map((u: any) => ({
          id: String(u.id),
          employeeId: u.employeeId,
          name: u.displayName || u.fullName || 'Unknown',
          displayName: u.displayName,
          role: u.role ? u.role.roleName : 'Unknown',
          shift: 'Morning', // mocked as not in DB
          shiftHours: '06:00 - 14:00',
          email: u.emailAddress,
          phoneNumber: u.phoneNumber,
          avatar: getAvatarUrl(u.avatarUrl, u.displayName || u.fullName || 'User'),
          status: (u.currentStatus || 'OFF_DUTY').toLowerCase().replace('_', '-') as StaffStatus,
        }));
      }
    } catch(e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  fetchStaff();

  const totalStaff = computed(() => allStaff.value.length);
  const totalPages = computed(() => Math.ceil(totalStaff.value / PAGE_SIZE));

  const pagedStaff = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE;
    return allStaff.value.slice(start, start + PAGE_SIZE);
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page;
  };

  const addStaff = async (payload: {
    name: string;
    displayName: string;
    role: number;
    shift: string;
    email: string;
    phoneNumber: string;
    employeeId: string;
    accessPin: string;
    avatar: string;
    status: StaffStatus;
  }) => {
    try {
      const res = await api.post<any>('/staff', payload);
      if (res.status === 1) {
        await fetchStaff();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeStaff = async (id: string) => {
    try {
      const res = await api.delete<any>(`/staff/${id}`);
      if (res.status === 1) {
        await fetchStaff();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateStaff = (updated: StaffMember) => {
    const idx = allStaff.value.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      allStaff.value[idx] = {
        ...updated,
        shiftHours: SHIFT_HOURS[updated.shift] ?? updated.shiftHours,
      };
    }
  };

  const stats = computed(() => [
    { label: 'Total Staff', value: allStaff.value.length, icon: '👥', trend: 'Live Data', trendUp: true },
    { label: 'On Shift',    value: allStaff.value.filter(s => s.status === 'active').length, icon: '✅', trend: 'Live Data', trendUp: true },
    { label: 'On Break',    value: allStaff.value.filter(s => s.status === 'on-break').length, icon: '☕', trend: 'Live Data', trendUp: false },
    { label: 'Off Duty',    value: allStaff.value.filter(s => s.status === 'off-duty').length, icon: '🌙', trend: 'Live Data', trendUp: false },
  ]);

  return {
    stats,
    upcomingShifts,
    complianceAlerts,

    pagedStaff,
    totalStaff,
    currentPage,
    totalPages,

    goToPage,
    addStaff,
    removeStaff,
    updateStaff,
    loading,
  };
}