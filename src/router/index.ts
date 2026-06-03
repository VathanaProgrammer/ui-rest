import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DashboardLayout from '../layouts/DashboardLayout.vue';
// ADD New





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
        component: () => import('../views/PlaceholderView.vue'),
      },
      {
        path: 'tracking',
        name: 'Tracking',
        component: () => import('../views/PlaceholderView.vue'),
      },

       // SettingView 
      {
        path: '/settings',
        name: 'Settings',
        //component: SettingsView,
        component: () => import('../views/SettingsView.vue'),
      },
      // SupportView
      {
        path: '/support',
        name: 'Support',
        component: () => import('../views/SupportView.vue'),
      },
      // POSView
      {
        path: '/pos',
        name: 'POS',
        component: () => import('../components/POS/POSView.vue'),
      }
    ],
  },

 

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
