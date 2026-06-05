import type { Category, PaginationInfo, Breadcrumb } from './types';

export const breadcrumbs: Breadcrumb[] = [
  { label: 'Menu Management', path: '/menu' },
  { label: 'Categories', path: '/category' },
];

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Appetizers',
    iconColor: '#3b82f6',
    iconBg: '#1e3a5f',
    itemCount: 12,
    status: 'active',
    displayOrder: '01',
  },
  {
    id: 2,
    name: 'Signature Mains',
    iconColor: '#10b981',
    iconBg: '#064e3b',
    itemCount: 24,
    status: 'active',
    displayOrder: '02',
  },
  {
    id: 3,
    name: 'Sides',
    iconColor: '#f97316',
    iconBg: '#431407',
    itemCount: 18,
    status: 'active',
    displayOrder: '03',
  },
  {
    id: 4,
    name: 'Refreshing Beverages',
    iconColor: '#06b6d4',
    iconBg: '#0c4a6e',
    itemCount: 42,
    status: 'active',
    displayOrder: '04',
  },
  {
    id: 5,
    name: 'Chef Specials',
    iconColor: '#f59e0b',
    iconBg: '#451a03',
    itemCount: 6,
    status: 'inactive',
    displayOrder: '05',
  },
];

export const mockPagination: PaginationInfo = {
  current: 1,
  total: 3,
  showing: '1-5',
  totalItems: 18,
};