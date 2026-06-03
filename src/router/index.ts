import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useLogin } from '../composables/useLogin';
import DashboardLayout from '../layouts/DashboardLayout.vue';

// ADD New

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/tables',
    meta: { requiresAuth: true },
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

// Authentication guard
router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { isAuthenticated } = useLogin();
  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !isAuthenticated()) {
    // Redirect to login if trying to access protected route
    next('/login');
  } else if (to.path === '/login' && isAuthenticated()) {
    // Redirect to dashboard if already logged in and trying to access login
    next('/tables');
  } else {
    next();
  }
});

export default router;
