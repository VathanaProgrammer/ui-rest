import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useLogin } from '../composables/useLogin';
import DashboardLayout from '../layouts/DashboardLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/result',
    name: 'TestResult',
    component: () => import('../views/TestResultView.vue'),
    meta: { requiresAuth: false } // Public for testing
  },
  {
    path: '/help',
    name: 'HelpHub',
    component: () => import('../views/HelpHubView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/help/api',
    name: 'ApiHelp',
    component: () => import('../views/ApiHelpView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/help/flow',
    name: 'FlowHelp',
    component: () => import('../views/FlowHelpView.vue'),
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
      // POSView
      {
        path: 'pos',
        name: 'POS',
        component: () => import('../components/POS/POSView.vue'),
      },
      {
        path: 'menu-management',
        name: 'MenuManagement',
        component: () => import('../views/MenuManagementView.vue'),
      },
      {
        path: 'settings/menu',
        name: 'MenuSettings',
        component: () => import('../views/MenuManagementView.vue'),
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
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/SettingsView.vue'),
      },
      // SupportView
      {
        path: 'support',
        name: 'Support',
        component: () => import('../views/SupportView.vue'),
      },
      //CategoryView
      {
        path: '/category',
        name: 'Category',
        component: () => import('../components/Category/CategoryView.vue'),
      },
      {
        path: "/show",
        name: "Show",
        component: () => import('../components/POS/components/Show.vue'),
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
