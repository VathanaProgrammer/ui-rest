export interface Category {
  id: number;
  name: string;
  iconColor: string;
  iconBg: string;
  itemCount: number;
  status: 'active' | 'inactive';
  displayOrder: string;
}

export interface PaginationInfo {
  current: number;
  total: number;
  showing: string;
  totalItems: number;
}

export interface Breadcrumb {
  label: string;
  path: string;
}