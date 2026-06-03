export type StaffStatus = 'active' | 'on-break' | 'off-duty';
export type ShiftName = 'Morning' | 'Evening' | 'Night';

export interface StaffMember {
  id: string;           // e.g. "ST-8821"
  name: string;
  role: string;
  status: StaffStatus;
  shift: ShiftName;
  shiftHours: string;   // e.g. "06:00 - 14:00"
  email: string;
  avatar: string;       // URL
}

export interface UpcomingShift {
  name: string;
  shift: string;        // e.g. "Night (22:00 - 06:00)"
  startsIn: string;     // e.g. "2H"
}

export interface ComplianceAlert {
  id: number;
  level: 'error' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface StaffStats {
  totalStaff: number;
  totalChange: string;      // e.g. "+2 this week"
  clockedIn: number;
  capacity: string;         // e.g. "88% Capacity"
  onBreak: number;
  nextShift: string;        // e.g. "Next shift in 45m"
}