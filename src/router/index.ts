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
      // POSView
      {
        path: '/pos',
        name: 'POS',
        component: () => import('../components/POS/POSView.vue'),
      },
      
      {
        path: 'kds',
        name: 'KDS',
        component: () => import('../components/KDS/KDSView.vue')
      },
      {
        path: 'tracking',
        name: 'Tracking',
        component: () => import('../components/Tracking/TrackingView.vue'),
      },
      // StaffView
      {
        path: 'staff',           
        name: 'Staff',
        component: () => import('../components/Staff/StaffView.vue'),
      },

       // SettingView 
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/SettingsView.vue'),
      },
      // SupportView
      {
        path: '/support',
        name: 'Support',
        component: () => import('../views/SupportView.vue'),
      },
      
    ],
  },

 

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
