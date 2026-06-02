import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DashboardLayout from '../layouts/DashboardLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/tables',
    children: [
      {
        path: 'tables',
        name: 'Tables',
        component: () => import('../views/TablesView.vue'),
      },
      {
        path: 'pos',
        name: 'POS',
        component: () => import('../views/PlaceholderView.vue'),
      },
      {
        path: 'kds',
        name: 'KDS',
        component: () => import('../components/KDS/kds.vue'),
      },
      {
        path: 'tracking',
        name: 'Tracking',
        component: () => import('../views/PlaceholderView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
