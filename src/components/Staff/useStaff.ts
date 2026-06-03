import { ref, computed } from 'vue';
import type { StaffMember, StaffStatus } from './types';
import { mockStaff, staffStats, upcomingShifts, complianceAlerts } from './mockData';

const PAGE_SIZE = 4;

const SHIFT_HOURS: Record<string, string> = {
  Morning:   '06:00 - 14:00',
  Afternoon: '10:00 - 18:00',
  Evening:   '14:00 - 22:00',
  Night:     '22:00 - 06:00',
};

export function useStaff() {
  const allStaff    = ref<StaffMember[]>([...mockStaff]);
  const currentPage = ref(1);

  const totalStaff = computed(() => allStaff.value.length);
  const totalPages = computed(() => Math.ceil(totalStaff.value / PAGE_SIZE));

  const pagedStaff = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE;
    return allStaff.value.slice(start, start + PAGE_SIZE);
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) currentPage.value = page;
  };

  const addStaff = (payload: {
    name: string; role: string; shift: string; email: string; avatar: string; status: StaffStatus;
  }) => {
    const newMember: StaffMember = {
      id:         `ST-${Date.now()}`,
      name:       payload.name,
      role:       payload.role,
      shift:      payload.shift as StaffMember['shift'],
      shiftHours: SHIFT_HOURS[payload.shift] ?? '',
      email:      payload.email,
      avatar:     payload.avatar || '',
      status:     payload.status,
    };
    allStaff.value.unshift(newMember);
    currentPage.value = 1;
  };

  const removeStaff = (id: string) => {
    allStaff.value = allStaff.value.filter(s => s.id !== id);
    // if current page becomes empty after delete, go back one page
    if (currentPage.value > 1 && currentPage.value > Math.ceil((allStaff.value.length) / PAGE_SIZE)) {
      currentPage.value--;
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

  return {
    stats: staffStats,
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
  };
}