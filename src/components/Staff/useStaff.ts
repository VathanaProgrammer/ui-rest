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
    name: string;
    displayName: string;    // API: displayName
    role: number;           // API: role.id — resolved to label via ROLE_MAP
    shift: string;
    email: string;          // API: emailAddress
    phoneNumber: string;    // API: phoneNumber
    employeeId: string;     // API: employeeId — auto-assigned if blank
    accessPin: string;      // sent to API only; not stored on StaffMember
    avatar: string;         // API: avatarUrl
    status: StaffStatus;    // API: currentStatus (kebab; mapped to UPPER_SNAKE on POST)
  }) => {
    // TODO: replace with actual POST /api/staff response data
    const newMember: StaffMember = {
      id:          `ST-${Date.now()}`,
      employeeId:  payload.employeeId || `EMP-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      name:        payload.name,
      displayName: payload.displayName,
      role:        ROLE_MAP[payload.role] ?? 'Unknown',
      shift:       payload.shift as StaffMember['shift'],
      shiftHours:  SHIFT_HOURS[payload.shift] ?? '',
      email:       payload.email,
      phoneNumber: payload.phoneNumber,
      avatar:      payload.avatar || '',
      status:      payload.status,
    };
    allStaff.value.unshift(newMember);
    currentPage.value = 1;
  };

  const removeStaff = (id: string) => {
    allStaff.value = allStaff.value.filter(s => s.id !== id);
    if (currentPage.value > 1 && currentPage.value > Math.ceil(allStaff.value.length / PAGE_SIZE)) {
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