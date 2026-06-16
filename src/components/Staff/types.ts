export type StaffStatus = 'active' | 'on-break' | 'off-duty';
export type ShiftName = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface StaffMember {
  id: string;             // internal e.g. "ST-8821"
  employeeId: string;     // API-assigned e.g. "EMP-2026-089"
  name: string;           // API: fullName
  displayName: string;    // API: displayName
  role: string;           // resolved role label e.g. "Manager"
  roleId: number;         // exact ID from API
  status: StaffStatus;    // API: currentStatus (UPPER_SNAKE mapped to kebab)
  shift: ShiftName;
  shiftHours: string;     // e.g. "06:00 - 14:00"
  email: string;          // API: emailAddress
  phoneNumber: string;    // API: phoneNumber
  avatar: string;         // API: avatarUrl
}

export interface UpcomingShift {
  name: string;
  shift: string;          // e.g. "Night (22:00 - 06:00)"
  startsIn: string;       // e.g. "2H"
}

export interface ComplianceAlert {
  id: number;
  level: 'error' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface StaffStats {
  totalStaff: number;
  totalChange: string;    // e.g. "+2 this week"
  clockedIn: number;
  capacity: string;       // e.g. "88% Capacity"
  onBreak: number;
  nextShift: string;      // e.g. "Next shift in 45m"
}