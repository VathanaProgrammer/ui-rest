import type { StaffMember, UpcomingShift, ComplianceAlert, StaffStats } from './types';

// ── Stats cards ────────────────────────────────────────────────────────────
export const staffStats: StaffStats = {
  totalStaff: 42,
  totalChange: '+2 this week',
  clockedIn: 28,
  capacity: '88% Capacity',
  onBreak: 4,
  nextShift: 'Next shift in 45m',
};

// ── Staff table ────────────────────────────────────────────────────────────
// avatar field accepts:
//   - Full URL   → 'https://...'        (from API or external service)
//   - Local path → '/images/staff/...'  (file inside /public folder)
//   - Empty ''   → falls back to initials avatar in StaffDetailModal
export const mockStaff: StaffMember[] = [
  {
    id:          'ST-8821',
    employeeId:  'EMP-2026-001',
    name:        'Marcus Chen',
    displayName: 'Marcus C.',
    role:        'Head Chef',
    roleId:      2,
    status:      'active',
    shift:       'Morning',
    shiftHours:  '06:00 - 14:00',
    email:       'm.chen@heks-kitchen.com',
    phoneNumber: '+1-555-0101',
    avatar:      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX1CuF5ByhjpYZMllwvBG75hNLw58TW7Dp6Q&s',
  },
  {
    id:          'ST-9042',
    employeeId:  'EMP-2026-002',
    name:        'Sarah Jenkins',
    displayName: 'Sarah J.',
    role:        'Line Cook',
    roleId:      4,
    status:      'on-break',
    shift:       'Morning',
    shiftHours:  '06:00 - 14:00',
    email:       's.jenkins@heks-kitchen.com',
    phoneNumber: '+1-555-0102',
    avatar:      'https://assets.dragoart.com/images/25643_501/boogle-from-swapped_6a0e6073f11749.41121246_236323_1_4.png',
  },
  {
    id:          'ST-4432',
    employeeId:  'EMP-2026-003',
    name:        'David Miller',
    displayName: 'David M.',
    role:        'Server',
    roleId:      5,
    status:      'off-duty',
    shift:       'Evening',
    shiftHours:  '14:00 - 22:00',
    email:       'd.miller@heks-kitchen.com',
    phoneNumber: '+1-555-0103',
    avatar:      'https://ui-avatars.com/api/?name=David+Miller&background=1e3a5f&color=7eb8f7&size=64',
  },
  {
    id:          'ST-1299',
    employeeId:  'EMP-2026-004',
    name:        'Emma Watson',
    displayName: 'Emma W.',
    role:        'Host',
    roleId:      8,
    status:      'active',
    shift:       'Evening',
    shiftHours:  '14:00 - 22:00',
    email:       'e.rod@heks-kitchen.com',
    phoneNumber: '+1-555-0104',
    avatar:      'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=1e3a5f&color=7eb8f7&size=64',
  },
];

// ── Upcoming shifts ────────────────────────────────────────────────────────
export const upcomingShifts: UpcomingShift[] = [
  { name: 'Thomas Wright', shift: 'Night (22:00 - 06:00)', startsIn: '2H' },
  { name: 'Lisa Kang',     shift: 'Night (22:00 - 06:00)', startsIn: '2H' },
];

// ── Compliance alerts ──────────────────────────────────────────────────────
export const complianceAlerts: ComplianceAlert[] = [
  {
    id: 1,
    level: 'error',
    title: '2 Breaks Overdue',
    description: "Staff 'Sarah Jenkins' has exceeded 4h without a break.",
  },
];